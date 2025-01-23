import { Injectable } from '@nestjs/common';
import { User } from './user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto'; 
import * as bcrypt from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import * as nodemailer from 'nodemailer';
import moment from 'moment';
import  cloudinary  from '../config/cloudinary.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
 // Create a new user
 async createUser(createUserDto: CreateUserDto, file: Express.Multer.File): Promise<User> {
  // Hash password
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  // Generate OTP and hash it
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });


  // Set OTP expiration time (10 minutes from now)
  const otpExpiresAt = moment().add(10, 'minutes').toISOString();

  // Send OTP to email
  await this.sendOtpToEmail(createUserDto.email, otp);

  // Upload profile picture to Cloudinary
  let profilePictureUrl = '';
  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'samples', // Optional: Set folder for storing the images
    });
    profilePictureUrl = result.secure_url;
    
  }

  // Create and save the user
  const newUser = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
    otp: otp, // Save hashed OTP
    otpExpiresAt,
    profilePicture: profilePictureUrl,
  });

  return this.userRepository.save(newUser);
}


  private async sendOtpToEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail's service
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // App-specific password
      },
    });
  
    const mailOptions = {
      from: `${process.env.APP_NAME} <${process.env.GMAIL_USER}>`, // App name in the "from" field
      to: email,
      subject: `${process.env.APP_NAME} - Account Verification`,
      text: `Hello,
  
  Thank you for signing up with ${process.env.APP_NAME}. Your One-Time Password (OTP) is:
  
  ${otp}
  
  This code will expire in 10 minutes. Please use it to complete your verification.
  
  If you did not request this, please ignore this email.
  
  Best regards,  
  ${process.env.APP_NAME} Team`
  };
  
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  }
  
  async resendOtpToInactiveUser(user: User): Promise<void> {
    // Generate a new 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
  
    // Set a new expiration time for the OTP (10 minutes from now)
    const otpExpiresAt = moment().add(10, 'minutes').toISOString();
  
    // Update the user with the new OTP and expiration time
    user.otp = otp;
    user.otpExpiresAt = new Date(otpExpiresAt);
  
    await this.userRepository.save(user);
  
    // Send OTP to the user's email
    await this.sendOtpToEmail(user.email, otp);
  }
  
  async verifyOtp(otp: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { otp } });
    if (!user || new Date() > user.otpExpiresAt) {
      return null; // OTP is invalid or expired
    }
  
    // Mark user as verified and clear OTP data
    user.isVerified = true; // Set isVerified to true
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null; // Clear OTP expiration
  
    await this.userRepository.save(user);
  
    return user;
  }
  
  
  // Get all users
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
    
  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // Update user
  async updateUser(id: string, updateUserDto: any): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.getUserById(id);
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
