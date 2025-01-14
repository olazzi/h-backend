import { Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { FollowsService } from './follow.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':followerId/:followingId')
  follow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  unfollow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }
}
