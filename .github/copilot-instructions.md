# Copilot Instructions

## Code Formatting

**CRITICAL:** Follow Biome configuration in `biome.json`:

- **Indentation:** Tabs (not spaces)
- **Quotes:** Double quotes
- **Imports:** Auto-organized via `organizeImports: "on"`

## Architecture Overview

**Domain-Driven Design (DDD)** TypeScript/Fastify API with strict layering:

```
src/
├── domain/           # Business logic (entities, use-cases, interfaces)
├── infra/            # Infrastructure (database, cache, queue, services)
└── apps/             # Entry points (api, message-queue, jobs)
```

**Infrastructure Layer (`src/infra/`):**

- `cache/` - Redis client and service
- `database/` - Sequelize models, migrations, seeders
- `entities/mappers/` - Domain ↔ Model mappers
- `envs/` - Environment configuration
- `queue/` - RabbitMQ connection, publisher, message schema
- `repository/` - Repository implementations
- `services/` - Email, log, queue services + factories
- `use-cases/factories/` - Use-case factory functions

**Critical:** Repositories are transaction-aware via `SequelizeUnitOfWork`.

## Path Aliases

**CRITICAL:** Always use path aliases, NEVER relative paths.

```typescript
// ✅ CORRECT
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { SequelizeUnitOfWork } from "@infra/repository/uow/sequelize-unit-of-work.js";

// ❌ WRONG
import { CreateSellerUseCase } from "../../../domain/use-cases/create-seller.js";
```

Aliases: `@/*` → `./src/*`, `@domain/*`, `@infra/*`, `@api/*`

## Database & Migrations

Uses **Sequelize ORM** with TypeScript decorators.

**CRITICAL:**

- Migrations/seeders use `.cjs` extension: `src/infra/database/migrations/TIMESTAMP-name.cjs`
- All models registered in `src/infra/database/connection.ts`

**Model Pattern:**

1. Import decorators from `sequelize-typescript`
2. Use `@Table({ tableName, paranoid, timestamps: false })`
3. Define columns with `@Column({ type: DataType.X })`
4. Declare timestamps: `createdAt`, `updatedAt`, `deletedAt?`
5. Add associations: `@BelongsTo`, `@HasMany`, `@ForeignKey`

**Mappers** (`src/infra/entities/mappers/`): Plain functions `toModel()` and `toEntity()` for conversion.

**Adding a field:** Entity → Migration (.cjs) → Model → Mapper

## Validation & Type Safety

**Zod schemas** validate at: domain entities, API input, mappers.

**Patterns:**

- Strings: `z.string().min(1).max(50)`
- Numbers: `z.number().positive().min(X).max(Y)`
- Optional: Chain `.optional()` at END
- Use `.pick()` to create input schemas from entity schemas

**Value Objects:** `IdObj`, `TimeObj`, `DayObj`, `Timestamp`, `ParanoidTimestamp`

**CRITICAL:** Never use `any` type. Format data before passing to functions, not inline.

## Use-Case Pattern

All business logic in `src/domain/use-cases/`. Each class:

- Takes `IUnitOfWork` in constructor
- Receives pre-validated input
- Has `execute()` as entry point
- Throws custom errors from `src/domain/shared/errors/`

**Return types:**

- Query: `Promise<{ data: EntityType }>`
- Command: `Promise<void>`
- Auth: Minimal data, NEVER passwords

**Bulk operations:** Format all items first, then call `bulkCreate()` once. NEVER call repository inside loops.

**Transactions:** Managed inside use-cases for write operations.

```typescript
async execute(input: InputType): Promise<void> {
	try {
		await this.uow.beginTransaction();
		// ... business logic ...
		await this.uow.commitTransaction();
	} catch (err) {
		await this.uow.rollbackTransaction();
		throw err;
	}
}
```

## Repository Pattern

**4 steps to create:**

1. Define interface in `src/domain/repositories/[name].interface.ts`
2. Implement in `src/infra/repository/[name].repository.ts`
3. Add getter to UoW interface in `src/domain/repositories/uow/unit-of-work.ts`
4. Add getter to UoW implementation in `src/infra/repository/uow/sequelize-unit-of-work.ts`

**CRITICAL:**

