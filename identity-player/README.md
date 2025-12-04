# Identity-Player Service

**Port:** 8081
**Database:** db_identity

## Overview

The Identity-Player service handles user authentication, player profiles, and MMR (matchmaking rating) management. This is the core service for user identity in the system.

## How It Works

- Users register with username, password, and display name
- JWT tokens are generated upon registration/login for authentication
- Each user has an MMR starting at 1000
- Other services call this service to verify users and update MMR
- All operations are logged and metrics are tracked

## Entities

### User
- `id` (UUID) - Unique user identifier
- `username` (String, unique) - Login username
- `password` (String) - User password
- `displayName` (String) - Display name
- `mmr` (Integer) - Matchmaking rating (default: 1000)
- `createdAt` (DateTime) - Account creation timestamp

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "player1",
  "password": "password123",
  "displayName": "Player One"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "player1",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### User Management

#### Get All Users
```http
GET /users

Response:
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "player1",
    "displayName": "Player One",
    "mmr": 1000
  }
]
```

#### Get User By ID
```http
GET /users/{userId}

Response:
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "player1",
  "displayName": "Player One",
  "mmr": 1000
}
```

#### Update User MMR
```http
PUT /users/{userId}/mmr
Content-Type: application/json

{
  "mmr": 1500
}

Response:
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "username": "player1",
  "displayName": "Player One",
  "mmr": 1500
}
```

#### Delete User
```http
DELETE /users/{userId}

Response: 204 No Content
```

### Monitoring

#### Get Metrics
```http
GET /metrics

Response:
{
  "uptime": 3600,
  "activeUsers": 5,
  "endpointCount": 8
}
```

#### Get Logs
```http
GET /logs

Response:
[
  {
    "ts": "2025-12-04T10:00:00",
    "level": "INFO",
    "msg": "User registered: player1"
  }
]
```

## Architecture

```
Controller Layer (HTTP endpoints)
    ↓
Service Layer (Business logic)
    ↓
Repository Layer (Database access)
    ↓
MySQL Database (db_identity)
```

## Dependencies

- Spring Boot Web
- Spring Data JPA
- MySQL Connector
- JJWT (JWT authentication)
- Lombok

## Inter-Service Communication

**Called by:**
- Matchmaking service (to fetch user data and update MMR)
- Economy-Community service (to verify user existence)
- Monitoring service (to collect metrics and logs)

## Starting the Service

```bash
cd identity-player
mvn spring-boot:run
```

Service will start on port 8081.
