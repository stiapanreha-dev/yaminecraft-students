import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private bucket: string;
  private isAvailable = false;

  constructor(private configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'minio'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000')),
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin123'),
    });
    this.bucket = this.configService.get('MINIO_BUCKET', 'uploads');
  }

  async onModuleInit() {
    try {
      await this.ensureBucket();
      this.isAvailable = true;
      this.logger.log('MinIO connected successfully');
    } catch (error) {
      this.logger.warn(`MinIO not available: ${error.message}. File uploads will fail.`);
    }
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
  ): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('MinIO is not available');
    }
    await this.client.putObject(
      this.bucket,
      filename,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );
    return `/${this.bucket}/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    if (!this.isAvailable) return;
    await this.client.removeObject(this.bucket, filename);
  }

  getPublicUrl(filename: string): string {
    return `/${this.bucket}/${filename}`;
  }
}
