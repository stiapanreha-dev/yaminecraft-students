import { IsString, IsInt, IsDateString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateAchievementDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Category)
  category: Category;

  @IsInt()
  @Min(1)
  @Max(1000)
  points: number;

  @IsDateString()
  date: string;
}
