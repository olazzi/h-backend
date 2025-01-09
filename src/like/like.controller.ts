import { Controller, Post, Delete, Param, Get, Body } from '@nestjs/common';
import { LikesService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto'; // DTO for liking a post
import { Like } from './like.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // Like a post
  @Post()
  async likePost(@Body() createLikeDto: CreateLikeDto): Promise<Like> {
    return this.likesService.likePost(createLikeDto);
  }

  // Unlike a post
  @Delete(':postId')
  async unlikePost(@Param('postId') postId: string, @Body() userId: string): Promise<void> {
    return this.likesService.unlikePost(postId, userId);
  }

  // Get all likes for a post
  @Get(':postId')
  async getLikes(@Param('postId') postId: string): Promise<Like[]> {
    return this.likesService.getLikes(postId);
  }
}
