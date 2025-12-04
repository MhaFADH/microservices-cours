# Microservices Architecture - School Project

A complete microservices-based backend system built with Spring Boot, MySQL, and JWT authentication. This project demonstrates inter-service communication, centralized monitoring, and RESTful API design.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client / API Consumers                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Identity    │◄─────│ Matchmaking  │      │   Economy    │
│  Player      │      │              │◄─────│  Community   │
│              │      │              │      │              │
│  Port 8081   │      │  Port 8082   │      │  Port 8083   │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  Monitoring  │
                      │              │
                      │  Port 8084   │
                      └──────────────┘
```

## 📋 Services Overview

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| **Identity-Player** | 8081 | db_identity | User authentication, profiles, MMR management |
| **Matchmaking** | 8082 | db_matchmaking | Queue management, match creation, match history |
| **Economy-Community** | 8083 | db_economy | In-game purchases, user posts, community features |
| **Monitoring** | 8084 | db_monitoring | Centralized metrics and logs collection |

## 🚀 Quick Start Guide

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Step 1: Configuration Setup

First, copy the example configuration files and fill in your database credentials:

```bash
# Identity-Player Service
cp identity-player/src/main/resources/application.properties.example \
   identity-player/src/main/resources/application.properties

# Matchmaking Service
cp matchmaking/src/main/resources/application.properties.example \
   matchmaking/src/main/resources/application.properties

# Economy-Community Service
cp economy-community/src/main/resources/application.properties.example \
   economy-community/src/main/resources/application.properties

# Monitoring Service
cp monitoring/src/main/resources/application.properties.example \
   monitoring/src/main/resources/application.properties
```

Then edit each `application.properties` file and replace:
- `YOUR_MYSQL_HOST` with your MySQL host (e.g., `localhost` or `mysql.orb.local`)
- `YOUR_MYSQL_USERNAME` with your MySQL username (e.g., `root`)
- `YOUR_MYSQL_PASSWORD` with your MySQL password

### Step 2: Database Setup

Create the four required databases in MySQL:

```sql
CREATE DATABASE db_identity;
CREATE DATABASE db_matchmaking;
CREATE DATABASE db_economy;
CREATE DATABASE db_monitoring;
```

### Step 3: Install Dependencies for Each Project

Run `mvn install` for each microservice to download dependencies:

```bash
# Install Identity-Player dependencies
cd identity-player
mvn install
cd ..

# Install Matchmaking dependencies
cd matchmaking
mvn install
cd ..

# Install Economy-Community dependencies
cd economy-community
mvn install
cd ..

# Install Monitoring dependencies
cd monitoring
mvn install
cd ..
```

### Step 4: Start Services

Start each service **in order** (open 4 terminals):

```bash
# Terminal 1 - Identity Service (MUST START FIRST)
cd identity-player
mvn spring-boot:run
```

Wait for Identity service to fully start, then:

```bash
# Terminal 2 - Matchmaking Service
cd matchmaking
mvn spring-boot:run
```

```bash
# Terminal 3 - Economy-Community Service
cd economy-community
mvn spring-boot:run
```

```bash
# Terminal 4 - Monitoring Service (START LAST)
cd monitoring
mvn spring-boot:run
```

**Important:**
- Identity service (8081) must start first because other services depend on it
- Monitoring service (8084) should start last to ensure all services are available for scraping

### Step 5: Verify All Services Are Running

Check that all services are up:

```bash
curl http://localhost:8081/metrics
curl http://localhost:8082/metrics
curl http://localhost:8083/metrics
curl http://localhost:8084/metrics
```

If all return JSON responses, the system is ready! ✅

## 📚 Service Documentation

Each service has detailed documentation:

- [Identity-Player Service (8081)](./identity-player/README.md)
- [Matchmaking Service (8082)](./matchmaking/README.md)
- [Economy-Community Service (8083)](./economy-community/README.md)
- [Monitoring Service (8084)](./monitoring/README.md)

## 🔗 Inter-Service Communication

```
Matchmaking Service
    ├─► Identity Service: GET /users/{id} (fetch player data)
    └─► Identity Service: PUT /users/{id}/mmr (update MMR)

Economy-Community Service
    └─► Identity Service: GET /users/{id} (verify user exists)

