import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validate the user with the provided credentials (email/password)
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      // If the user is not found or credentials are incorrect, return a custom error message
      return {
        isVerified: false,
        success: false,
        message: 'Invalid email or password. Please check your credentials and try again.',
      };
    }
    const accessToken = await this.authService.login(user);
    // Check if the user is verified
    if (!user.isVerified) {
      // If not verified, send OTP for verification
      await this.authService.sendOtp(user); // Ensure OTP service is working properly
      
      // Return success status but indicate the user needs to verify their email
      return { 
        success: true, 
        accessToken,
        isVerified: false,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
      }, 
        message: 'Please verify your email. OTP has been sent.' 
      };
    }

   

    // Return the access token and status of verification
    return { 
      success: true, 
      accessToken, 
      isVerified: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
    },
      message: 'Login successful' 
    };
  }
}