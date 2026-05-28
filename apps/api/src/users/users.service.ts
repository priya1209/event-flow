import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: { email: string; name: string; role?: 'USER' | 'ADMIN' }) {
    return this.prisma.user.create({
      data: {
        ...userData,
        role: userData.role || 'USER',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
            bookings: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        events: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            _count: {
              select: { bookings: true },
            },
          },
        },
        bookings: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                location: true,
              },
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, userData: Partial<{ name: string; email: string; role: 'USER' | 'ADMIN' }>) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
