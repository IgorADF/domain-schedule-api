---
description: This is the all project summary of architecture, pattenrs, instructions and code implmentation
---

# Architecture Overview & Instructions

This document serves as the primary technical guide for the `new_schedule_plataform` API. It outlines the architectural patterns, directory structure, and technology choices.

## 1. High-Level Architecture

The application follows **Domain-Driven Design (DDD)** principles, strictly separating concerns into three main layers:

- **Domain**: Pure business logic, entities, and interface definitions. Independent of external tools.
- **Infra**: Implementation details (Database, Check providers, Queues). Adapts the domain interfaces.
- **Apps**: Entry points (API, Workers, Consumers) that wire everything together.

## 2. Directory Structure (`src/`)

### `domain/`
Contains the core business logic.
- `entities/`: Domain entities representing core business concepts.
- `repositories/`: Interfaces for data access (ports). **No implementations here.**
- `use-cases/`: Application specific business rules (interactors). Orchestrates entities.
- `services/`: Domain services for logic that doesn't fit into a single entity.
- `shared/`: Shared domain logic, value objects, or errors.

### `infra/`
Contains the technical implementations (adapters).
- `database/`: Prisma schema, migrations, and repository implementations.
- `cache/`: Redis implementations.
- `queue/`: RabbitMQ (amqplib) implementations.
- `envs/`: Environment variable parsing and validation.
- `use-cases-factories/`: Factories to instantiate use-cases with their specific infrastructure dependencies (Dependency Injection).

### `apps/`
The executable running contexts.
- `api/`: Fastify server, routes, schemas (Zod), and controllers (handlers).
- `jobs/`: Background job runners (likely Cron or similar).
- `queue/`: Queue consumers.

## 3. Tech Stack

- **Runtime**: Node.js (via `tsx` for dev, `node` for prod) - Engine: `24.x`
- **Language**: TypeScript `5.9`
- **Framework**: Fastify `5.x`
- **Validation**: Zod (via `fastify-type-provider-zod`)
- **Database**: PostgreSQL with Prisma ORM `7.x`
- **Cache**: Redis (`ioredis`)
- **Queue**: RabbitMQ (`amqplib`)
- **Testing**: Vitest
- **Linting/Formatting**: Biome

## 4. Development Guidelines

1.  **Dependency Rule**: `domain` must NOT depend on `infra` or `apps`. `infra` depends on `domain`. `apps` depends on both.
2.  **Contracts**: Always define interfaces in `domain/repositories` before implementing them in `infra`.
3.  **Factoring**: Use `use-cases-factories` in `infra` to assemble the dependency graph. Do not manually instantiate heavy dependencies in controllers.
4.  **Api handlers**: Keep controllers thin. They should parse input, call a use-case, and return the result. HTTP status codes and DTOs belong here.
5.  **Testing**: Every new route or feature **MUST** have a corresponding integration test in `src/apps/api/tests/`. Ensure both success and failure scenarios (e.g., 404, 403) are covered.
