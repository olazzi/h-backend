import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async followUser(followerId: string, followingId: string) {
    const follower = await this.userRepository.findOneBy({ id: followerId });
    const following = await this.userRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    const follow = this.followRepository.create({ follower, following });
    return this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string) {
    const result = await this.followRepository.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });
    return result.affected > 0;
  }

  async getFollowers(userId: string) {
    return this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string) {
    return this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }
}
