// src/auth/jwt-payload.interface.ts

export interface JwtPayload {
    email: string;
    sub: string; // Typically the user ID
  }
  