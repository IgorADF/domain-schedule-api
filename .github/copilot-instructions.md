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
- **ALWAYS create a migration when changing anything database-related** (adding/removing/modifying columns, indexes, tables, etc.)
- For existing tables, create an ALTER migration with timestamp: `YYYYMMDDHHMMSS-alter-table-name.cjs`
- **Timestamp fields use custom names: `creationDate` and `updateDate`** (not Sequelize defaults `createdAt`/`updatedAt`)
- All migrations must define timestamp columns as: `creationDate` and `updateDate`

**Model Pattern:**

1. Import decorators from `sequelize-typescript`
2. Use `@Table({ tableName, timestamps: false })`
3. **ALWAYS declare id with `@Column` decorator:** `@Column({ allowNull: false, type: DataType.UUID, primaryKey: true }) declare id: string;`
4. Define columns with `@Column({ type: DataType.X, allowNull: true/false })`
5. Declare timestamps: `creationDate`, `updateDate`
6. Add associations: `@BelongsTo`, `@HasMany`, `@ForeignKey`

**CRITICAL:** Never use `declare id: string;` without `@Column` decorator - this causes SQL quoting issues with UUIDs.

**Mappers** (`src/infra/entities/mappers/`): Plain functions `toModel()` and `toEntity()` for conversion.

**Adding a field:** Entity → Migration (.cjs) → Model → Mapper

**Modifying a field:** Migration (.cjs) → Model → Mapper (if needed)

## Validation & Type Safety

**Zod schemas** validate at: domain entities, API input, mappers.

**Patterns:**

- Strings: `z.string().min(1).max(50)`
- Numbers: `z.number().positive().min(X).max(Y)`
- Optional: Chain `.optional()` at END
- Nullable: Chain `.nullable()` at END
- Use `.pick()` to create input schemas from entity schemas
- Use `.omit()` to exclude fields from schemas
- Use `.refine()` for complex validations

**Value Objects:** `IdObj`, `TimeObj`, `DayObj`, `Timestamp`, `ParanoidTimestamp`

**Helper Functions:**

- `dayToISOString(day)` - Convert DayObj to ISO date string (YYYY-MM-DD)
- `isoStringToDay(string)` - Convert ISO date string to DayObj

**CRITICAL:** Never use `any` type. Format data before passing to functions, not inline.

## Use-Case Pattern

All business logic in `src/domain/use-cases/`. Each class:

- Takes `IUnitOfWork` in constructor (some also take other use-cases for composition)
- Receives pre-validated input
- Has `execute()` as entry point
- Throws custom errors from `src/domain/shared/errors/`

**Return types:**

- Query: `Promise<{ data: EntityType | EntityType[] }>`
- Command: `Promise<{ data: EntityType }>`
- Auth: Minimal data, NEVER passwords

**Entity Creation:** Use `createEntity()` helper from `src/domain/entities/helpers/creation.ts` to automatically add `id`, `creationDate`, and `updateDate`:

```typescript
import { createEntity } from "../entities/helpers/creation.js";

const entity = createEntity<EntityType>({
  // ...entity fields (excluding id, creationDate, updateDate)
});

const parsed = EntitySchema.parse(entity);
```

**Entity Update:** Use `updateEntity()` helper from `src/domain/entities/helpers/update.ts` to automatically update `updateDate`:

```typescript
import { updateEntity } from "../entities/helpers/update.js";

const updatedData = updateEntity<EntityType>({
  // ...fields to update (updateDate is automatically set)
});
```

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

**Use-Case Composition:** Some use-cases depend on others (e.g., `GenerateSlotsUseCase` is injected into `ListAvailableSlotsUseCase` and `CreateAgendaScheduleUseCase`).

## Repository Pattern

**4 steps to create:**

1. Define interface in `src/domain/repositories/[name].interface.ts`
2. Implement in `src/infra/repository/[name].repository.ts`
3. Add getter to UoW interface in `src/domain/repositories/uow/unit-of-work.ts`
4. Add getter to UoW implementation in `src/infra/repository/uow/sequelize-unit-of-work.ts`

**CRITICAL:**

- Arrays return `[]` when empty, never `null`
- Repositories don't throw errors; return `null` for not found
- Use `Model.create(model, { transaction })` for single creates
- Use `bulkCreate()` for multiple creates
- Always pass `{ transaction: this.transaction }` to Sequelize operations

**Common Repository Methods:**

- `create(data)` - Create single entity
- `bulkCreate(data[])` - Create multiple entities
- `getById(id)` - Get by ID (returns null if not found)
- `getByDateRange(configId, initialDate, finalDate)` - Query by date range
- `getByXxxId(id)` or `getByXxxIds(ids[])` - Get by parent ID(s)

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

- Routes NEVER instantiate UoW or use-cases directly - always use factories
- Use `onRequest: [fastify.authenticate]` for protected routes
- Register routes in `_init.ts` with plural prefixes
- **ALWAYS create an HTTP test file in `src/apps/api/http/` for each new route**
- Use `.omit({ sellerId: true })` on schemas when sellerId comes from auth

**Auth:** Access `request.authSeller?.id` on authenticated routes.

**Current Routes:**

- `/sellers` - Authentication, registration, profile updates
- `/agendas` - Agenda configuration and available slots
- `/agenda-schedules` - Schedule management
- `/overwrite-days` - Overwrite day management with periods

