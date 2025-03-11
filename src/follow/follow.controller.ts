import { Controller, Post, Delete, Param, Get, HttpCode } from '@nestjs/common';
import { FollowsService } from './follow.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':followerId/:followingId')
  async follow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return await this.followsService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  @HttpCode(200)
  async unfollow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return await this.followsService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return await this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return await this.followsService.getFollowing(userId);
  }
}
