import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comment/comment.module';
import { LikesModule } from './like/like.module';
import { FollowsModule } from './follow/follow.module';
import * as dotenv from 'dotenv';
import { PostModule } from './post/post.module';
import { LoggingMiddleware } from './logging/logging.middleware';  // Import the logging middleware

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    CommentsModule,
    LikesModule,
    FollowsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // Implement the configure method from NestModule to apply the middleware
  configure(consumer: MiddlewareConsumer) {
    // Apply logging middleware globally for all routes
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
