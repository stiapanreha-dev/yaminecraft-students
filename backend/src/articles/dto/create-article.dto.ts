import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
