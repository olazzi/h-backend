import { Injectable } from '@nestjs/common';
import { User } from './user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto'; 
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
  // Get all users
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
    
  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Update user
  async updateUser(id: string, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
