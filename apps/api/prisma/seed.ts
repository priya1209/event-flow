import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL || "postgresql://@localhost:5432/eventdb",
  }),
});

async function seed() {
  console.log('🌱 Seeding database...');

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eventmgmt.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: 'organizer@eventmgmt.com',
      name: 'Event Organizer',
      role: 'USER',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'John Doe',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'Jane Smith',
      role: 'USER',
    },
  });

  console.log('✅ Users created');

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: 'Tech Conference 2024',
      description: 'Annual technology conference featuring the latest innovations',
      location: 'San Francisco, CA',
      date: new Date('2024-12-25T10:00:00Z'),
      maxCapacity: 50,
      price: 299.99,
      organizerId: organizer.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Web Development Workshop',
      description: 'Hands-on workshop for modern web development',
      location: 'New York, NY',
      date: new Date('2024-11-15T09:00:00Z'),
      maxCapacity: 20,
      price: 99.99,
      organizerId: organizer.id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'AI & Machine Learning Summit',
      description: 'Exploring the future of artificial intelligence',
      location: 'Austin, TX',
      date: new Date('2024-10-20T14:00:00Z'),
      maxCapacity: 100,
      price: 199.99,
      organizerId: admin.id,
    },
  });

  console.log('✅ Events created');

  // Create some sample bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: user1.id,
        eventId: event1.id,
      },
      {
        userId: user2.id,
        eventId: event1.id,
      },
      {
        userId: user1.id,
        eventId: event2.id,
      },
    ],
  });

  console.log('✅ Bookings created');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Test Users:');
  console.log(`Admin: ${admin.email} (ID: ${admin.id})`);
  console.log(`Organizer: ${organizer.email} (ID: ${organizer.id})`);
  console.log(`User 1: ${user1.email} (ID: ${user1.id})`);
  console.log(`User 2: ${user2.email} (ID: ${user2.id})`);
  console.log('');
  console.log('Test Events:');
  console.log(`Event 1: ${event1.title} (ID: ${event1.id})`);
  console.log(`Event 2: ${event2.title} (ID: ${event2.id})`);
  console.log(`Event 3: ${event3.title} (ID: ${event3.id})`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
