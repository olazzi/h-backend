import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ✅ Create a new comment on a post
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    const response = await this.commentsService.create(createCommentDto);
    return response;
  }

  // ✅ Get all comments for a post
  @Get(':postId')
  async findByPost(@Param('postId') postId: string) {
    const response = await this.commentsService.findByPost(postId);
    return response;
  }

  // ✅ Delete a comment by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const response = await this.commentsService.remove(id);
    return response;
  }
}
