import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EventsService } from './events/events.service';
import { BookingsService } from './bookings/bookings.service';
import { UsersService } from './users/users.service';
import { EventsController } from './events/events.controller';
import { BookingsController } from './bookings/bookings.controller';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [EventsController, BookingsController, UsersController, AuthController],
  providers: [PrismaService, EventsService, BookingsService, UsersService, AuthService],
})
export class AppModule { }
