import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UploadedFile, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service'; // Add this import
import { User } from './user.entity'; // Assuming you have a User entity
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto'; // Assuming you have a DTO for creating users
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import storage from '../config/multer.config';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService
    , private readonly authService: AuthService
  ) {}
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
      const user = await this.userService.verifyOtp(verifyOtpDto.otp);
  
      if (!user) {
          throw new HttpException(
              { message: 'Invalid OTP', statusCode: 400 },
              HttpStatus.BAD_REQUEST,
          );
      }
  
      const token = await this.authService.login(user);
  
      return {
          message: 'OTP verified successfully!',
          accessToken: token.accessToken,
          userId: user.id,
      };
  }
  

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture', { storage }))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File, // Optional file argument
  ): Promise<any> {
    return this.userService.createUser(createUserDto, file);
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
