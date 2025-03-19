import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comment/comment.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.likes)
  @JoinTable()
  likes: User[];
}
