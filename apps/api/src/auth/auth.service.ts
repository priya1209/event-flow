import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async validateUser(email: string, password: string): Promise<any> {
    // For now, we'll skip password validation and just find the user
    // In a real app, you'd hash and compare passwords
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Create a simple JWT-like token (in production, use proper JWT)
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const payload = Buffer.from(JSON.stringify({
      email: user.email,
      sub: user.id,
      name: user.name
    })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const signature = Buffer.from('signature').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const token = `${header}.${payload}.${signature}`;

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  verifyToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode payload (base64 with URL-safe replacements)
      const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());

      // Basic validation
      if (!payload.sub || !payload.email) {
        throw new Error('Invalid token payload');
      }

      return payload;
    } catch (error) {
      return null;
    }
  }
}
