import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service'; // Ensure the correct import path
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

 
  async validateUser(email: string, password: string): Promise<any> {
    
    const user = await this.userService.findByEmail(email);

    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Exclude password from the result
      const { password, ...result } = user;
      return result;
    }

    // Throw an UnauthorizedException if invalid
    throw new UnauthorizedException('Invalid email or password');
  }

  // Send OTP to inactive user
  async sendOtp(user: User): Promise<void> {
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already active');
    }

    // Use UserService to send OTP
    await this.userService.resendOtpToInactiveUser(user);
  }

  async verifyOtp(otp: string) {
    // Verify the OTP entered by the user
    const user = await this.userService.verifyOtp(otp);

    if (!user) {
      throw new UnauthorizedException('Invalid OTP or OTP has expired');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'OTP verified successfully!',
      token, // Return the token after OTP verification
    };
  }

  // Generate the JWT token for the user
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload), // Sign the JWT with user data
    };
  }
}
