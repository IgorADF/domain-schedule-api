# Copilot Instructions

## Architecture Overview

This is a **Domain-Driven Design (DDD)** TypeScript/Fastify API for managing seller schedules and agendas. The project follows strict layering:

- **`src/domain/`** - Pure business logic (entities, use-cases, repository interfaces)
- **`src/core/`** - Infrastructure (database models, mappers, repositories, utilities)
- **`src/apps/api/`** - Fastify HTTP layer (routes, server config)

Critical pattern: **Repositories are transaction-aware**. All data access flows through `SequelizeUnitOfWork` which manages a single Sequelize transaction per request.

## Database & Migrations

Uses **Sequelize ORM** with TypeScript decorators. Key conventions:

- **CRITICAL:** Migrations MUST use `.cjs` extension (not `.js`): `src/core/database/migrations/TIMESTAMP-description.cjs`
- **CRITICAL:** Seeders MUST use `.cjs` extension (not `.js`): `src/core/database/seeders/TIMESTAMP-description.cjs`
- **CRITICAL:** All models MUST be imported and registered in `src/core/database/connection.ts` models array
- Models in `src/core/database/models/` match migrations exactly
- **Mappers** (`src/core/database/entities-mappers/`) are the bridge between Sequelize models and domain entities:
  - `toModel()` converts domain entity → Sequelize model (for database operations)
  - `toEntity()` converts Sequelize model → domain entity (for business logic)
  - Handle field name differences (e.g., `createdAt` in both domain and database)
  - Transform complex types (e.g., Day value object ↔ DATEONLY string)
  - **Entities not necessary have 1-1 properties to models columns** - models may have additional fields (timestamps, associations) not present in entities
- **CRITICAL:** When a model creates/updates/removes an association field, the related model MUST also be updated to reflect the bidirectional association. Example: if `AgendaDayOfWeekModel` has `@BelongsTo(() => AgendaConfigsModel)`, then `AgendaConfigsModel` must have `@HasMany(() => AgendaDayOfWeekModel)`

**Adding a new field workflow:**

1. Create domain entity prop in `src/domain/entities/`
2. Create `.cjs` migration in `src/core/database/migrations/`
3. Add prop to Sequelize model in `src/core/database/models/`
4. Update mapper functions in `src/core/database/entities-mappers/`

## Validation & Type Safety

**Zod schemas** validate at three levels:

1. Domain entity creation (e.g., `SellerWithPasswordSchema`)
2. API input (e.g., `CreateSellerSchema`)
3. Mapper transformations

Example: `SellerWithPasswordSchema` extends `SellerSchema` and transforms password via `hashPassword()`.

**Zod v4 Pattern in Use-Cases:**
Input is validated OUTSIDE of use-cases (typically at the API route level). Use-cases receive already-validated data:

```typescript
async execute(input: InputType): Promise<{ data: OutputType }> {
  // input is already validated, proceed with business logic
  // ...
}
```

**Type Usage Convention:\*\***

- Use `SellerType` (without password) as the default for repository method signatures and return types
- Use `SellerWithPasswordSchemaType` ONLY for:
  - Creating new sellers (where password is required)
  - Authentication operations (where password comparison is needed)
- Repository interfaces should accept `SellerType` or `Partial<SellerType>`, not the password variant

**Import Awareness:**
When changing types, schemas, or adding new functionality, ALWAYS update imports immediately. Check if the types/schemas/functions you're using are imported at the top of the file.

**Type Safety:**
Always use correct, specific types for function parameters and return values. NEVER use `any` type unless absolutely necessary. Prefer TypeScript's type inference and utility types (e.g., `Omit`, `Pick`, `Partial`) to maintain type safety.

**Data Formatting:**
Format data before passing it to function calls, not inline. Avoid formatting data inside function call parameters (e.g., `.map()` inside `execute()`). Always format data in a separate variable first, then pass it as a parameter. This improves readability and makes debugging easier.

## Use-Case Pattern

All business logic lives in `src/domain/use-cases/`. Each class:

- Takes `IUnitOfWork` in constructor
- Receives already-validated input (validation happens at API route level using Zod schemas)
- Accesses repositories through UoW
- Throws custom errors from `src/domain/use-cases/errors/`
- **CRITICAL:** When creating multiple entities, format all data in a loop first, then call a bulk repository method. NEVER call repository methods inside loops - use `bulkCreate` instead
- **CRITICAL:** The `execute()` method must always exist as the entry point. You can create private helper methods for better code organization

Example: `CreateSellerUseCase` validates email uniqueness, formats data, persists via UoW.

## Repository Pattern

**Creating a new repository requires 4 steps:**

1. **Define interface** in `src/domain/repositories/[name].interface.ts`

   - Define methods with domain types (e.g., `SellerType`, `AgendaPeriodType`)
   - NEVER use model types or password variants in interfaces
   - **CRITICAL:** Methods that return arrays MUST NOT return `null`. Always return empty arrays `[]` when no results are found

