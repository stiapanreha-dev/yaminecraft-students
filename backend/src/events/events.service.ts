import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, createdById: string) {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        location: dto.location,
        address: dto.address,
        organizer: dto.organizer,
        imageUrl: dto.imageUrl,
        eventType: dto.eventType,
        level: dto.level,
        maxParticipants: dto.maxParticipants,
        registrationOpen: dto.registrationOpen ?? true,
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: { select: { registrations: true } },
      },
    });
  }

  async findAll(type?: 'upcoming' | 'past') {
    const now = new Date();
    const where = type === 'upcoming'
      ? { date: { gte: now } }
      : type === 'past'
      ? { date: { lt: now } }
      : {};

    return this.prisma.event.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { date: type === 'past' ? 'desc' : 'asc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        registrations: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, photoUrl: true },
            },
          },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const isRegistered = userId
      ? event.registrations.some(r => r.userId === userId)
      : false;

    return {
      ...event,
      isRegistered,
      registrationsCount: event._count.registrations,
    };
  }

  async findMyEvents(userId: string) {
    return this.prisma.event.findMany({
      where: {
        registrations: {
          some: { userId },
        },
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        registrations: {
          where: { userId },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: { select: { registrations: true } },
      },
    });
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted' };
  }

  async register(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.registrationOpen) {
      throw new BadRequestException('Registration is closed');
    }

    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      throw new BadRequestException('Event is full');
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (existing) {
      throw new ConflictException('Already registered');
    }

    return this.prisma.eventRegistration.create({
      data: { eventId, userId },
      include: {
        event: true,
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async unregister(eventId: string, userId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.prisma.eventRegistration.delete({
      where: { id: registration.id },
    });

    return { message: 'Unregistered successfully' };
  }

  async getRegistrations(eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, photoUrl: true, class: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
