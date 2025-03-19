import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../post/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string; // The content of the comment

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User; // The user who wrote the comment

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post; // The post the comment belongs to

  @CreateDateColumn()
  createdAt: Date;
}
