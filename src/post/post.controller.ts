import { Controller, Post, Body, UploadedFile, Get, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import storage from '../config/multer.config';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Create a new post with the DTO
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PostEntity> {
    console.log("📥 Received request at /posts");
    console.log("Request body:", createPostDto);
    console.log("Uploaded file:", file);
    return this.postService.create(createPostDto, file);
  }

  // Get all posts (Global Feed)
  @Get()
  async findAll(@Query() query: PaginationQueryDto): Promise<PostEntity[]> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    console.log(`🔍 Fetching all posts for page: ${page}, limit: ${limit}`);
    return this.postService.findAllPaginated(page, limit);
  }

  // ✅ New Endpoint: Get all posts by a specific user
  @Get('/user/:userId')
  async findUserPosts(
    @Param('userId') userId: string,
    @Query() query: PaginationQueryDto
  ): Promise<PostEntity[]> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    console.log(`🔍 Fetching posts for userId: ${userId}, page: ${page}, limit: ${limit}`);
    return this.postService.findByAuthorIdPaginated(userId, page, limit);
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