**Protected Endpoint Pattern:**

```typescript
fastify.post(
  "/",
  {
    schema: { body: Schema.omit({ sellerId: true }) },
    onRequest: [fastify.authenticate],
  },
  async (request) => {
    const sellerId = request.authSeller?.id as string;
    const { useCase } = factory();
    return await useCase.execute({ ...request.body, sellerId });
  }
);
```

**Validation Pattern:** Always validate that resources belong to authenticated seller:

```typescript
const resource = await this.uow.repository.getById(id);
if (!resource || resource.sellerId !== input.sellerId) {
  throw new EntityNotFound();
}
```

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
- `InvalidCreationData` → 400
- `SlotNotAvailable` → 400

Throw from use-cases; global handler converts to HTTP responses.

## Domain Entities

**Core Entities:**

- `Seller` - User/seller account
- `AgendaConfig` - Main agenda configuration (belongs to Seller)
- `AgendaDayOfWeek` - Weekly recurring schedule configuration
- `AgendaPeriods` - Time periods with service duration/intervals (can belong to AgendaDayOfWeek OR OverwriteDay)
- `OverwriteDay` - Date-specific schedule overrides
- `AgendaSchedule` - Booked appointments
- `AgendaEvent` - Calendar events

**Value Objects:** `IdObj`, `DayObj`, `TimeObj`, `Timestamp`, `ParanoidTimestamp`

**Key Relationships:**

- `AgendaPeriods` has nullable `agendaDayOfWeekId` OR nullable `overwriteDayId` (XOR constraint via Zod refine)
- `OverwriteDay` can have multiple `AgendaPeriods` to define custom schedules for specific dates
- If `OverwriteDay.cancelAllDay = true`, no periods needed (day is blocked)

## Slot Generation & Availability

**GenerateSlotsUseCase** centralizes slot logic:

**Key Methods:**

- `generateAllSlots(initialDate, finalDate, context)` - Generates all possible slots, considering overwrite days
- `filterAvailableSlots(slots, context)` - Filters out booked/past slots
- `groupSlotsByDay(slots)` - Groups slots by day (only days with slots)
- `groupSlotsByDayRange(slots, initialDate, finalDate)` - Groups slots by day including ALL days in range (empty arrays for days without slots)
- `fetchOverwriteContext(uow, agendaConfigId, initialDate, finalDate)` - Helper to fetch overwrite days and their periods
- `isSlotAvailable(slot, context)` - Validates if a specific slot is available

**Overwrite Day Priority:**

1. Check if date has an `OverwriteDay`
2. If yes and `cancelAllDay = true` → skip day (no slots)
3. If yes and `cancelAllDay = false` → use overwrite periods (ignores regular day of week)
4. If no overwrite day → use regular `AgendaDayOfWeek` periods

**Slot Filtering:**

- Respects `minHoursOfAdvancedNotice` from `AgendaConfig`
- Respects `maxDaysOfAdvancedNotice` from `AgendaConfig`
- Filters out already booked slots
- Past slots are blocked if `minHoursOfAdvancedNotice` is set

## Dev Workflow

**Development:**

- `npm run dev:server` - API with tsx watch
- `npm run dev:queue` - Queue consumer
- `npm run dev:jobs` - Scheduled jobs

**Production:**

- `npm run build` → `npm run start:api|queue|jobs`

**Database:**

- `npm run db:migrate` / `db:migrate:undo` / `db:seed` / `db:reset`

**Quality:**

- `npm run lint` / `format` / `organize:all` / `ts:check` / `test`

## Docker

**Targets:** `api`, `queue`, `jobs`

**Services:** postgres, redis, rabbitmq, api, queue, jobs

```bash
docker-compose up -d                              # Start all
docker-compose up -d postgres redis rabbitmq      # Infra only
docker-compose logs -f api                        # View logs
```

**Env vars:** `DB_*`, `REDIS_*`, `RABBITMQ_*`, `API_*`, `SMTP_*`

## Authentication & Authorization

**Cookie-based JWT auth** with dual-token system:

- Auth token: 15 minutes (short-lived)
- Refresh token: 7 days (long-lived)
- Both stored as HTTP-only cookies with `SameSite=Lax`
- Secure flag enabled in production

**Auth Flow:**

1. Login → sets both tokens as cookies
2. Protected routes use `fastify.authenticate` decorator
3. If auth token expired but refresh valid → auto-refresh both tokens
4. Access authenticated user via `request.authSeller`

**Custom Decorators:**

- `fastify.authenticate` - Authentication middleware
- `fastify.jwtSign(payload, secret, options)` - Sign JWT
- `fastify.jwtVerify(token, secret)` - Verify JWT (returns `{ payload, error }`)
- `fastify.createCookie(name, value, maxAge)` - Create cookie string
- `fastify.setSignTokensToReply(reply, payload, authData, refreshData)` - Set auth cookies
- `fastify.setLogoutTokensToReply(reply, authData, refreshData)` - Clear auth cookies

**CRITICAL:** Always validate resource ownership in use-cases, not just routes.

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

**Runtime:** fastify, sequelize, zod, bcryptjs, uuidv7, luxon, nodemailer, amqplib, ioredis, node-cron, jsonwebtoken, cookie

**Dev:** vitest, tsx, typescript, @biomejs/biome
