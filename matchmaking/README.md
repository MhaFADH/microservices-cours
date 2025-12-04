# Matchmaking Service

**Port:** 8082
**Database:** db_matchmaking

## Overview

The Matchmaking service manages game matchmaking queues, match creation, and match history. It handles player queuing, match results, and automatically updates player MMR through the Identity service.

## How It Works

- Players join the matchmaking queue with their MMR
- Matches are created between two players
- When a match completes, the winner gains +25 MMR and loser loses -25 MMR
- MMR changes are propagated to the Identity service
- All match history is stored and retrievable
- Operations are logged and metrics tracked

## Entities

### QueueEntry
- `id` (UUID) - Queue entry identifier
- `playerId` (String) - Player user ID
- `mmr` (Integer) - Player's current MMR
- `joinedAt` (DateTime) - Queue join timestamp

### Match
- `id` (UUID) - Match identifier
- `player1Id` (String) - First player ID
- `player2Id` (String) - Second player ID
- `winnerId` (String) - Winner player ID
- `player1MmrChange` (Integer) - MMR change for player 1
- `player2MmrChange` (Integer) - MMR change for player 2
- `status` (Enum) - IN_PROGRESS, COMPLETED, CANCELLED
- `createdAt` (DateTime) - Match creation time
- `completedAt` (DateTime) - Match completion time

## API Endpoints

### Queue Management

#### Join Queue
```http
POST /queue/join
Content-Type: application/json

{
  "playerId": "123e4567-e89b-12d3-a456-426614174000"
}

Response:
{
  "id": "queue-entry-id",
  "playerId": "123e4567-e89b-12d3-a456-426614174000",
  "mmr": 1000,
  "joinedAt": "2025-12-04T10:00:00"
}
```

#### Leave Queue
```http
POST /queue/leave
Content-Type: application/json

{
  "playerId": "123e4567-e89b-12d3-a456-426614174000"
}

Response:
{
  "message": "Left queue successfully"
}
```

#### View Queue
```http
GET /queue

Response:
[
  {
    "id": "queue-entry-id",
    "playerId": "123e4567-e89b-12d3-a456-426614174000",
    "mmr": 1000,
    "joinedAt": "2025-12-04T10:00:00"
  }
]
```

### Match Management

#### Create Match
```http
POST /matches
Content-Type: application/json

{
  "player1Id": "player-id-1",
  "player2Id": "player-id-2"
}

Response:
{
  "id": "match-id",
  "player1Id": "player-id-1",
  "player2Id": "player-id-2",
  "status": "IN_PROGRESS",
  "createdAt": "2025-12-04T10:00:00"
}
```

#### Complete Match
```http
POST /matches/{matchId}/complete
Content-Type: application/json

{
  "winnerId": "player-id-1"
}

Response:
{
  "id": "match-id",
  "player1Id": "player-id-1",
  "player2Id": "player-id-2",
  "winnerId": "player-id-1",
  "player1MmrChange": 25,
  "player2MmrChange": -25,
  "status": "COMPLETED",
  "completedAt": "2025-12-04T10:05:00"
}
```

#### Get All Matches
```http
GET /matches

Response:
[
  {
    "id": "match-id",
    "player1Id": "player-id-1",
    "player2Id": "player-id-2",
    "winnerId": "player-id-1",
    "status": "COMPLETED",
    "createdAt": "2025-12-04T10:00:00"
  }
]
```

#### Get Match By ID
```http
GET /matches/{matchId}

Response:
{
  "id": "match-id",
  "player1Id": "player-id-1",
  "player2Id": "player-id-2",
  "winnerId": "player-id-1",
  "status": "COMPLETED"
}
```

#### Get Player Match History
```http
GET /matches/player/{playerId}

Response:
[
  {
    "id": "match-id",
    "player1Id": "player-id-1",
    "player2Id": "player-id-2",
    "winnerId": "player-id-1",
    "status": "COMPLETED"
  }
]
```

### Monitoring

#### Get Metrics
```http
GET /metrics

Response:
{
  "uptime": 3600,
  "activeMatches": 2,
  "queueSize": 5,
  "endpointCount": 7
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
    "msg": "Player joined queue: player-id-1"
  }
]
```

## Architecture

```
Controller Layer (HTTP endpoints)
    ↓
Service Layer (Business logic + Identity Client)
    ↓
Repository Layer (Database access)
    ↓
MySQL Database (db_matchmaking)

Service Layer also calls:
    → Identity Service (port 8081) for user data and MMR updates
```

## Dependencies

- Spring Boot Web
- Spring Data JPA
- MySQL Connector
- JJWT (JWT validation)
- RestTemplate (for Identity service communication)
- Lombok

## Inter-Service Communication

**Calls:**
- Identity service - GET /users/{id} to fetch player MMR
- Identity service - PUT /users/{id}/mmr to update MMR after match

**Called by:**
- Monitoring service (to collect metrics and logs)

## Starting the Service

```bash
cd matchmaking
mvn spring-boot:run
```

Service will start on port 8082.

**Note:** Identity service must be running on port 8081.
