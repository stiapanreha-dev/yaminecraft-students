import { IsString, IsOptional, Matches } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid HEX color (e.g., #FF5500)' })
  color: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
