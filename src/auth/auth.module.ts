// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';  // Import UserModule
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthController } from './auth.controller';  // Import AuthController

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,  // Add UserModule to imports
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
  controllers: [AuthController],  // Add AuthController to controllers
})
export class AuthModule {}
