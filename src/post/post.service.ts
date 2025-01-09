import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';  // Import DTO

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new post using the DTO
  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { authorId, content, imageUrl, videoUrl } = createPostDto;

    // Ensure the user exists
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new Error('User not found');
    }

    const post = this.postRepository.create({
      content,
      imageUrl,
      videoUrl,
      author,
    });

    return this.postRepository.save(post);
  }

  // Get all posts
  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  // Get a single post by ID
  async findOne(id: string): Promise<PostEntity | undefined> {
    return this.postRepository.findOne({ where: { id }, relations: ['author'] });
  }

  // Delete a post by ID
  async delete(id: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new Error('Post not found');
    }

    await this.postRepository.delete(id);
  }
}
