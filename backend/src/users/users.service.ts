import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        birthDate: true,
        photoUrl: true,
        class: true,
        bio: true,
        createdAt: true,
        rating: true,
      },
      orderBy: { lastName: 'asc' },
    });
    return users;
  }

  async findStudents() {
    const users = await this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        birthDate: true,
        photoUrl: true,
        class: true,
        bio: true,
        createdAt: true,
        rating: true,
      },
      orderBy: { lastName: 'asc' },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        birthDate: true,
        photoUrl: true,
        class: true,
        bio: true,
        createdAt: true,
        rating: true,
        achievements: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string, currentUserRole: Role) {
    // Allow admins and teachers to edit other profiles, others can only edit their own
    const canEditOthers = currentUserRole === Role.ADMIN || currentUserRole === Role.TEACHER;
    if (currentUserId !== id && !canEditOthers) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        birthDate: true,
        photoUrl: true,
        class: true,
        bio: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    return updated;
  }

  async getStats() {
    const [studentsCount, achievementsCount, eventsCount] = await Promise.all([
      this.prisma.user.count({ where: { role: Role.STUDENT } }),
      this.prisma.achievement.count(),
      this.prisma.event.count(),
    ]);

    return {
      students: studentsCount,
      achievements: achievementsCount,
      events: eventsCount,
    };
  }

  async findPendingTeachers() {
    return this.prisma.user.findMany({
      where: { role: Role.PENDING_TEACHER },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveTeacher(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== Role.PENDING_TEACHER) {
      throw new BadRequestException('User is not a pending teacher');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: Role.TEACHER },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async rejectTeacher(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== Role.PENDING_TEACHER) {
      throw new BadRequestException('User is not a pending teacher');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: Role.VISITOR },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
  }
}
