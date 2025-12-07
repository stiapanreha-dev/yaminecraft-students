import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MinioService } from '../minio/minio.service';

const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return callback(new BadRequestException('Only image files are allowed'), false);
  }
  callback(null, true);
};

const documentFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx)$/i)) {
    return callback(new BadRequestException('Допустимые форматы: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, изображения'), false);
  }
  callback(null, true);
};

@Controller('uploads')
export class UploadsController {
  constructor(private readonly minioService: MinioService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filename = `${randomUUID()}${extname(file.originalname)}`;
    const url = await this.minioService.uploadFile(file, filename);

    return {
      url,
      filename,
    };
  }

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: documentFileFilter,
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filename = `${randomUUID()}${extname(file.originalname)}`;
    const url = await this.minioService.uploadFile(file, filename);

    return {
      url,
      filename: file.originalname,
      storedFilename: filename,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
