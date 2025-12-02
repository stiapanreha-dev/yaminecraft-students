import { IsString, IsInt, IsDateString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Category } from '@prisma/client';

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  points?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}
