import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // ✅ Like a post
  async likePost(createLikeDto: CreateLikeDto): Promise<Like> {
    const { userId, postId } = createLikeDto;

    // Ensure the user and post exist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }

    // Check if the user has already liked the post
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      throw new BadRequestException('User has already liked this post');
    }

    const like = this.likeRepository.create({ user, post });

    return this.likeRepository.save(like);
  }

  // ✅ Unlike a post
  async unlikePost(postId: string, userId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.delete(like.id);
  }

  // ✅ Get all likes for a specific post
  async getLikes(postId: string): Promise<Like[]> {
    return this.likeRepository.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'],
    });
  }

  // ✅ Get all posts liked by a specific user
  async getLikedPostsByUser(userId: string): Promise<string[]> {
    // Ensure user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });

    // Return only post IDs
    return likes.map((like) => like.post.id);
  }
}
