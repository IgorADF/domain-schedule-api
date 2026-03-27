# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev:server` | API with hot reload (tsx watch) |
| `npm run dev:queue` | Queue consumer with hot reload |
| `npm run dev:jobs` | Scheduled jobs with hot reload |
| `npm run server:tests` | Run all API tests |
| `npm run server:coverage:tests` | Tests with coverage report |
| `npm run ts:check` | TypeScript type check (no emit) |
| `npm run lint` | Biome lint |
| `npm run organize:all` | Biome check + fix (lint + format) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate:dev` | Create and apply new migration |
| `npm run db:migrate:deploy` | Apply migrations (production) |

To run a single test file: `npx vitest run src/apps/api/tests/<file>.test.ts`

## Architecture

DDD-based Node.js/TypeScript API with three independently deployable applications:

- **API** (`src/apps/api/`) — Fastify HTTP server
- **Queue** (`src/apps/queue/`) — RabbitMQ consumer
- **Jobs** (`src/apps/jobs/`) — node-cron scheduled tasks

### Layers

```
src/
├── @types/       # Shared global types (Class, Optional)
├── domain/       # Entities, use-cases, repo interfaces, errors, value-objects
├── infra/        # Prisma, Redis, RabbitMQ, services, DI factories
└── apps/         # api / queue / jobs entry points and handlers
```

**Path aliases:** `@/*` (src root), `@domain/*`, `@infra/*`, `@api/*`, `@queue/*`
Use path aliases for cross-layer imports; relative imports only within the same feature.

### Use-Cases

Each business action lives in `src/domain/use-cases/` as a class with a single `execute()` method.

- Input type: derived from entity Zod schema via `.pick()`
- `createEntity<T>()` — adds `id` + timestamps on creation
- `updateEntity<T>()` — sets `updateDate`
- Transactions: `await this.uow.withTransaction(async () => { ... })`

### Repository Pattern

1. Interface: `src/domain/repositories/[name].interface.ts` — arrays return `[]`, single queries return `null`
2. Implementation: `src/infra/database/prisma/repositories/[name].ts` extends `ClassRepository`
3. Register getter on both `IUnitOfWork` and `PrismaUnitOfWork`

### Factories (Dependency Injection)

`src/infra/use-cases-factories/` — always use factories in routes; never instantiate UoW or use-cases directly.

```typescript
export const createEntityFactory: CreateFactoryFunction<CreateEntityUseCase> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
	return { uow, useCase: new CreateEntityUseCase(uow) };
};
```

### API Routes

`src/apps/api/routes/` — routes follow `InitRoute` pattern, receive `dbClient` + `logger` + `tags`, return an async Fastify plugin. Protected routes use `onRequest: [fastify.authenticate]` and `security: [{ cookieAuth: [] }]`. Response schemas live in `@api/schemas/responses.ts`.

### Errors

Extend `DefaultUseCaseError` in `src/domain/shared/errors/`. Existing errors and their HTTP codes:

- `EntityAlreadyExist` → 409, `EntityNotFound` → 404, `InvalidCredentials` → 401
- `InvalidCreationData`, `ScheduleTooSoon`, `ScheduleTooFarAhead`, `SendEmailError` → 400
- `SlotNotAvailable` → 409

Error-to-HTTP mapping: `src/apps/api/handlers/errors/use-cases-error-mapper.ts`

### Database (Prisma + PostgreSQL)

- Schema: `src/infra/database/prisma/schema.prisma`
- Generated client: `src/infra/database/prisma/_generated/`
- Field naming: `creationDate`/`updateDate` (not `createdAt`), `@db.Timestamp()`, `@db.Uuid`, `@@map("TableName")`
- Always run `npm run db:migrate:dev` after schema changes
- Mappers in `entities-mappers/`: `toModel()` and `toEntity()` — always parse with Zod in `toEntity()`

### Services

Interface in `src/domain/services/`, implementation in `src/infra/services/` with `static create()`.

Available: `LogService`, `HashPasswordService`, `QueueService`, `EmailService`, `RedisCacheService`

### Message Queue

To add a new handler:
1. Add type to `MessageSchema.type` in `src/infra/queue/message.ts`
2. Create handler in `src/apps/queue/handlers/[name]-handler.ts`
3. Add case to `MainHandler` in `_main.ts`

## Code Conventions

- **Formatting:** Tabs, double quotes (enforced by Biome)
- **Imports:** Always `.js` extension; prefer `import type { ... }` for type-only imports
- **No `any` type** (Biome `noExplicitAny`)

## Tests

Located in `src/apps/api/tests/`. Each test file bootstraps with:

```typescript
let server: Server;
beforeAll(async () => { server = (await runInitTestConfigs()).server; });
afterAll(async () => { await runFinalTestConfigs(); });
```

Tests run against a real isolated PostgreSQL schema (not mocks). Helpers:

- `createAndAuthTestSeller(server)` — create + authenticate a test seller
- `setSellerFullInitialTestData(server)` — populate full agenda test data
- `createDefaultTestAgendaConfig()` — default config object
- Use `randomUUID()` for unique emails in each test

## Environment

Three env files: `.env.development`, `.env.production`, `.env.test`

Key variables: `DATABASE_URL`, `API_AUTH_JWT_SECRET`, `API_REFRESH_JWT_SECRET`, `API_JWT_RESET_SECRET`, `REDIS_ENABLE`, `RABBITMQ_*`, `SMTP_*`

Docker Compose provides PostgreSQL (5432), Redis (6379), and RabbitMQ (5672 / management 15672).
