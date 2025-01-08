import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service'; // Ensure the correct import path

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate the user credentials (username and password)
  async validateUser(username: string, password: string): Promise<any> {
    // Fetch the user based on the username
    const user = await this.userService.findByUsername(username);
    
    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Exclude password from the result
      const { password, ...result } = user;
      return result;
    }

    // Throw an UnauthorizedException if invalid
    throw new UnauthorizedException('Invalid username or password');
  }

  // Generate the JWT token for the user
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload), // Sign the JWT with user data
    };
  }
}
