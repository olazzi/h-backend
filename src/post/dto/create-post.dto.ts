import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsUUID()
  authorId: string;
}
