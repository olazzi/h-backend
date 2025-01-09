import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity'; // Ensure the path is correct
import { Comment } from '../comment/comment.entity'; // Adjust path for Comment entity
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string; // For text content of the post

  @Column({ nullable: true })
  imageUrl: string; // Optional image URL

  @Column({ nullable: true })
  videoUrl: string; // Optional video URL

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User; // Relationship to the User entity

  @CreateDateColumn()
  createdAt: Date;

  // One-to-many relationship with comments
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // Many-to-many relationship with likes (users can like multiple posts, and a post can have multiple likes)
  @ManyToMany(() => User, (user) => user.likes)
  @JoinTable() // This is necessary to create a join table for the many-to-many relationship
  likes: User[];
}
