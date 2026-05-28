# Simplified Single-Role Workflow Guide

## Overview
Simplified to single role system - all users have the same permissions. Clean, simple, focused on core event management.

## User Model
```typescript
// Simplified User model
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

## Authentication Flow

### **Login**
```bash
POST /auth/login
{
  "email": "user@example.com"
}

# Response
{
  "access_token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com", 
    "name": "John Doe"
  }
}
```

### **Register**
```bash
POST /auth/register
{
  "email": "newuser@example.com",
  "name": "New User"
}

# Response
{
  "access_token": "eyJ...",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "New User"
  }
}
```

## Event Management

### **Create Event**
```bash
POST /events
Authorization: Bearer <token>
{
  "title": "My Event",
  "description": "Event description",
  "location": "Venue Name",
  "date": "2026-12-25T10:00:00Z",
  "maxCapacity": 100,
  "price": 50.0
}

# Response
{
  "id": 123,
  "title": "My Event",
  "organizerId": 1,  // User's ID
  "organizer": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "_count": {
    "bookings": 0
  }
}
```

### **View Events**
```bash
# All events
GET /events

# With filters
GET /events?search=conference&city=New York&dateFrom=2026-12-01

# Single event
GET /events/123
```

### **Manage Own Events**
```bash
# Update event (only if you're the organizer)
PATCH /events/123
Authorization: Bearer <token>
{
  "title": "Updated Title",
  "price": 75.0
}

# Delete event (only if you're the organizer)
DELETE /events/123
Authorization: Bearer <token>
```

## Booking System

### **Book Event**
```bash
POST /bookings/123
Authorization: Bearer <token>

# Response
{
  "id": 456,
  "userId": 1,
  "eventId": 123,
  "event": {
    "title": "My Event",
    "date": "2026-12-25T10:00:00Z"
  },
  "bookedAt": "2026-03-12T10:30:00Z"
}
```

### **View Bookings**
```bash
# User's bookings
GET /bookings/user/1
Authorization: Bearer <token>

# Event's bookings (organizer view)
GET /bookings/event/123
Authorization: Bearer <token>
```

## Offline Support

### **Offline Event Creation**
```bash
# When network fails, events are stored offline
POST /events
# Response if offline:
{
  "message": "Event stored offline (will sync when online)",
  "event": {
    "id": "offline_1641234567890",
    "title": "My Event",
    "isOffline": true
  },
  "isOffline": true,
  "requiresSync": true
}
```

### **Sync When Online**
```bash
# Sync offline events
POST /offline/sync/1

# Check offline status
GET /offline/status/1
```

## Security Features

### **Authentication Only**
- Token-based authentication required for all protected actions
- No complex role system
- Simple ownership validation

### **Ownership Rules**
- Users can only create/edit/delete their own events
- Anyone can book events
- Users can view/cancel their own bookings

## API Endpoints

### **Core Endpoints**
```bash
POST   /auth/login          # User login
POST   /auth/register        # User registration
POST   /events             # Create event
GET    /events             # List events
GET    /events/:id         # Get event
PATCH  /events/:id         # Update event
DELETE /events/:id         # Delete event
GET    /events/:id/availability # Check tickets

POST   /bookings/:eventId   # Book event
GET    /bookings/user/:userId # User's bookings
GET    /bookings/event/:eventId # Event's bookings
DELETE /bookings/:id       # Cancel booking

GET    /users              # List users
GET    /users/:id          # Get user
```

### **Offline Endpoints**
```bash
POST   /offline/events      # Store offline event
GET    /offline/events      # Get offline events
POST   /offline/sync/:userId # Sync events
GET    /offline/status/:userId # Check status
```

## Benefits of Simplified System

### **✅ Advantages**
- **Cleaner Code** - No role complexity
- **Easier Testing** - Single user type
- **Better UX** - No confusing permissions
- **Faster Development** - Focus on core features
- **Simpler Database** - No role joins needed

### **🎯 Focus Areas**
- Event creation and management
- Booking system
- User authentication
- Offline functionality
- Search and filtering

## Error Handling

### **Common Responses**
```json
// Not authenticated
{
  "message": "Login required to create events",
  "error": "Unauthorized",
  "statusCode": 401
}

// Not found
{
  "message": "Event with ID 123 not found",
  "error": "Not Found",
  "statusCode": 404
}

// Forbidden (not owner)
{
  "message": "You can only manage your own events",
  "error": "Forbidden",
  "statusCode": 403
}
```

## Getting Started

### **1. Start Server**
```bash
npm run start:dev
# Server runs on http://localhost:3333
```

### **2. Create First User**
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### **3. Create First Event**
```bash
curl -X POST http://localhost:3333/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My First Event","location":"Test Venue","date":"2026-12-25T10:00:00Z","maxCapacity":100}'
```

This simplified approach focuses on the core event management functionality without unnecessary complexity!