- Arrays return `[]` when empty, never `null`
- Repositories don't throw errors; return `null` for not found
- Use `Model.create(model, { transaction })` not `.toJSON()`

## Cache Pattern

**Structure:** `src/infra/cache/` (redis client, service) + `src/infra/repository/cache/` (cached repos)

**Cache:** Read-heavy entities, computed data, configs. **Don't cache:** Auth queries, real-time data, transactional data.

**Keys:** `entity:${id}`, invalidate on writes, use TTLs.

## API Routes

Routes in `src/apps/api/routes/` use factories from `src/infra/use-cases/factories/`.

```typescript
fastify.post("/", { schema: { body: Schema } }, async (request) => {
  const { useCase } = createSellerFactory();
  return await useCase.execute(request.body);
});
```

**CRITICAL:**

- Routes NEVER instantiate UoW or use-cases directly
- Use `fastify.authenticate` for protected routes
- Register routes in `_init.ts` with plural prefixes

**Auth:** Access `request.authSeller?.id` on authenticated routes.

## Message Queue

**Infrastructure** (`src/infra/queue/`):

```
├── connection.ts    # RabbitMQ singleton connection
├── publisher.ts     # Message publisher
└── message.ts       # MessageSchema (id, type, data)
```

**Application** (`src/apps/message-queue/`):

```
├── consumers/consumer.ts  # Consumes and routes to handlers
├── handlers/
│   ├── _main.ts           # Routes by message.type
│   └── email-handler.ts   # Specific handler
└── start-queue.ts         # Entry point
```

**Adding a handler:**

1. Add type to `MessageSchema.type` enum
2. Create handler in `handlers/[name]-handler.ts`
3. Add case to `MainHandler.handle()`
4. Inject in `Consumer` constructor

**Patterns:** Singleton connection, `ack()` on success, `nack(msg, false, true)` to requeue on error.

## Services Layer

Services in `src/infra/services/` implement domain interfaces.

```
├── email.ts      # Nodemailer
├── log.ts        # Logger abstraction
├── queue.ts      # QueueService → uses Publisher
└── factories/    # Service factories
```

**Adding a service:**

1. Interface in `src/domain/services/[name].interface.ts`
2. Implementation in `src/infra/services/[name].ts`
3. Factory in `src/infra/services/factories/[name].ts`

## Error Handling

**Errors** in `src/domain/shared/errors/`:

- `EntityAlreadyExist` → 409
- `EntityNotFound` → 404
- `InvalidCredentials` → 401
- `InvalidCreantionData` → 400

Throw from use-cases; global handler converts to HTTP responses.

## Domain Entities

**Entities:** `Seller`, `AgendaConfig`, `AgendaDayOfWeek`, `AgendaPeriods`, `OverwriteDay`, `AgendaEvent`, `Schedule`

**Value Objects:** `IdObj`, `DayObj`, `TimeObj`, `Timestamp`, `ParanoidTimestamp`

## Dev Workflow

**Development:**

- `npm run dev:server` - API with tsx watch
- `npm run dev:queue` - Queue consumer
- `npm run dev:jobs` - Scheduled jobs

**Production:**

- `npm run build` → `npm run start:api|queue|jobs`

**Database:**

- `npm run db:migrate` / `db:migrate:undo` / `db:seed`

**Quality:**

- `npm run lint` / `format` / `organize:all` / `ts:check` / `test`

## Docker

**Targets:** `api`, `queue`, `jobs`

**Services:** postgres, redis, rabbitmq, api, queue, jobs

```bash
docker-compose up -d                    # Start all
docker-compose up -d postgres redis rabbitmq  # Infra only
docker-compose logs -f api              # View logs
```

**Env vars:** `DB_*`, `REDIS_*`, `RABBITMQ_*`, `API_*`, `SMTP_*`

## Testing

Tests in `src/apps/api/routes/tests/`. Use vitest + supertest.

```typescript
describe("POST /sellers", () => {
  it("should create seller", async () => {
    const res = await request(server).post("/sellers").send(data);
    expect(res.status).toBe(200);
  });
});
```

Test: happy path, validation errors, business errors, edge cases.

## Key Dependencies

**Runtime:** fastify, sequelize, zod, bcryptjs, uuidv7, luxon, nodemailer, amqplib, ioredis, node-cron

**Dev:** vitest, tsx, typescript
