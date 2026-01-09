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
├── @types/           # Shared TypeScript types
├── domain/           # Business logic (entities, use-cases, interfaces)
├── infra/            # Infrastructure (database, cache, queue, services)
└── apps/             # Entry points (api, queue, jobs)
```

**Domain Layer (`src/domain/`):**

- `entities/` - Zod schemas and types for domain entities
- `entities/helpers/` - Entity creation/update helpers (`createEntity`, `updateEntity`)
- `repositories/` - Repository interfaces
- `repositories/uow/` - Unit of Work interface
- `services/` - Service interfaces
- `shared/errors/` - Domain error classes
- `shared/value-objects/` - Reusable value objects (`IdObj`, `DayObj`, `TimeObj`, etc.)
- `use-cases/` - Business logic classes

**Infrastructure Layer (`src/infra/`):**

- `cache/` - Redis client and service
- `database/` - Sequelize connection, config, models, migrations, seeders, helpers
- `entities-mappers/` - Domain ↔ Model mappers
- `envs/` - Environment configuration
- `queue/` - RabbitMQ connection, publisher, message schema
- `repository/` - Repository implementations
- `repository/uow/` - SequelizeUnitOfWork implementation
- `repository/cached/` - Cached repository decorators
- `services/` - Service implementations
- `use-cases-factories/` - Use-case factory functions

**Apps Layer (`src/apps/`):**

- `api/` - Fastify HTTP server
- `queue/` - RabbitMQ consumers and handlers
- `jobs/` - Scheduled jobs (node-cron)

## Path Aliases

This repo supports path aliases via `tsconfig.json`.

**CRITICAL (practical rule):**

- Use **path aliases** for imports that cross top-level boundaries (`apps/`, `infra/`, `domain/`) or when importing from a distant folder.
- Use **relative imports** only for _local, same-feature_ modules (e.g. inside `src/apps/api/**`) and for _domain-internal_ imports.
- Avoid deep relative imports like `../../../...` across layers.

```typescript
// ✅ CORRECT
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { SequelizeUnitOfWork } from "@infra/repository/uow/sequelize-unit-of-work.js";
import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";

// ❌ WRONG
import { CreateSellerUseCase } from "../../../domain/use-cases/create-seller.js";
```

Aliases: `@/*` → `./src/*`, `@domain/*` → `./src/domain/*`, `@infra/*` → `./src/infra/*`, `@api/*` → `./src/apps/api/*`

## ESM Imports

**CRITICAL:** This project is ESM.

- Always include the `.js` extension in import specifiers (even in `.ts` files).
- Prefer `import type { ... }` for types.

## Database & Migrations

Uses **Sequelize ORM** with TypeScript decorators.

**CRITICAL:**

- Migrations use `.cjs` extension: `src/infra/database/migrations/TIMESTAMP-name.cjs`
- Models are auto-loaded from `src/infra/database/models/` directory
- **ALWAYS create a migration when changing anything database-related**
- **Timestamp fields:** `creationDate` and `updateDate` (not Sequelize defaults)

**Model Pattern:**

```typescript
@Table({ tableName: "TableName" })
class EntityModel extends Model<...> {
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;
}
```

Notes:

- Timestamps are disabled at the Sequelize connection level via `define: { timestamps: false }`.
- Models are auto-loaded using `src/infra/database/helpers/auto-load-models.ts` (ESM dynamic imports via file URLs).

**Mappers** (`src/infra/entities-mappers/`): Functions `toModel()` and `toEntity()` for conversion. Always parse with Zod schema in `toEntity()`.

## Validation & Type Safety

**Zod schemas** validate at: domain entities, API input, mappers.

**Patterns:**

- Use `.pick()` to create input schemas from entity schemas
- Use `.omit()` to exclude fields from schemas
- Use `.refine()` for complex validations

**Value Objects** (in `@domain/shared/value-objects/`): `IdObj`, `TimeObj`, `DayObj`, `Timestamp`, `ParanoidTimestamp`

**CRITICAL:** Never use `any` type.

## Use-Case Pattern

All business logic in `src/domain/use-cases/`. Each use-case file contains:

1. Input schema (Zod) - derived from entity schema using `.pick()`
2. Input type - `z.infer<typeof Schema>`
3. Use-case class with `execute()` method

**Pattern:**

```typescript
export const CreateEntitySchema = EntitySchema.pick({
  field1: true,
  field2: true,
});
export type CreateEntityType = z.infer<typeof CreateEntitySchema>;

export class CreateEntityUseCase {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute(input: CreateEntityType): Promise<{ data: EntityType }> {
    // Business logic
  }
}
```

**Entity Creation:** Use `createEntity<T>()` helper to add `id`, `creationDate`, `updateDate`.

**Entity Update:** Use `updateEntity<T>()` helper to set `updateDate`.

**Transactions:** Wrap write operations:

```typescript
try {
  await this.uow.beginTransaction();
  // operations
  await this.uow.commitTransaction();
} catch (err) {
  await this.uow.rollbackTransaction();
  throw err;
}
```

If available, prefer `await this.uow.withTransaction(async () => { ... })` to keep use-cases concise.

## Repository Pattern

**Steps to create:**

1. Define interface in `src/domain/repositories/[name].interface.ts`
2. Implement in `src/infra/repository/[name].ts` extending `ClassRepository` from `src/infra/repository/_base-class.ts`
3. Add getter to `IUnitOfWork` interface (`src/domain/repositories/uow/unit-of-work.interface.ts`)
4. Add getter to `SequelizeUnitOfWork` implementation (`src/infra/repository/uow/sequelize-unit-of-work.ts`)

Cached repository decorators live in `src/infra/repository/cached/` and usually extend `ClassCacheRepository` from `src/infra/repository/cached/_base-class.ts`.

**CRITICAL:**

- Arrays return `[]` when empty, never `null`
- Single entity queries return `null` for not found
- Always pass `{ transaction: this.transaction }` to Sequelize operations
- Avoid embedding business rules in repositories (e.g., default ordering). If ordering matters, accept it as an explicit parameter and let the use-case decide.

## API Routes

Routes in `src/apps/api/routes/` follow the `InitRoute` pattern:

```typescript
export const initEntityRoutes: InitRoute = (logger: LogService, tags) => {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/",
      {
        schema: {
          body: CreateSchema.omit({ sellerId: true }),
          tags,
          description: "Description for Swagger",
          response: {
            200: ResponseSchema,
            400: DefaultErrorSchema,
          },
        },
        onRequest: [fastify.authenticate], // For protected routes
      },
      async (request, reply) => {
        const { useCase } = createEntityFactory(logger);
        const sellerId = request.authSeller.id;
        const result = await useCase.execute({ ...request.body, sellerId });
        return result;
      }
    );
  };
};
```

**Route Registration** (`_init.ts`):

```typescript
fastify.register(initEntityRoutes(logger, ["tag-name"]), {
  prefix: "entities",
});
```

**CRITICAL:**

- Routes NEVER instantiate UoW or use-cases directly - always use factories
- Use `onRequest: [fastify.authenticate]` for protected routes
- For protected routes, also set Swagger cookie auth: `schema.security: [{ cookieAuth: [] }]`
- Access authenticated user via `request.authSeller.id`
- Use `.omit({ sellerId: true })` on schemas when sellerId comes from auth
- `200` response schemas must be exported from `@api/routes/schemas/responses.ts` (avoid inline `z.object(...)` inside route files)

## Use-Case Factories

Located in `src/infra/use-cases-factories/`. Follow `CreateFactoryFunction` type:

Factory base type is defined in `src/infra/use-cases-factories/_base-type.ts`.

```typescript
import { SequelizeUnitOfWork } from "@infra/repository/uow/sequelize-unit-of-work.js";

export const createEntityFactory: CreateFactoryFunction<CreateEntityUseCase> = (
  logService
) => {
  const uow = SequelizeUnitOfWork.create();
  const useCase = new CreateEntityUseCase(uow);
  return { uow, useCase };
};
```

**CRITICAL:**

- Do **NOT** use `createSequelizeUOW()` (removed)
- Always instantiate the UoW with `const uow = SequelizeUnitOfWork.create();`

## Error Handling

**Errors** extend `DefaultUseCaseError` in `src/domain/shared/errors/`:

- `EntityAlreadyExist` → 409
- `EntityNotFound` → 404
- `InvalidCredentials` → 401
- `InvalidCreationData` → 400
- `SlotNotAvailable` → 400
- `ScheduleTooSoon` → 400
- `ScheduleTooFarAhead` → 400

Errors are thrown from use-cases; global handler converts to HTTP responses.

## Message Queue

**Infrastructure** (`src/infra/queue/`): `queue-config.ts`, `publisher.ts`, `message.ts`

**Application** (`src/apps/queue/`): `consumer.ts`, `handlers/`, `start-queue.ts`

**Adding a handler:**

1. Add type to `MessageSchema.type` enum in `message.ts`
2. Create handler in `handlers/[name]-handler.ts`
3. Add case to `_main.ts` handler router

## Services

**Pattern:**

1. Interface in `src/domain/services/[name].interface.ts`
2. Implementation in `src/infra/services/[name].ts`

**CRITICAL:**

- Prefer a `static create(...)` constructor on service implementations (factories were removed)

## Dev Workflow

**Development:**

- `npm run dev:server` - API with tsx watch
- `npm run dev:queue` - Queue consumer
- `npm run dev:jobs` - Scheduled jobs

**Database:**

- `npm run db:migrate` / `db:migrate:undo` / `db:seed` / `db:reset`

**Quality:**

- `npm run lint` / `format` / `organize:all` / `ts:check` / `test`
