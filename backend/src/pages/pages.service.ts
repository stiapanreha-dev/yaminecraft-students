import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`Page "${slug}" not found`);
    }

    return page;
  }

  async findAll() {
    return this.prisma.page.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async upsert(slug: string, data: { title: string; content: string }) {
    return this.prisma.page.upsert({
      where: { slug },
      update: {
        title: data.title,
        content: data.content,
      },
      create: {
        slug,
        title: data.title,
        content: data.content,
      },
    });
  }
}
