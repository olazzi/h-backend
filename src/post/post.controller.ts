import { Controller, Post, Body,UploadedFile, Get, Param, Delete, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto'; // Import the DTO
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import storage from '../config/multer.config';
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Create a new post with the DTO
  @Post()
  @UseInterceptors(FileInterceptor('image',{storage}))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PostEntity> {
    console.log("📥 Received request at /posts");
    console.log("Request body:", createPostDto);
    console.log("Uploaded file:", file);
    return this.postService.create(createPostDto, file);
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
