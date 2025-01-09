import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // Create a new comment
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, userId, postId } = createCommentDto;

    // Ensure the user and post exist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!user || !post) {
      throw new Error('User or Post not found');
    }

    const comment = this.commentRepository.create({
      content,
      user,
      post,
    });

    return this.commentRepository.save(comment);
  }

  // Get all comments for a post
  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({ where: { post: { id: postId } }, relations: ['user', 'post'] });
  }

  // Delete a comment by ID
  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
