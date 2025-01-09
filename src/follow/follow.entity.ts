import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  following: User;
}
