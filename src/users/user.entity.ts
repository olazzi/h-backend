import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany 
} from 'typeorm';
import { Follow } from '../follow/follow.entity';
import { Post } from '../post/post.entity';
import { Like } from '../like/like.entity';
import { Comment } from '../comments/comments.entity';

@Entity('users') // Maps this class to the 'users' table in the database
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Universally unique identifier for the user

  @Column({ unique: true })
  username: string; // User's unique username

  @Column({ unique: true })
  email: string; // User's unique email address

  @Column()
  password: string; // Hashed password

  @Column({ nullable: true })
  bio: string; // Optional user bio

  @Column({ nullable: true })
  profilePicture: string; // URL for the user's profile picture

  @Column({ default: false })
  isVerified: boolean; // Whether the user is verified (default: false)

  @Column({ default: 'user' })
  role: string; // User role (e.g., 'user', 'admin')

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true })
  following: Follow[]; // Users this user is following

  @OneToMany(() => Follow, (follow) => follow.following, { cascade: true })
  followers: Follow[]; // Users following this user

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[]; // Posts created by this user

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[]; // Posts liked by this user

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[]; // Comments made by this user

  @Column({ default: true })
  isActive: boolean; // Whether the user account is active

  @CreateDateColumn()
  createdAt: Date; // When the user was created

  @UpdateDateColumn()
  updatedAt: Date; // When the user was last updated
}
