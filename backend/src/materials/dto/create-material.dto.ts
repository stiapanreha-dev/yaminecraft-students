import { IsString, IsOptional, IsEnum, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialCategory } from '@prisma/client';

export class FileDto {
  @IsString()
  filename: string;

  @IsString()
  fileUrl: string;

  @IsInt()
  @Min(0)
  fileSize: number;

  @IsString()
  fileType: string;
}

export class CreateMaterialDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsEnum(MaterialCategory)
  category: MaterialCategory;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];
}
