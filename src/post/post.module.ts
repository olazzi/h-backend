import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])], 
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule.forFeature([Post])],  
})
export class PostModule {}
