# Authentication Guide

## Overview
Event creation now requires authentication. Users must be logged in to create events.

## Authentication Endpoints

### 1. Login
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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Register
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Using Authentication

To create an event, include the token in the Authorization header:

```bash
POST /events
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "title": "My Event",
  "description": "Event description",
  "location": "Event location",
  "date": "2026-12-25T10:00:00Z",
  "maxCapacity": 100,
  "price": 50.0
}
```

## Security Notes

- **Authentication Required**: Event creation now requires a valid JWT token
- **User as Organizer**: The authenticated user automatically becomes the event organizer
- **Token Validation**: Tokens are validated on each protected request
- **Error Handling**: Unauthorized requests return 401 status

## Example Workflow

1. **Register/Login**: Get a token
   ```bash
   curl -X POST http://localhost:3333/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

2. **Create Event**: Use the token
   ```bash
   curl -X POST http://localhost:3333/events \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"title":"My Event","location":"Venue","date":"2026-12-25T10:00:00Z","maxCapacity":100}'
   ```

3. **Without Token**: Will fail with 401 error
   ```bash
   curl -X POST http://localhost:3333/events \
     -H "Content-Type: application/json" \
     -d '{"title":"My Event","location":"Venue","date":"2026-12-25T10:00:00Z"}'
   # Returns: {"message":"Login required to create events","error":"Unauthorized","statusCode":401}
   ```

## Implementation Details

- **Custom Auth Guard**: Simple JWT-like token implementation
- **User Context**: Authenticated user info is available in request object
- **Database Integration**: Events are linked to the creating user
- **Error Messages**: Clear authentication error messages
