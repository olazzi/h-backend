import { Controller, Post, Delete, Param, Get, Body, BadRequestException, Query } from '@nestjs/common';
import { LikesService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto'; // DTO for liking a post
import { Like } from './like.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // Like a post
  @Post()
  async likePost(@Body() createLikeDto: CreateLikeDto): Promise<Like> {
    return this.likesService.likePost(createLikeDto);
  }

  @Delete(':postId')
  async unlikePost(@Param('postId') postId: string, @Body() body: { userId: string }): Promise<void> {
      return this.likesService.unlikePost(postId, body.userId);
  }
  

  // Get all likes for a post
  @Get(':postId')
  async getLikes(@Param('postId') postId: string): Promise<Like[]> {
    return this.likesService.getLikes(postId);
  }

  @Get('user/:userId')
  async getLikedPostsByUser(@Param('userId') userId: string): Promise<string[]> {
    return this.likesService.getLikedPostsByUser(userId);
  }

  @Get()
  async getLikesForMultiplePosts(@Query('postIds') postIds: string) {
    if (!postIds) {
      throw new BadRequestException('No postIds provided');
    }

    const postIdArray = postIds.split(','); // Convert "id1,id2" to array

    console.log('🔄 Fetching likes for multiple posts:', postIdArray);

    return this.likesService.getMultiplePostLikes(postIdArray);
  }

}