Monitoring Service
    ├─► Identity Service: GET /metrics, GET /logs
    ├─► Matchmaking Service: GET /metrics, GET /logs
    └─► Economy-Community Service: GET /metrics, GET /logs
```

## 🛠️ Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA / Hibernate
- **Authentication:** JWT (jjwt 0.11.5)
- **Build Tool:** Maven
- **Architecture:** Microservices with REST APIs

## 🎯 Key Features

### 1. Identity-Player Service
- User registration and authentication
- JWT token generation
- MMR (matchmaking rating) system
- User profile management

### 2. Matchmaking Service
- Player queue management
- Automatic match creation
- Match result processing
- MMR updates (+25 winner, -25 loser)
- Match history tracking

### 3. Economy-Community Service
- In-game purchase system
- User-generated content (posts)
- Post like/update/delete functionality
- User purchase history

### 4. Monitoring Service
- Automatic metrics scraping (every 5 seconds)
- Centralized log collection
- Service health monitoring
- Historical data storage

## 📊 Common Endpoints

All services expose:
- `GET /metrics` - Service-specific metrics
- `GET /logs` - Recent service logs

## 🧪 Testing the System

### 1. Register a User
```bash
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","password":"pass","displayName":"Player 1"}'
```

### 2. Join Matchmaking Queue
```bash
curl -X POST http://localhost:8082/queue/join \
  -H "Content-Type: application/json" \
  -d '{"playerId":"<userId>"}'
```

### 3. Make a Purchase
```bash
curl -X POST http://localhost:8083/purchases \
  -H "Content-Type: application/json" \
  -d '{"userId":"<userId>","itemName":"Sword","price":100}'
```

### 4. View Monitoring Data
```bash
curl http://localhost:8084/monitoring/metrics
curl http://localhost:8084/monitoring/logs
```

## 🔐 Authentication

Services share a common JWT secret configured in `application.properties`:

```properties
jwt.secret=sdbdhjsfbfdsjbsdfjhidsbsfdjibsfdjbfds
```

Tokens are generated by the Identity service and can be validated by other services.

## 📁 Project Structure

```
cours-backend/
├── identity-player/
│   ├── src/main/
│   │   ├── java/com/example/identity/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── dto/
│   │   └── resources/
│   │       └── application.properties.example
│   ├── pom.xml
│   └── README.md
├── matchmaking/
│   ├── src/main/resources/
│   │   └── application.properties.example
│   ├── pom.xml
│   └── README.md
├── economy-community/
│   ├── src/main/resources/
│   │   └── application.properties.example
│   ├── pom.xml
│   └── README.md
├── monitoring/
│   ├── src/main/resources/
│   │   └── application.properties.example
│   ├── pom.xml
│   └── README.md
├── .gitignore
├── instructions.md
└── README.md
```

## 🔒 Security & Configuration

- **`.gitignore`** - Prevents sensitive files from being committed:
  - `application.properties` files (contain database credentials)
  - Maven target directories
  - IDE configuration files
  - Log files

- **`application.properties.example`** - Template configuration files:
  - Pre-filled with all settings
  - Only database credentials need to be filled in
  - Safe to commit to GitHub
  - Copy to `application.properties` and customize

**Important:** Never commit `application.properties` files with real credentials to GitHub!

## 🎓 School Project Context

This project demonstrates:
- **Microservices Architecture** - Independent, scalable services
- **REST API Design** - Clean, RESTful endpoints
- **Database Design** - One database per service
- **Inter-Service Communication** - HTTP REST calls between services
- **Monitoring & Observability** - Centralized metrics and logging
- **Authentication** - JWT-based auth system
- **Spring Boot Best Practices** - Controller/Service/Repository pattern

## 📝 Notes

- Each service uses the Controller → Service → Repository pattern
- All services log operations for monitoring
- The Monitoring service stores historical data indefinitely
- Services communicate via REST APIs (synchronous)
- JWT secret is shared across services for token validation

## 🏆 Perfect for Presentations

This architecture is:
- ✅ Easy to understand and explain
- ✅ Demonstrates real-world microservices patterns
- ✅ Fully functional and testable
- ✅ Well-documented with examples
- ✅ Shows inter-service communication
- ✅ Includes monitoring and observability

---

**Built for school project demonstration** 🎓
