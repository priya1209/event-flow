# Clean Event Management System

## Overview
Simplified, clean event management system with core functionality only.

## Features
- ✅ User authentication (login/register)
- ✅ Event creation and management
- ✅ Event booking system
- ✅ Search and filtering
- ✅ User ownership validation

## API Endpoints

### Authentication
```bash
POST /auth/register    # Register new user
POST /auth/login       # Login user
```

### Events
```bash
POST /events           # Create event (requires auth)
GET  /events           # List all events
GET  /events/:id       # Get single event
PATCH /events/:id      # Update event (owner only)
DELETE /events/:id     # Delete event (owner only)
GET  /events/:id/availability  # Check ticket availability
```

### Bookings
```bash
POST /bookings/:eventId     # Book event (requires auth)
GET  /bookings/user/:userId  # Get user's bookings
GET  /bookings/event/:eventId # Get event's bookings (owner)
DELETE /bookings/:id        # Cancel booking
```

### Users
```bash
GET /users            # List users
GET /users/:id        # Get user details
```

## User Model
```typescript
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  events    Event[]   @relation("Organizer")
  bookings  Booking[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Event Model
```typescript
model Event {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  location    String
  date        DateTime
  maxCapacity Int
  price       Float     @default(0.0)
  organizerId Int
  organizer   User      @relation("Organizer", fields: [organizerId], references: [id])
  bookings    Booking[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Authentication Flow

### Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Event Management

### Create Event
```bash
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Conference 2026",
  "description": "Annual tech conference",
  "location": "Convention Center",
  "date": "2026-12-25T10:00:00Z",
  "maxCapacity": 500,
  "price": 99.99
}
```

### Update Event (Owner Only)
```bash
PATCH /events/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Conference Title",
  "price": 149.99
}
```

## Booking System

### Book Event
```bash
POST /bookings/123
Authorization: Bearer <token>
```

### View Bookings
```bash
GET /bookings/user/1
Authorization: Bearer <token>
```

## Search & Filtering

### Search Events
```bash
GET /events?search=conference&location=New York&dateFrom=2026-12-01&dateTo=2026-12-31
```

## Security

### Authentication Required
- Event creation, update, delete
- Booking operations
- Viewing user's bookings

### Ownership Validation
- Users can only manage their own events
- Users can only cancel their own bookings
- Event organizers can view their event's bookings

## Error Handling

### Common Responses
```json
// Unauthorized
{
  "message": "Login required to create events",
  "error": "Unauthorized",
  "statusCode": 401
}

// Forbidden (not owner)
{
  "message": "You can only manage your own events",
  "error": "Forbidden", 
  "statusCode": 403
}

// Not Found
{
  "message": "Event with ID 123 not found",
  "error": "Not Found",
  "statusCode": 404
}
```

## Getting Started

### 1. Start Server
```bash
npm run start:dev
# Server: http://localhost:3333
```

### 2. Register User
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### 3. Login
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 4. Create Event
```bash
curl -X POST http://localhost:3333/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My Event","location":"Venue","date":"2026-12-25T10:00:00Z","maxCapacity":100}'
```

## Database Schema
- PostgreSQL database
- Prisma ORM
- Simple relational model
- No complex role system

## Stack
- **Backend**: NestJS
- **Database**: PostgreSQL + Prisma
- **Authentication**: Custom JWT-like tokens
- **Validation**: Built-in NestJS validation
- **No external dependencies** for auth/offline

This is a clean, focused event management system with core functionality only.
