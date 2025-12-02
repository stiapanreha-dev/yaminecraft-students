import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { MaterialCategory } from '@prisma/client';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMaterialDto, createdById: string) {
    const { files, ...materialData } = dto;

    return this.prisma.material.create({
      data: {
        ...materialData,
        createdById,
        files: {
          create: files.map(file => ({
            filename: file.filename,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            fileType: file.fileType,
          })),
        },
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        files: true,
      },
    });
  }

  async findAll(category?: MaterialCategory) {
    return this.prisma.material.findMany({
      where: category ? { category } : {},
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const material = await this.prisma.material.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        files: true,
      },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    const { files, ...materialData } = dto;

    // Если переданы файлы, удаляем старые и создаём новые
    if (files !== undefined) {
      await this.prisma.materialFile.deleteMany({
        where: { materialId: id },
      });
    }

    return this.prisma.material.update({
      where: { id },
      data: {
        ...materialData,
        ...(files !== undefined && {
          files: {
            create: files.map(file => ({
              filename: file.filename,
              fileUrl: file.fileUrl,
              fileSize: file.fileSize,
              fileType: file.fileType,
            })),
          },
        }),
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        files: true,
      },
    });
  }

  async remove(id: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    // Файлы удалятся автоматически благодаря onDelete: Cascade
    await this.prisma.material.delete({ where: { id } });
    return { message: 'Material deleted' };
  }

  async incrementDownloads(id: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return this.prisma.material.update({
      where: { id },
      data: {
        downloads: { increment: 1 },
      },
      include: {
        files: true,
      },
    });
  }
}
