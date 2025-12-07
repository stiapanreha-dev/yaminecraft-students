import { IsString, IsOptional } from 'class-validator';

export class RegisterEventDto {
  @IsOptional()
  @IsString()
  organization?: string;
}
