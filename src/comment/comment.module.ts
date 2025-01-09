import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.service';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { PostModule } from '../post/post.module';  // Import PostModule to access PostRepository

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User]),  // Import Comment and User repositories
    PostModule, 
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
