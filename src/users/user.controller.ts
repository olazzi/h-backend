import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity'; // Assuming you have a User entity
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto'; // Assuming you have a DTO for creating users
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
 

@Post()
async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  return this.userService.createUser(createUserDto);
}


  // Get all users
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  // Hello route
  @Get('hellos')
  async hello(): Promise<string> {
    return 'Helloss World!';
  }

  // Get user by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  // Update user
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete user
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
