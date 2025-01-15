import { IsString, IsEmail, IsOptional, IsNotEmpty, MinLength, IsEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username is required.' })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string.' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Profile picture must be a string.' })
  profilePicture?: string;

  
}

export class VerifyOtpDto {
  @IsString()
  otp: string;
}
