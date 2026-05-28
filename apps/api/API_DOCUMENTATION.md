# Event Management System API Documentation

## Base URL
```
http://localhost:3333
```

## API Endpoints

### 🎪 Events Management

#### Create Event
```http
POST /events
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "location": "San Francisco",
  "date": "2024-12-25T10:00:00Z",
  "maxCapacity": 100,
  "price": 99.99,
  "organizerId": 1
}
```

#### Get All Events (with filters)
```http
GET /events?search=tech&city=San Francisco&dateFrom=2024-01-01&dateTo=2024-12-31
```

#### Get Single Event
```http
GET /events/1
```

#### Get Event Availability
```http
GET /events/1/availability
```
**Response:**
```json
{
  "totalCapacity": 100,
  "bookedTickets": 25,
  "availableTickets": 75
}
```

#### Update Event
```http
PATCH /events/1
Content-Type: application/json

{
  "title": "Updated Tech Conference",
  "maxCapacity": 150
}
```

#### Delete Event
```http
DELETE /events/1
```

### 🎫 Bookings Management

#### Book Ticket (CRITICAL - Uses Transaction)
```http
POST /bookings/1
Content-Type: application/json

{
  "userId": 1
}
```
**Response:**
```json
{
  "booking": {
    "id": 1,
    "userId": 1,
    "eventId": 1,
    "bookedAt": "2024-03-12T10:00:00Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "event": {
      "id": 1,
      "title": "Tech Conference 2024",
      "date": "2024-12-25T10:00:00Z",
      "location": "San Francisco",
      "price": 99.99
    }
  },
  "message": "Ticket booked successfully",
  "remainingTickets": 74
}
```

#### Get User's Bookings
```http
GET /bookings/user/1
```

#### Cancel Booking
```http
DELETE /bookings/1
Content-Type: application/json

{
  "userId": 1
}
```

#### Get Event Bookings (for organizers)
```http
GET /bookings/event/1
```

## 🧪 Testing Scenarios

### 1. Normal Booking Flow
```bash
# 1. Create an event
curl -X POST http://localhost:3333/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Test Description",
    "location": "Test City",
    "date": "2024-12-25T10:00:00Z",
    "maxCapacity": 5,
    "price": 10.0,
    "organizerId": 1
  }'

# 2. Check availability
curl http://localhost:3333/events/1/availability

# 3. Book a ticket
curl -X POST http://localhost:3333/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# 4. Verify booking
curl http://localhost:3333/bookings/user/1
```

### 2. Concurrency Test (Advanced)
```bash
# Test simultaneous bookings (run in multiple terminals)
for i in {1..6}; do
  curl -X POST http://localhost:3333/bookings/1 \
    -H "Content-Type: application/json" \
    -d "{\"userId\": $i}" &
done
wait

# Only 5 should succeed, 1 should fail with "Event is fully booked"
```

### 3. Error Scenarios
```bash
# Test double booking
curl -X POST http://localhost:3333/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# Second attempt should fail
curl -X POST http://localhost:3333/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# Test non-existent event
curl -X POST http://localhost:3333/bookings/999 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

## 📊 Expected Responses

### Success (200/201)
```json
{
  "id": 1,
  "title": "Tech Conference 2024",
  // ... other fields
}
```

### Error Responses
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Event with ID 999 not found"
}

// 409 Conflict (Double booking)
{
  "statusCode": 409,
  "message": "User has already booked this event"
}

// 409 Conflict (Event full)
{
  "statusCode": 409,
  "message": "Event is fully booked"
}
```

## 🚀 Quick Test Script

Create a test script `test-api.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:3333"

echo "🧪 Testing Event Management API..."

# Test 1: Create Event
echo "1. Creating event..."
EVENT_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Event",
    "description": "Testing via API",
    "location": "Test City",
    "date": "2024-12-25T10:00:00Z",
    "maxCapacity": 3,
    "price": 25.0,
    "organizerId": 1
  }')
echo $EVENT_RESPONSE

# Test 2: Get Events
echo "2. Getting all events..."
curl -s $BASE_URL/events | jq .

# Test 3: Book Ticket
echo "3. Booking ticket..."
curl -s -X POST $BASE_URL/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}' | jq .

echo "✅ API tests completed!"
```

## 🛠 Tools for Testing

1. **Postman**: Import the collection below
2. **curl**: Use the provided commands
3. **Bruno**: Alternative to Postman
4. **Thunder Client**: VS Code extension

## 📝 Postman Collection

```json
{
  "info": {
    "name": "Event Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Events",
      "item": [
        {
          "name": "Create Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Tech Conference 2024\",\n  \"description\": \"Annual tech conference\",\n  \"location\": \"San Francisco\",\n  \"date\": \"2024-12-25T10:00:00Z\",\n  \"maxCapacity\": 100,\n  \"price\": 99.99,\n  \"organizerId\": 1\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/events",
              "host": ["{{baseUrl}}"],
              "path": ["events"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3333"
    }
  ]
}
```
