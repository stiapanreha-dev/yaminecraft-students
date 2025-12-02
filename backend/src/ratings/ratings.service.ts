import { Injectable } from '@nestjs/common';
import { Category, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(period: string = 'all', limit: number = 100) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        user: {
          role: Role.STUDENT,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            class: true,
          },
        },
      },
      orderBy: this.getOrderBy(period),
      take: limit,
    });

    return ratings.map((r, index) => ({
      ...r,
      rank: index + 1,
    }));
  }

  async findByUserId(userId: string) {
    return this.prisma.rating.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            class: true,
          },
        },
      },
    });
  }

  async recalculateRating(userId: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: { userId },
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let totalPoints = 0;
    let yearPoints = 0;
    let monthPoints = 0;
    let sportPoints = 0;
    let studyPoints = 0;
    let creativityPoints = 0;
    let volunteerPoints = 0;

    for (const achievement of achievements) {
      const achievementDate = new Date(achievement.date);
      const points = achievement.points;

      totalPoints += points;

      if (achievementDate.getFullYear() === currentYear) {
        yearPoints += points;
        if (achievementDate.getMonth() === currentMonth) {
          monthPoints += points;
        }
      }

      switch (achievement.category) {
        case Category.SPORT:
          sportPoints += points;
          break;
        case Category.STUDY:
          studyPoints += points;
          break;
        case Category.CREATIVITY:
          creativityPoints += points;
          break;
        case Category.VOLUNTEER:
          volunteerPoints += points;
          break;
      }
    }

    return this.prisma.rating.upsert({
      where: { userId },
      update: {
        totalPoints,
        yearPoints,
        monthPoints,
        sportPoints,
        studyPoints,
        creativityPoints,
        volunteerPoints,
        lastUpdated: new Date(),
      },
      create: {
        userId,
        totalPoints,
        yearPoints,
        monthPoints,
        sportPoints,
        studyPoints,
        creativityPoints,
        volunteerPoints,
      },
    });
  }

  private getOrderBy(period: string) {
    switch (period) {
      case 'year':
        return { yearPoints: 'desc' as const };
      case 'month':
        return { monthPoints: 'desc' as const };
      default:
        return { totalPoints: 'desc' as const };
    }
  }
}
