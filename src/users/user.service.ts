import { Injectable } from '@nestjs/common';
import { User } from './user.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto'; 
import * as bcrypt from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import * as nodemailer from 'nodemailer';
import moment from 'moment';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      specialChars: false,
    });

    // Set OTP expiration time (10 minutes from now)
    const otpExpiresAt = moment().add(10, 'minutes').toISOString(); // Set expiration to 10 minutes from now

    // Send OTP to the user's email
    await this.sendOtpToEmail(createUserDto.email, otp);

    // Create new user with the hashed password and OTP expiration time
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      otp: otp,  // Store the OTP in the database temporarily
      otpExpiresAt: otpExpiresAt,  // Store the expiration time of the OTP
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
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`, // App name in the "from" field
      to: email,
      subject: `${process.env.APP_NAME} - Your OTP Code`,
      text: `Your OTP code is: ${otp}. Please use it within the next 10 minutes to verify your account.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
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
