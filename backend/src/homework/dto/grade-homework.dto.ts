import { IsInt, IsOptional, IsString, Min, Max, IsEnum } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';

export class GradeHomeworkDto {
  @IsInt()
  @Min(1)
  @Max(10)
  grade: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}
