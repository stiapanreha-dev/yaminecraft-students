import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(dto: CreateArticleDto, authorId: string) {
    const baseSlug = this.generateSlug(dto.title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return this.prisma.article.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        excerpt: dto.excerpt,
        imageUrl: dto.imageUrl,
        projectId: dto.projectId,
        authorId,
        published: dto.published ?? false,
        publishedAt: dto.published ? new Date() : null,
      },
      include: {
        project: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async findAll(projectId?: string, published?: boolean) {
    return this.prisma.article.findMany({
      where: {
        ...(projectId && { projectId }),
        ...(published !== undefined && { published }),
      },
      include: {
        project: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findLatest(limit: number = 2) {
    return this.prisma.article.findMany({
      where: { published: true },
      include: {
        project: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async findOne(idOrSlug: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        project: true,
        author: {
          select: { id: true, firstName: true, lastName: true, photoUrl: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    let slug = article.slug;
    if (dto.title && dto.title !== article.title) {
      const baseSlug = this.generateSlug(dto.title);
      slug = baseSlug;
      let counter = 1;

      while (await this.prisma.article.findFirst({
        where: { slug, NOT: { id } },
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const wasPublished = article.published;
    const willBePublished = dto.published ?? article.published;

    return this.prisma.article.update({
      where: { id },
      data: {
        ...dto,
        slug,
        publishedAt: !wasPublished && willBePublished ? new Date() : article.publishedAt,
      },
      include: {
        project: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async remove(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    await this.prisma.article.delete({ where: { id } });
    return { message: 'Article deleted' };
  }
}
