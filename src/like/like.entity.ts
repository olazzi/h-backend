import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User; // The user who liked the post

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post; // The post that was liked
}
