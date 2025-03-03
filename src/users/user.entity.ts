import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany, 
  ManyToMany, 
  JoinTable 
} from 'typeorm';
import { Follow } from '../follow/follow.entity';
import { Post } from '../post/post.entity';
import { Like } from '../like/like.entity';
import { Comment } from '../comment/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following, { cascade: true })
  followers: Follow[];

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => Post, { cascade: true }) 
  @JoinTable({ name: 'saved_posts' }) 
  savedPosts: Post[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  otp: string | null;

  @Column({ nullable: true })
  otpExpiresAt: Date | null;
}
