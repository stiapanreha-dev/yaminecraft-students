import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { SubmitHomeworkDto } from './dto/submit-homework.dto';
import { GradeHomeworkDto } from './dto/grade-homework.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('homework')
@UseGuards(JwtAuthGuard)
export class HomeworkController {
  constructor(private homeworkService: HomeworkService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() dto: CreateHomeworkDto, @CurrentUser() user: any) {
    return this.homeworkService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.homeworkService.findAll();
  }

  @Get('my')
  findMyHomework(@CurrentUser() user: any) {
    return this.homeworkService.findMyHomework(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.homeworkService.findOne(id, user.role === Role.STUDENT ? user.id : undefined);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() dto: UpdateHomeworkDto) {
    return this.homeworkService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(id);
  }

  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitHomeworkDto,
    @CurrentUser() user: any,
  ) {
    return this.homeworkService.submit(id, user.id, dto);
  }

  @Patch(':id/grade/:studentId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  grade(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @Body() dto: GradeHomeworkDto,
  ) {
    return this.homeworkService.grade(id, studentId, dto);
  }

  @Get(':id/submissions')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  getSubmissions(@Param('id') id: string) {
    return this.homeworkService.getSubmissions(id);
  }
}
