import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto'; // Import the DTO

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Create a new post with the DTO
  @Post()
  async create(@Body() postData: CreatePostDto) {  // Use CreatePostDto here
    return this.postService.create(postData);
  }

  // Get all posts
  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  // Get a single post by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // Delete a post by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