2. **Implement repository** in `src/core/repository/[name].repository.ts`

   - Takes `SequelizeTransaction` in constructor
   - Implements the domain interface
   - Uses mappers to convert between models and entities
   - Passes transaction to Sequelize operations
   - **CRITICAL:** Methods returning arrays must return `[]` when empty, never `null`
   - **CRITICAL:** Repositories MUST NOT throw errors. Single-object queries should return `null` when not found. Let use-cases handle business logic errors
   - **CRITICAL:** If creating a new model, you MUST create a migration (.cjs) for the table first
   - **CRITICAL:** When creating Sequelize models, pass the model instance directly to `Model.create()`, do NOT use `.toJSON()`. Example: `await Model.create(model, { transaction })` not `await Model.create(model.toJSON(), { transaction })`

3. **Update UoW interface** in `src/domain/repositories/uow/unit-of-work.ts`

   - Add import for the new repository interface
   - Add getter: `get [name]Repository(): I[Name]Repository;`

4. **Update UoW implementation** in `src/core/repository/uow/sequelize-unit-of-work.ts`
   - Add import for repository interface and implementation
   - Add private property: `private _[name]Repository: I[Name]Repository | null = null;`
   - Add getter using `createAndGetRepository` pattern

Example pattern:

```typescript
get agendaPeriodsRepository() {
  return this.createAndGetRepository<IAgendaPeriodsRepository>(
    AgendaPeriodsRepository,
    "_agendaPeriodsRepository" as keyof this
  );
}
```

## API Routes & Transaction Handling

Routes in `src/apps/api/routes/` are initialized with `SequelizeUnitOfWork`:

- Each route handler creates a new UoW instance
- Call `uow.beginTransaction()` before use-cases
- Call `uow.commitTransaction()` on success or `uow.rollbackTransaction()` on errors
- Use-cases access repositories via `uow.sellerRepository`, `uow.agendaPeriodsRepository`, etc.

Routes use **fastify-type-provider-zod** for automatic request validation from Zod schemas.

**Route File Pattern:**

Each route file in `src/apps/api/routes/` follows this structure:

1. **Import use-cases and schemas** - Import specific use-case classes and their Zod schemas
2. **Import types** - Import `FastifyZodInstance` and `FastityInitRoutes` types
3. **Import UoW** - Import `SequelizeUnitOfWork` for transaction management
4. **Export init function** - Export a function named `init[Entity]Routes()` that returns `FastityInitRoutes`

Example pattern from [seller.ts](src/apps/api/routes/seller.ts):

```typescript
import z from "zod";
import {
  CreateSellerSchema,
  CreateSellerUseCase,
} from "../../../domain/use-cases/create-seller.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";
import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";
import { FastityInitRoutes } from "../@types/init-routes.js";

export function initSellerRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/",
      { schema: { body: CreateSellerSchema } },
      async function (request, reply) {
        const uow = new SequelizeUnitOfWork();
        const sup = new CreateSellerUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { data: useCase.data };
      }
    );
  };
}
```

**Route Registration Pattern:**

**CRITICAL:** When creating a new route file, it MUST be registered in [\_init.ts](src/apps/api/routes/_init.ts):

1. **Import the init function** - Import the `init[Entity]Routes` function from the new route file
2. **Register with prefix** - Call `fastify.register()` with the init function and a URL prefix - **CRITICAL:** Route prefixes MUST always be plural (e.g., `"sellers"`, `"agendas"`, `"periods"`)
   Example from [\_init.ts](src/apps/api/routes/_init.ts):

```typescript
import { initSellerRoutes } from "./seller.js";
import { initAgendaRoutes } from "./agenda.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";

export async function initRoutes(fastify: FastifyZodInstance) {
  fastify.register(initSellerRoutes(), { prefix: "sellers" });
  fastify.register(initAgendaRoutes(), { prefix: "agendas" });
}
```

**Route Validation Pattern:**
Always validate URL params, body, and query using Zod in the schema option:

```typescript
fastify.patch(
  "/:id",
  {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      body: UpdateSchema,
    },
  },
  async function (request, reply) { ... }
);
```

## Key Dependencies

- **fastify** v5.6+ - HTTP server with Zod type safety
- **sequelize** v6.37+ with **sequelize-typescript** - ORM
- **zod** v4.1+ - Schema validation
- **bcryptjs** - Password hashing
- **uuidv7** - ID generation
- **luxon** - Date/time handling (for scheduling features)
- **tsx** - TypeScript execution

Development: **vitest** for testing, **typescript** v5.9+

## Dev Workflow

- **`npm run dev`** - Start server with tsx watch (file changes auto-reload)
- Migrations: `npx sequelize-cli migration:generate --name=description`
- Seeders: `npx sequelize-cli seed:generate --name=description`

## Scheduling Domain (Agenda)

Emerging pattern in codebase:

- `AgendaConfig` - Top-level scheduling container per seller
- `AgendaDayOfWeek` - Links day + periods, must be unique per agenda
- `AgendaPeriods` - Start/end times, sequential within a slot
- `OverwriteDay` - Exception overrides for specific dates

Value objects in `src/domain/entities/value-objects/`: `Id`, `Day`, `Time` provide type-safe domain primitives.

## Testing

Tests colocate with routes: `src/apps/api/routes/tests/`. Use **vitest** for unit/integration testing with Fastify test utilities.

## Error Handling

Custom error classes in `src/domain/use-cases/errors/`:

- `EntityAlreadyExist` - Duplicate creation attempts
- `InvalidCreationData` - Zod validation fails
- `InvalidCredentials` - Auth failures
- `_default` - Extend for domain-specific errors

Always throw from use-cases; routes catch and convert to HTTP responses.
