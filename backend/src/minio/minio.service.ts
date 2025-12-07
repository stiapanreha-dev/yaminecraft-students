import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

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
    await this.ensureBucket();
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      // Set public read policy
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
    await this.client.removeObject(this.bucket, filename);
  }

  getPublicUrl(filename: string): string {
    return `/${this.bucket}/${filename}`;
  }
}
