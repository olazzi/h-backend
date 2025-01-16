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
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }
 
   
    if (!user.isVerified) {
    
      // Generate and send OTP to the user
      await this.authService.sendOtp(user);
      throw new BadRequestException(
        'User is not active. OTP has been sent to the registered email.',
      );
    }

    return this.authService.login(user);
  }
}
