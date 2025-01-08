import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { JwtPayload } from './jwt-payload.interface'; // Your payload interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Use the same secret key here as in JwtModule
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getUserById(payload.sub); // Use the user ID in payload to find the user
    return user;
  }
}
