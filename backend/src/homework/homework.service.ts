import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { GradeHomeworkDto } from './dto/grade-homework.dto';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHomeworkDto, createdById: string) {
    const homework = await this.prisma.homework.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        createdById,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: { select: { submissions: true, assignments: true } },
      },
    });

    // Create assignments if studentIds provided
    if (dto.studentIds && dto.studentIds.length > 0) {
      await this.prisma.homeworkAssignment.createMany({
        data: dto.studentIds.map(studentId => ({
          homeworkId: homework.id,
          studentId,
        })),
        skipDuplicates: true,
      });
    }

    // Create files if provided
    if (dto.files && dto.files.length > 0) {
      await this.prisma.homeworkFile.createMany({
        data: dto.files.map(file => ({
          homeworkId: homework.id,
          filename: file.filename,
          fileUrl: file.fileUrl,
          fileSize: file.fileSize,
          fileType: file.fileType,
        })),
      });
    }

    return this.findOne(homework.id);
  }

  async findAll() {
    return this.prisma.homework.findMany({
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        assignments: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        files: true,
        _count: { select: { submissions: true, assignments: true, files: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        assignments: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        files: true,
        submissions: userId
          ? {
              where: { studentId: userId },
              include: {
                student: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            }
          : {
              include: {
                student: {
                  select: { id: true, firstName: true, lastName: true, photoUrl: true, class: true },
                },
              },
            },
        _count: { select: { submissions: true, assignments: true, files: true } },
      },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return {
      ...homework,
      mySubmission: userId ? homework.submissions[0] || null : undefined,
    };
  }

  async findMyHomework(userId: string) {
    // Get homework that is either:
    // 1. Has no assignments (available to all students)
    // 2. Has an assignment for this specific student
    const allHomework = await this.prisma.homework.findMany({
      where: {
        OR: [
          // No assignments - available to all
          { assignments: { none: {} } },
          // Assigned to this student
          { assignments: { some: { studentId: userId } } },
        ],
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        files: true,
        submissions: {
          where: { studentId: userId },
        },
        _count: { select: { submissions: true, assignments: true, files: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    return allHomework.map(hw => ({
      ...hw,
      mySubmission: hw.submissions[0] || null,
      isOverdue: new Date() > hw.dueDate && !hw.submissions[0],
    }));
  }

  async update(id: string, dto: UpdateHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    // Update homework data
    const { studentIds, files, ...updateData } = dto;

    await this.prisma.homework.update({
      where: { id },
      data: {
        ...updateData,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });

    // Update assignments if studentIds provided
    if (studentIds !== undefined) {
      // Delete all existing assignments
      await this.prisma.homeworkAssignment.deleteMany({
        where: { homeworkId: id },
      });

      // Create new assignments if studentIds has items
      if (studentIds.length > 0) {
        await this.prisma.homeworkAssignment.createMany({
          data: studentIds.map(studentId => ({
            homeworkId: id,
            studentId,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Update files if provided
    if (files !== undefined) {
      // Delete all existing files
      await this.prisma.homeworkFile.deleteMany({
        where: { homeworkId: id },
      });

      // Create new files if provided
      if (files.length > 0) {
        await this.prisma.homeworkFile.createMany({
          data: files.map(file => ({
            homeworkId: id,
            filename: file.filename,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            fileType: file.fileType,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const homework = await this.prisma.homework.findUnique({ where: { id } });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    await this.prisma.homework.delete({ where: { id } });
    return { message: 'Homework deleted' };
  }

  async submit(homeworkId: string, studentId: string, dto: SubmitHomeworkDto) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    const existing = await this.prisma.homeworkSubmission.findUnique({
      where: { homeworkId_studentId: { homeworkId, studentId } },
    });

    if (existing) {
      return this.prisma.homeworkSubmission.update({
        where: { id: existing.id },
        data: {
          content: dto.content,
          fileUrl: dto.fileUrl,
          status: SubmissionStatus.SUBMITTED,
          submittedAt: new Date(),
        },
        include: {
          homework: true,
          student: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
    }

    return this.prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        studentId,
        content: dto.content,
        fileUrl: dto.fileUrl,
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        homework: true,
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async grade(homeworkId: string, studentId: string, dto: GradeHomeworkDto) {
    const submission = await this.prisma.homeworkSubmission.findUnique({
      where: { homeworkId_studentId: { homeworkId, studentId } },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.homeworkSubmission.update({
      where: { id: submission.id },
      data: {
        grade: dto.grade,
        comment: dto.comment,
        status: dto.status || SubmissionStatus.GRADED,
        gradedAt: new Date(),
      },
      include: {
        homework: true,
        student: {
          select: { id: true, firstName: true, lastName: true, photoUrl: true },
        },
      },
    });
  }

  async getSubmissions(homeworkId: string) {
    const homework = await this.prisma.homework.findUnique({
      where: { id: homeworkId },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    return this.prisma.homeworkSubmission.findMany({
      where: { homeworkId },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, photoUrl: true, class: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
