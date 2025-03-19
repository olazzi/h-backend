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

  // ✅ Create a new comment
  async create(createCommentDto: CreateCommentDto): Promise<{ success: boolean; message: string; data?: Comment }> {
    const { content, userId, postId } = createCommentDto;

    // Ensure the user and post exist
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: `User with ID ${userId} not found` };
    }

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      return { success: false, message: `Post with ID ${postId} not found` };
    }

    const comment = this.commentRepository.create({ content, user, post });
    const savedComment = await this.commentRepository.save(comment);

    return { success: true, message: 'Comment created successfully', data: savedComment };
  }

  // ✅ Get all comments for a post
  async findByPost(postId: string): Promise<{ success: boolean; message: string; data: any[] }> {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'], 
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          id: true,
          username: true,
          surname: true,
          profilePicture: true,
        }
      }
    });
  
    if (!comments.length) {
      return { success: false, message: `No comments found for post with ID ${postId}`, data: [] };
    }
  
    // ✅ Manually format response to exclude unnecessary fields
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        username: comment.user.username,
        surname: comment.user.surname,
        profilePicture: comment.user.profilePicture,
      }
    }));
  
    return { success: true, message: 'Comments retrieved successfully', data: formattedComments };
  }
  

  // ✅ Delete a comment by ID
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.commentRepository.delete(id);

    if (result.affected === 0) {
      return { success: false, message: `Comment with ID ${id} not found` };
    }

    return { success: true, message: `Comment with ID ${id} deleted successfully` };
  }
}
