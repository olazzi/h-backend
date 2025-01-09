import { IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  postId: string;
}
