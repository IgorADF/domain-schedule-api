# 📅 Domain Schedule API

A robust REST API for scheduling management, built with Domain-Driven Design (DDD), message queue support, and scheduled jobs.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24.x |
| Language | TypeScript 5.9 |
| HTTP Framework | Fastify 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL 18 |
| Cache | Redis 8 (ioredis) |
| Message Queue | RabbitMQ 3 (amqplib) |
| Scheduled Jobs | node-cron |
| Validation | Zod 4 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer |
| Date/Time | Luxon |
| Documentation | Swagger (@fastify/swagger) |
| Testing | Vitest + Supertest |
| Linter/Formatter | Biome |
| Containerization | Docker + Docker Compose |

---

## 🏗️ Architecture

The project is split into **three independent applications**, all sharing the same domain:

```
src/
└── apps/
    ├── api/       # HTTP Server (Fastify)
    ├── queue/     # Message queue consumer (RabbitMQ)
    └── jobs/      # Scheduled jobs (cron)
```

Each application can be started, scaled, and containerized independently.

---

## ⚙️ Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.development .env
```

| Variable | Description | Default |
|---|---|---|
| `TZ` | Application timezone | `UTC` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `API_PORT` | HTTP server port | `3000` |
| `API_AUTH_JWT_SECRET` | Authentication JWT secret | — |
| `API_REFRESH_JWT_SECRET` | Refresh token JWT secret | — |
| `API_JWT_RESET_SECRET` | Password reset JWT secret | — |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_ENABLE` | Enable Redis | `true` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `RABBITMQ_HOST` | RabbitMQ host | `localhost` |
| `RABBITMQ_PORT` | RabbitMQ port | `5672` |
| `RABBITMQ_USER` | RabbitMQ username | `admin` |
| `RABBITMQ_PASS` | RabbitMQ password | `admin` |
| `SMTP_HOST` | SMTP server host | — |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASS` | SMTP password | — |
| `EMAIL_FROM` | Email sender address | — |

---

## 🐳 Running with Docker

### Start the full infrastructure + applications

```bash
docker compose up -d
```

This will start the following services:

| Service | Port |
|---|---|
| HTTP API | `3000` |
| PostgreSQL | `5432` |
| Redis | `6379` |
| RabbitMQ | `5672` |
| RabbitMQ Management UI | `15672` |

### Stop all services

```bash
docker compose down
```

---

## 💻 Running Locally (Development)

### Prerequisites

- Node.js `>= 24.x`
- PostgreSQL, Redis and RabbitMQ available (use `docker compose up postgres redis rabbitmq -d`)

### Installation

```bash
npm install
```

### Database

```bash
# Generate the Prisma client and run migrations
npm run db:migrate:dev
```

### Start the applications in development mode

```bash
# HTTP API
npm run dev:server

# Queue consumer
npm run dev:queue

# Scheduled jobs
npm run dev:jobs
```

---

## 🏭 Build & Deploy

```bash
# Generate production build
npm run build

# Start API in production
npm run start:api

# Start queue consumer in production
npm run start:queue

# Start jobs in production
npm run start:jobs

# Run migrations in production
npm run db:migrate:deploy
```

---

## 🧪 Testing

```bash
# Run all tests
npm run server:tests

# Run with coverage
npm run server:coverage:tests

# Visual test interface (Vitest UI)
npm run tests:ui
```

---

## 📖 API Documentation

With the application running, access the Swagger docs at:

```
http://localhost:3000/docs
```

To regenerate the static Swagger file:

```bash
npm run generate:swagger
```

---

## 🔧 Development Utilities

```bash
# Check TypeScript types
npm run ts:check

# Lint
npm run lint

# Format code
npm run format

# Organize imports + lint + format
npm run organize:all

# Organize + type check
npm run organize:check
```

---

## 📁 Project Structure

```
.
├── src/
│   └── apps/
│       ├── api/         # HTTP server (routes, controllers, middlewares)
│       ├── queue/       # RabbitMQ message consumer
│       └── jobs/        # node-cron scheduled jobs
├── scripts/             # Utility scripts (build, swagger, etc.)
├── .agent/workflows/    # Agent workflows
├── .github/             # GitHub Actions and CI/CD configuration
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── .env.test            # Test environment variables
├── Dockerfile           # Multi-stage build (api, queue, jobs)
├── docker-compose.yaml  # Full service orchestration
├── prisma.config.ts     # Prisma configuration
├── biome.json           # Biome configuration (lint/format)
├── vite.config.ts       # Vitest configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 📜 License

ISC
