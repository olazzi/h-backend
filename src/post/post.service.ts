import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';  // Import DTO
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, file?: Express.Multer.File): Promise<PostEntity> {
    const { authorId, content } = createPostDto;

    console.log("Received post creation request:");
    console.log("Author ID:", authorId);
    console.log("Content:", content);
    console.log("File received:", file ? file.originalname : "No file uploaded");

    // Ensure the user exists
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      console.error("Error: User not found with ID", authorId);
      throw new Error('User not found');
    }

    let imageUrl = '';
    if (file) {
      try {
        console.log("Uploading image to Cloudinary...");
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'samples',
        });
        imageUrl = result.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        throw new Error('Image upload failed');
      }
    }

    console.log("Creating post in database...");
    const post = this.postRepository.create({
      content,
      imageUrl,
      author,
    });

    const savedPost = await this.postRepository.save(post);
    console.log("Post saved successfully:", savedPost);

    return savedPost;
  }

  // Get all posts
  async findAll(): Promise<any[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments') // ✅ Count comments
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  
    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture,
      },
      likeCount: post.likes.length,
      commentCount: post['commentCount'], // ✅ Ensure commentCount is included
    }));
  }
  

  // Get all posts with pagination
  async findAllPaginated(page: number, limit: number): Promise<any[]> {
    const skip = (page - 1) * limit;
    console.log(`Fetching posts: page ${page}, limit ${limit}, skip ${skip}`);
  
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments') // ✅ Count comments
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  
    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture,
      },
      likeCount: post.likes.length,
      commentCount: post['commentCount'], // ✅ Ensure commentCount is included
    }));
  }
  
  // Get posts by author without pagination
  async findByAuthorId(authorId: string): Promise<PostEntity[]> {
    return this.postRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'comments', 'likes'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get posts by author with pagination
  async findByAuthorIdPaginated(authorId: string, page: number, limit: number): Promise<any[]> {
    const skip = (page - 1) * limit;
    console.log(`Fetching posts for author ${authorId}: page ${page}, limit ${limit}, skip ${skip}`);
  
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .where('post.author.id = :authorId', { authorId })
      .loadRelationCountAndMap('post.commentCount', 'post.comments') // ✅ Count comments
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  
    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture,
      },
      likeCount: post.likes.length,
      commentCount: post['commentCount'], // ✅ Ensure commentCount is included
    }));
  }
  
  // Get a single post by ID
  async findOne(id: string): Promise<any | undefined> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likes', 'likes')
      .where('post.id = :id', { id })
      .loadRelationCountAndMap('post.commentCount', 'post.comments') // ✅ Count comments
      .getOne();
  
    if (!post) return undefined;
  
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture,
      },
      likeCount: post.likes.length,
      commentCount: post['commentCount'], // ✅ Ensure commentCount is included
    };
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
