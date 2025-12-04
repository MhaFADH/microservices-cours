# Monitoring Service

**Port:** 8084
**Database:** db_monitoring

## Overview

The Monitoring service is a centralized observability service that automatically collects metrics and logs from all other microservices. It provides a unified view of the entire system's health and operations.

## How It Works

- Runs a scheduled task every 5 seconds (configurable)
- Scrapes `/metrics` endpoint from each target service
- Scrapes `/logs` endpoint from each target service
- Stores all collected data in the database with timestamps
- Provides aggregated views of all metrics and logs
- Handles service unavailability gracefully (marks as UNREACHABLE)

## Entities

### Metric
- `id` (UUID) - Metric entry identifier
- `serviceUrl` (String) - Source service URL
- `metricKey` (String) - Metric name (e.g., "uptime", "activeUsers")
- `metricValue` (Double) - Metric value
- `collectedAt` (DateTime) - Collection timestamp

### LogEntry
- `id` (UUID) - Log entry identifier
- `serviceUrl` (String) - Source service URL
- `timestamp` (String) - Original log timestamp
- `level` (String) - Log level (INFO, WARN, ERROR)
- `message` (String) - Log message (max 1000 chars)
- `collectedAt` (DateTime) - Collection timestamp

## API Endpoints

### Collected Metrics & Logs

#### Get All Collected Metrics
```http
GET /monitoring/metrics

Response:
[
  {
    "id": "metric-id",
    "serviceUrl": "http://localhost:8081",
    "metricKey": "uptime",
    "metricValue": 3600.0,
    "collectedAt": "2025-12-04T10:00:00"
  },
  {
    "id": "metric-id-2",
    "serviceUrl": "http://localhost:8082",
    "metricKey": "activeMatches",
    "metricValue": 5.0,
    "collectedAt": "2025-12-04T10:00:00"
  }
]
```

#### Get Metrics By Service
```http
GET /monitoring/metrics/{serviceUrl}

Example:
GET /monitoring/metrics/http%3A%2F%2Flocalhost%3A8081

Response:
[
  {
    "id": "metric-id",
    "serviceUrl": "http://localhost:8081",
    "metricKey": "uptime",
    "metricValue": 3600.0,
    "collectedAt": "2025-12-04T10:00:00"
  }
]
```

#### Get All Collected Logs
```http
GET /monitoring/logs

Response:
[
  {
    "id": "log-id",
    "serviceUrl": "http://localhost:8081",
    "timestamp": "2025-12-04T10:00:00",
    "level": "INFO",
    "message": "User registered: player1",
    "collectedAt": "2025-12-04T10:00:05"
  },
  {
    "id": "log-id-2",
    "serviceUrl": "http://localhost:8082",
    "timestamp": "2025-12-04T10:00:01",
    "level": "INFO",
    "message": "Match created: match-id",
    "collectedAt": "2025-12-04T10:00:05"
  }
]
```

#### Get Logs By Service
```http
GET /monitoring/logs/{serviceUrl}

Example:
GET /monitoring/logs/http%3A%2F%2Flocalhost%3A8081

Response:
[
  {
    "id": "log-id",
    "serviceUrl": "http://localhost:8081",
    "timestamp": "2025-12-04T10:00:00",
    "level": "INFO",
    "message": "User registered: player1",
    "collectedAt": "2025-12-04T10:00:05"
  }
]
```

### Own Metrics & Logs

#### Get Monitoring Service Metrics
```http
GET /metrics

Response:
{
  "uptime": 7200,
  "status": "running",
  "endpointCount": 5
}
```

#### Get Monitoring Service Logs
```http
GET /logs

Response:
[
  {
    "ts": "2025-12-04T10:00:00",
    "level": "INFO",
    "msg": "Monitoring service started"
  }
]
```

## Architecture

```
Spring Scheduler (@Scheduled)
    ↓
MonitoringService (scrapes every 5s)
    ↓
RestTemplate → Target Services (/metrics, /logs)
    ↓
Repository Layer (stores collected data)
    ↓
MySQL Database (db_monitoring)
```

## Configuration

Target services are configured in `application.properties`:

```properties
monitor.targets=http://localhost:8081,http://localhost:8082,http://localhost:8083
monitor.scrape.period=5000
monitor.timeout=2000
```

- `monitor.targets` - Comma-separated list of service URLs to monitor
- `monitor.scrape.period` - Scrape interval in milliseconds (5000 = 5 seconds)
- `monitor.timeout` - HTTP request timeout in milliseconds

## Dependencies

- Spring Boot Web
- Spring Data JPA
- MySQL Connector
- Spring Scheduling
- RestTemplate (with timeout configuration)
- Lombok

## Inter-Service Communication

**Calls:**
- Identity service (8081) - GET /metrics, GET /logs
- Matchmaking service (8082) - GET /metrics, GET /logs
- Economy-Community service (8083) - GET /metrics, GET /logs

**Called by:**
- None (this is a read-only monitoring service)

## Starting the Service

```bash
cd monitoring
mvn spring-boot:run
```

Service will start on port 8084.

**Note:** All other services (8081, 8082, 8083) should be running for proper monitoring.

## Monitoring Behavior

- If a service is unreachable, a metric with key "UNREACHABLE" and value 1.0 is stored
- Collected data accumulates in the database over time
- No automatic cleanup - implement retention policies as needed
- Scheduler starts automatically when the service boots

## Use Cases

1. **System Health Dashboard** - View all services' uptime and status
2. **Performance Tracking** - Monitor active users, matches, purchases over time
3. **Log Aggregation** - Centralized view of all service logs
4. **Troubleshooting** - Identify which service is down or experiencing issues
5. **Metrics History** - Track trends over time (requires querying by timestamp)
