import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { JwtPayload } from './jwt-payload.interface'; // Your payload interface
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Load secret key from .env
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserById(payload.sub); // Use the user ID in payload to find the user
    return user;
  }
}
