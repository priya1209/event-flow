import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post(':eventId')
  createBooking(@Param('eventId') eventId: string, @Body() body: { userId: number }) {
    return this.bookingsService.createBooking(body.userId, +eventId);
  }

  @Get('user/:userId')
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getUserBookings(+userId);
  }

  @Delete(':eventId')
  cancelBooking(@Param('eventId') eventId: string, @Body() body: { userId: number }) {
    return this.bookingsService.cancelBooking(body.userId, +eventId);
  }

  @Get('event/:eventId')
  getEventBookings(@Param('eventId') eventId: string) {
    return this.bookingsService.getEventBookings(+eventId);
  }
}
