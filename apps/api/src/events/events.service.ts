import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';


@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }

  async create(createEventDto: CreateEventDto, user?: any) {
    // Debug: Log received data
    console.log('Received DTO:', createEventDto);
    console.log('Authenticated user:', user);

    // Check if user is authenticated
    if (!user || !user.sub) {
      throw new UnauthorizedException('Login required to create events');
    }

    // Extract and validate required fields
    const { title, description, location, date, maxCapacity, price } = createEventDto;

    // Validate required fields
    const requiredFields = ['title', 'location', 'date'];
    const missingFields = requiredFields.filter(field => !createEventDto[field]);

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Set organizerId to authenticated user's ID
    const eventData = {
      title,
      description,
      location,
      date: new Date(date),
      maxCapacity: maxCapacity || 100,
      price: price || 0,
      organizerId: user.sub,
    };

    return this.prisma.event.create({
      data: eventData,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async findAll(filters?: {
    search?: string;
    city?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const where: any = {
      date: {
        gte: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
        lte: filters?.dateTo ? new Date(filters.dateTo) : undefined,
      },
    };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.city) {
      where.location = { contains: filters.city, mode: 'insensitive' };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  async remove(id: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async getAvailableTickets(eventId: number) {
    const event = await this.prisma.event.findUnique({
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

    return {
      totalCapacity: event.maxCapacity,
      bookedTickets: event._count.bookings,
      availableTickets: event.maxCapacity - event._count.bookings,
    };
  }
}
