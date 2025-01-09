import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto'; // This DTO will define the input data structure
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Create a new comment on a post
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  // Get all comments for a post
  @Get(':postId')
  async findByPost(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentsService.findByPost(postId);
  }

  // Delete a comment by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.remove(id);
  }
}
