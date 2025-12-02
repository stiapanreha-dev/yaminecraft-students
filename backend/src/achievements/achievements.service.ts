import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RatingsService } from '../ratings/ratings.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    private prisma: PrismaService,
    private ratingsService: RatingsService,
  ) {}

  async create(dto: CreateAchievementDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const achievement = await this.prisma.achievement.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        points: dto.points,
        date: new Date(dto.date),
      },
    });

    await this.ratingsService.recalculateRating(dto.userId);

    return achievement;
  }

  async findAll() {
    return this.prisma.achievement.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.achievement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return achievement;
  }

  async update(id: string, dto: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const updated = await this.prisma.achievement.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });

    await this.ratingsService.recalculateRating(achievement.userId);

    return updated;
  }

  async remove(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    await this.prisma.achievement.delete({ where: { id } });
    await this.ratingsService.recalculateRating(achievement.userId);

    return { message: 'Achievement deleted' };
  }
}
