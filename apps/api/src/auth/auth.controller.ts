import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password?: string }) {
    // For demo purposes, we'll find or create a user
    let user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      // Create a new user if not found
      user = await this.prisma.user.create({
        data: {
          email: loginDto.email,
          name: loginDto.email.split('@')[0], // Use email prefix as name
          role: 'USER',
        },
      });
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; name: string; password?: string }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        role: 'USER',
      },
    });

    return this.authService.login(user);
  }
}
