import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    if (followerId === followingId) {
      throw new ConflictException("You cannot follow yourself");
    }

    const follower = await this.userRepository.findOneBy({ id: followerId });
    const following = await this.userRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      throw new NotFoundException('One or both users not found');
    }

    // ✅ Prevent duplicate follows
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    const follow = this.followRepository.create({ follower, following });
    return this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepository.remove(follow);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const followers = await this.followRepository
        .createQueryBuilder('follow')
        .select('follow.followerId')  // ✅ Select only follower IDs
        .where('follow.followingId = :userId', { userId })
        .getRawMany();

    return followers.map(f => f.followerId); // ✅ Return only follower IDs
}


async getFollowing(userId: string): Promise<string[]> {
  const user = await this.userRepository.findOneBy({ id: userId });
  if (!user) throw new NotFoundException('User not found');

  const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
  });

  // ✅ Return only an array of user IDs
  return following.map(follow => follow.following.id);
}
}