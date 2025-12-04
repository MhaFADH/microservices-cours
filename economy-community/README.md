# Economy-Community Service

**Port:** 8083
**Database:** db_economy

## Overview

The Economy-Community service manages in-game purchases and user-generated content (UGC). It handles player transactions and community interactions through posts.

## How It Works

- Players can make purchases (items, currency, etc.)
- Users can create, update, and delete community posts
- Posts can be liked by users
- User existence is verified through the Identity service before operations
- All operations are logged and metrics tracked

## Entities

### Purchase
- `id` (UUID) - Purchase identifier
- `userId` (String) - Buyer user ID
- `itemName` (String) - Purchased item name
- `price` (Integer) - Purchase price
- `purchasedAt` (DateTime) - Purchase timestamp

### Post
- `id` (UUID) - Post identifier
- `authorId` (String) - Post author user ID
- `title` (String) - Post title
- `content` (String) - Post content (max 1000 chars)
- `likes` (Integer) - Number of likes (default: 0)
- `createdAt` (DateTime) - Post creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## API Endpoints

### Purchase Management

#### Create Purchase
```http
POST /purchases
Content-Type: application/json

{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "itemName": "Diamond Sword",
  "price": 500
}

Response:
{
  "id": "purchase-id",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "itemName": "Diamond Sword",
  "price": 500,
  "purchasedAt": "2025-12-04T10:00:00"
}
```

#### Get All Purchases
```http
GET /purchases

Response:
[
  {
    "id": "purchase-id",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "itemName": "Diamond Sword",
    "price": 500,
    "purchasedAt": "2025-12-04T10:00:00"
  }
]
```

#### Get Purchase By ID
```http
GET /purchases/{purchaseId}

Response:
{
  "id": "purchase-id",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "itemName": "Diamond Sword",
  "price": 500,
  "purchasedAt": "2025-12-04T10:00:00"
}
```

#### Get User Purchases
```http
GET /purchases/user/{userId}

Response:
[
  {
    "id": "purchase-id",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "itemName": "Diamond Sword",
    "price": 500,
    "purchasedAt": "2025-12-04T10:00:00"
  }
]
```

### Community Posts

#### Create Post
```http
POST /posts
Content-Type: application/json

{
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Best strategies for beginners",
  "content": "Here are my top tips for new players..."
}

Response:
{
  "id": "post-id",
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Best strategies for beginners",
  "content": "Here are my top tips for new players...",
  "likes": 0,
  "createdAt": "2025-12-04T10:00:00",
  "updatedAt": "2025-12-04T10:00:00"
}
```

#### Get All Posts
```http
GET /posts

Response:
[
  {
    "id": "post-id",
    "authorId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Best strategies for beginners",
    "content": "Here are my top tips...",
    "likes": 5,
    "createdAt": "2025-12-04T10:00:00"
  }
]
```

#### Get Post By ID
```http
GET /posts/{postId}

Response:
{
  "id": "post-id",
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Best strategies for beginners",
  "content": "Here are my top tips...",
  "likes": 5,
  "createdAt": "2025-12-04T10:00:00"
}
```

#### Get Author Posts
```http
GET /posts/author/{authorId}

Response:
[
  {
    "id": "post-id",
    "authorId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Best strategies for beginners",
    "likes": 5
  }
]
```

#### Update Post
```http
PUT /posts/{postId}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content here..."
}

Response:
{
  "id": "post-id",
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated Title",
  "content": "Updated content here...",
  "likes": 5,
  "updatedAt": "2025-12-04T10:30:00"
}
```

#### Like Post
```http
POST /posts/{postId}/like

Response:
{
  "id": "post-id",
  "authorId": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Best strategies for beginners",
  "likes": 6
}
```

#### Delete Post
```http
DELETE /posts/{postId}

Response:
{
  "message": "Post deleted successfully"
}
```

### Monitoring

#### Get Metrics
```http
GET /metrics

Response:
{
  "uptime": 3600,
  "totalPurchases": 150,
  "totalPosts": 42,
  "endpointCount": 10
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
    "msg": "Purchase created: Diamond Sword for user 123..."
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
MySQL Database (db_economy)

Service Layer also calls:
    → Identity Service (port 8081) to verify user existence
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
- Identity service - GET /users/{id} to verify user exists

**Called by:**
- Monitoring service (to collect metrics and logs)

## Starting the Service

```bash
cd economy-community
mvn spring-boot:run
```

Service will start on port 8083.

**Note:** Identity service must be running on port 8081.
