import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikesController } from './like.controller';
import { LikesService } from './like.service';
import { Like } from './like.entity';
import { User } from '../users/user.entity';
import { PostModule } from '../post/post.module';  // Import PostModule to access PostRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User]),  // Import Like and User repositories
    PostModule,  
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
