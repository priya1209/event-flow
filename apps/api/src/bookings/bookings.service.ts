import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: number, eventId: number) {
    // CRITICAL: Use Prisma Transaction for concurrency control
    // This prevents race conditions where multiple users try to book the last ticket simultaneously
    return this.prisma.$transaction(async (tx) => {
      // Step 1: Lock the event row and check capacity
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      // Step 2: Check if event is at capacity
      const currentBookings = event._count.bookings;
      if (currentBookings >= event.maxCapacity) {
        throw new ConflictException('Event is fully booked');
      }

      // Step 3: Check if user already booked this event
      const existingBooking = await tx.booking.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (existingBooking) {
        throw new ConflictException('User has already booked this event');
      }

      // Step 4: Create the booking (this is the critical operation that must be atomic)
      const booking = await tx.booking.create({
        data: {
          userId,
          eventId,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          event: {
            select: {
              id: true,
              title: true,
              date: true,
              location: true,
              price: true,
            },
          },
        },
      });

      return {
        booking,
        message: 'Ticket booked successfully',
        remainingTickets: event.maxCapacity - (currentBookings + 1),
      };
    });
  }

  async getUserBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            price: true,
            organizer: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { bookedAt: 'desc' },
    });
  }

  async cancelBooking(userId: number, eventId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
    });
  }

  async getEventBookings(eventId: number) {
    return this.prisma.booking.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { bookedAt: 'asc' },
    });
  }
}
