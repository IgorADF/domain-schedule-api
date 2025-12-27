# Copilot Instructions

## Code Formatting

**CRITICAL:** All code MUST follow the Biome configuration defined in `biome.json`:

- **Indentation:** Use tabs (not spaces) - `indentStyle: "tab"`
- **Quotes:** Use double quotes for strings - `quoteStyle: "double"`
- **Import organization:** Imports must be organized automatically - `organizeImports: "on"`
- **Linting:** Follow recommended Biome linting rules

Always ensure code adheres to these standards when creating or updating files.

## Architecture Overview

This is a **Domain-Driven Design (DDD)** TypeScript/Fastify API for managing seller schedules and agendas. The project follows strict layering:

- **`src/domain/`** - Pure business logic (entities, use-cases, repository interfaces)
- **`src/core/`** - Infrastructure (database models, mappers, repositories, utilities)
- **`src/apps/api/`** - Fastify HTTP layer (routes, server config)

Critical pattern: **Repositories are transaction-aware**. All data access flows through `SequelizeUnitOfWork` which manages a single Sequelize transaction per request.

## Path Aliases

**CRITICAL:** Always use path aliases for imports. NEVER use relative paths like `../../../domain/`.

Configured path aliases in `tsconfig.json` and `vite.config.ts`:

- `@/*` → `./src/*`
- `@domain/*` → `./src/domain/*`
- `@core/*` → `./src/core/*`
- `@api/*` → `./src/apps/api/*`

**Examples:**

```typescript
// ✅ CORRECT - Use path aliases
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";

// ❌ WRONG - Don't use relative paths
import { CreateSellerUseCase } from "../../../domain/use-cases/create-seller.js";
import { SequelizeUnitOfWork } from "../../core/repository/uow/sequelize-unit-of-work.js";
```

**Pattern by file location:**

- **Routes** (`src/apps/api/routes/`): Use `@domain/*`, `@core/*`, `@api/*`
- **Use-cases** (`src/domain/use-cases/`): Use `@core/*` for utilities, relative imports for domain entities
- **Repositories** (`src/core/repository/`): Use `@domain/*` for entities/interfaces, relative for mappers/models
- **Mappers** (`src/core/entities/mappers/`): Use `@domain/*` for entities, relative for models
- **Factories** (`src/core/use-cases/factories/`): Use `@domain/*` and `@core/*`

## Database & Migrations

Uses **Sequelize ORM** with TypeScript decorators. Key conventions:

- **CRITICAL:** Migrations MUST use `.cjs` extension (not `.js`): `src/core/database/migrations/TIMESTAMP-description.cjs`
- **CRITICAL:** Seeders MUST use `.cjs` extension (not `.js`): `src/core/database/seeders/TIMESTAMP-description.cjs`
- **CRITICAL:** All models MUST be imported and registered in `src/core/database/connection.ts` models array
- Models in `src/core/database/models/` match migrations exactly

**Sequelize Model Pattern:**

Each model file follows this structure:

1. **Import types and decorators** - Import from `sequelize` and `sequelize-typescript`
2. **Define type exports** - Export `ModelType` and `ModelCreationType` using `InferAttributes` and `InferCreationAttributes`
3. **Table decorator** - Configure table name, paranoid mode, timestamps:
   ```typescript
   @Table({
     tableName: "Sellers",
     paranoid: true,  // For soft deletes (adds deletedAt)
     timestamps: false,  // We manage timestamps manually
     defaultScope: { attributes: { exclude: ["password"] } },  // Hide sensitive fields
   })
   ```
4. **Column decorators** - Define columns with constraints matching migrations:
   - Use `DataType.STRING(50)` to match VARCHAR(50)
   - Use `DataType.UUID` for ID fields
   - Use `DataType.TIME` for time-only fields
   - Use `DataType.DATE` for timestamps
   - Set `allowNull`, `unique`, `primaryKey` as needed
5. **Declare timestamps** - Always declare managed timestamp fields:
   ```typescript
   declare createdAt: Date;
   declare updatedAt: Date;
   declare deletedAt?: Date;  // Only for paranoid tables
   ```
6. **Association decorators** - Define relationships matching foreign keys:
   - `@BelongsTo(() => ParentModel)` for many-to-one
   - `@HasMany(() => ChildModel)` for one-to-many
   - `@HasOne(() => ChildModel)` for one-to-one
   - Always add `@ForeignKey()` on the column that holds the foreign key

- **Mappers** (`src/core/entities/mappers/`) are plain exported functions (not classes) that bridge Sequelize models and domain entities:
  - `toModel()` function converts domain entity → Sequelize model (for database operations)
  - `toEntity()` function converts Sequelize model → domain entity (for business logic)
  - **Import pattern:** Repositories use namespace imports: `import * as MapperName from "../entities/mappers/mapper-name.js";` to maintain `MapperName.toModel()` syntax
  - Handle field name differences (e.g., `createdAt` in both domain and database)
  - Transform complex types (e.g., Day value object ↔ DATEONLY string)
  - **Entities not necessary have 1-1 properties to models columns** - models may have additional fields (timestamps, associations) not present in entities
  - **CRITICAL:** When mapping `TimeObj` value objects, create Date instances and use `.setHours()` to set time:
    ```typescript
    const startTime = new Date();
    startTime.setHours(period.startTime.hour, period.startTime.minute, 0, 0);
    ```
  - **CRITICAL:** When mapping from Date to `TimeObj`, use `.getHours()` and `.getMinutes()`:
    ```typescript
    startTime: {
      hour: period.startTime.getHours(),
      minute: period.startTime.getMinutes(),
    }
    ```
- **CRITICAL:** When a model creates/updates/removes an association field, the related model MUST also be updated to reflect the bidirectional association. Example: if `AgendaDayOfWeekModel` has `@BelongsTo(() => AgendaConfigsModel)`, then `AgendaConfigsModel` must have `@HasMany(() => AgendaDayOfWeekModel)`

**Adding a new field workflow:**

1. Create domain entity prop in `src/domain/entities/`
2. Create `.cjs` migration in `src/core/database/migrations/`
3. Add prop to Sequelize model in `src/core/database/models/`
4. Update mapper functions in `src/core/entities/mappers/`

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

**Zod Validation Patterns:**

- **String constraints:** Always use `.min(1)` for required strings, `.max(N)` for database field limits

  - Example: `z.string().min(1).max(50)` for name fields
  - Email fields: `z.email().min(1).max(50)`
  - Password fields: `z.string().min(6).max(50)` (minimum 6 characters)

- **Number constraints:** Use `.positive()` for positive-only numbers, `.min()` and `.max()` for range validation
  - Example: `z.number().positive().min(5).max(9999)` for minutes/durations
  - Day of week: `z.number().min(1).max(7)` (1-7 range)
  - Order/sequence: `z.number().positive().min(1).max(5)`
- **Optional fields:** Chain `.optional()` at the END of the validation chain

  - Example: `z.number().positive().min(5).max(9999).optional()`
  - NEVER place `.optional()` before other validators

- **Value Objects:** Use value objects for domain primitives:
  - `IdObj` - UUID v7 validation: `z.uuidv7().min(1)`
  - `TimeObj` - Hour/minute validation: `z.object({ hour: z.number().min(0).max(23), minute: z.number().min(0).max(59) })`
  - `DayObj` - Year/month/day validation: `z.object({ year: z.number().min(1970), month: z.number().min(1).max(12), day: z.number().min(1).max(31) })`
  - `Timestamp` - Created/updated dates: `z.object({ createdAt: z.date(), updatedAt: z.date() })`
  - `ParanoidTimestamp` - Extends Timestamp with soft delete: adds `deletedAt: z.date().optional()`

**Type Usage Convention:**

- Use `SellerType` (without password) as the default for repository method signatures and return types
- Use `SellerWithPasswordSchemaType` ONLY for:
  - Creating new sellers (where password is required)
  - Authentication operations (where password comparison is needed)
- Repository interfaces should accept `SellerType` or `Partial<SellerType>`, not the password variant

**Schema Extension Pattern:**

When creating use-case input schemas, use Zod's `.pick()` to select only needed fields from entity schemas:

```typescript
export const CreateSellerSchema = SellerWithPasswordSchema.pick({
  name: true,
  email: true,
  password: true,
});
```

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

**Use-Case Structure Pattern:**

1. **Constructor** - Takes `IUnitOfWork` as dependency
2. **execute() method** - Main entry point, returns `Promise<{ data: T }>` for queries or `Promise<void>` for commands
3. **Private helper methods** - Extract complex logic into private methods (e.g., `formatNewSeller()`, `createPeriodsForDays()`)
4. **Static persist methods** - For bulk operations shared across use-cases (e.g., `static async bulkPersist()`)

**Use-Case Return Pattern:**

- **Query operations (read):** Return `Promise<{ data: EntityType }>` or `Promise<{ data: EntityType[] }>`
  - Example: `Promise<{ data: SellerType }>`
- **Command operations (write without returning entity):** Return `Promise<void>`
  - Example: `CreateCompleteAgendaUseCase.execute()` returns `Promise<void>`
- **ID-only returns:** For auth/special cases, return minimal data
  - Example: `Promise<{ seller_id: string }>`

**Formatting Data Pattern:**

Always create formatting helper methods when preparing data for persistence:

```typescript
formatNewSeller(newSeller: CreateSellerType): SellerWithPasswordSchemaType {
  const now = new Date();

  const formatNewSeller: SellerWithPasswordSchemaType = {
    ...newSeller,
    password: hashPassword(newSeller.password),

    id: uuidv7(),
    createdAt: now,
    updatedAt: now,
  };

  const parsedNewSeller = SellerWithPasswordSchema.parse(formatNewSeller);
  return parsedNewSeller;
}
```

**Bulk Operations Pattern:**

When creating multiple entities, use the following pattern:

1. Loop through input data and format each item (no DB calls in loop)
2. Collect formatted items in an array
3. Call static `bulkPersist()` method once with the array

```typescript
// ✅ CORRECT - Format first, then bulk create
const itemsToCreate: EntityType[] = [];

for (const input of inputs) {
  const formatted = await this.formatItem(input);
  itemsToCreate.push(formatted);
}

await UseCase.bulkPersist(itemsToCreate, this.uow);

// ❌ WRONG - Don't call repository inside loops
for (const input of inputs) {
  await this.uow.repository.create(input); // NEVER DO THIS
}
```

**Error Handling in Use-Cases:**

Use-cases should throw custom errors for business rule violations:

- Check business rules BEFORE persistence
- Throw specific error types from `src/domain/use-cases/errors/`
- Let routes catch and convert to HTTP responses

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
   - Uses namespace imports for mappers: `import * as MapperName from "../entities/mappers/mapper-name.js";`
   - Uses mapper functions to convert between models and entities (e.g., `MapperName.toModel()`, `MapperName.toEntity()`)
   - Passes transaction to Sequelize operations
   - **CRITICAL:** Methods returning arrays must return `[]` when empty, never `null`
   - **CRITICAL:** Repositories MUST NOT throw errors. Single-object queries should return `null` when not found. Let use-cases handle business logic errors
   - **CRITICAL:** If creating a new model, you MUST create a migration (.cjs) for the table first
   - **CRITICAL:** When creating Sequelize models, pass the model instance directly to `Model.create()`, do NOT use `.toJSON()`. Example: `await Model.create(model, { transaction })` not `await Model.create(model.toJSON(), { transaction })`
   - **BulkCreate Pattern:** For bulk operations, map entities to models first, then use `Model.bulkCreate()`:
     ```typescript
     async bulkCreate(data: EntityType[]) {
       const modelInstances = data.map((item) => Mapper.toModel(item));
       const created = await Model.bulkCreate(modelInstances, { transaction: this.transaction });
       return created.map((item) => Mapper.toEntity(item));
     }
     ```

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

Routes in `src/apps/api/routes/` use **factory functions** to instantiate use-cases with UoW:

- **CRITICAL:** Routes NEVER directly instantiate `SequelizeUnitOfWork` or use-cases - they use factory functions from `src/core/use-cases/factories/`
- Each factory creates a new UoW instance and use-case instance
- Routes destructure `{ useCase }` from the factory
- UoW manages transactions automatically - routes never call transaction methods
- Routes use **fastify-type-provider-zod** for automatic request validation from Zod schemas

**Factory Pattern:**

Every use-case MUST have a corresponding factory function in `src/core/use-cases/factories/[use-case-name].ts`:

```typescript
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import type { CreateFactoryFunction } from "@core/@types/create-factory.js";
import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";

export const createSellerFactory: CreateFactoryFunction<
  CreateSellerUseCase
> = () => {
  const uow = new SequelizeUnitOfWork();
  const useCase = new CreateSellerUseCase(uow);

  return {
    uow,
    useCase,
  };
};
```

**Factory Type Definition:**

The `CreateFactoryFunction<T>` type is defined in `src/core/@types/create-factory.ts`:

```typescript
import type { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";

export type CreateFactoryFunction<T> = () => {
  useCase: T;
  uow: SequelizeUnitOfWork;
};
```

**Transaction Pattern:**

Transactions are managed INSIDE use-cases, NOT in routes. Routes should NOT call transaction methods directly.

**Use-Case Transaction Pattern:**

```typescript
// ✅ CORRECT - Use-case manages transaction
async execute(input: InputType): Promise<{ data: OutputType }> {
  try {
    await this.uow.beginTransaction();

    // ... business logic and repository calls ...

    await this.uow.commitTransaction();
    return { data: result };
  } catch (err) {
    await this.uow.rollbackTransaction();
    throw err;
  }
}
```

**Route Pattern:**

```typescript
// ✅ CORRECT - Routes use factory and call use-case
async function (request, reply) {
  const { useCase } = createSellerFactory();
  const result = await useCase.execute(request.body);
  return { data: result.data };
}

// ❌ WRONG - Don't manually instantiate UoW or use-cases in routes
async function (request, reply) {
  const uow = new SequelizeUnitOfWork();
  const useCase = new CreateSellerUseCase(uow);
  // ...
}

// ❌ WRONG - Don't manage transactions in routes
async function (request, reply) {
  const uow = new SequelizeUnitOfWork();
  await uow.beginTransaction(); // DON'T DO THIS IN ROUTES
  // ...
}
```

**Authentication Pattern:**

Routes that require authentication use the `fastify.authenticate` decorator:

```typescript
fastify.post(
  "/",
  {
    schema: { body: CreateAgendaSchema.omit({ sellerId: true }) },
    onRequest: [fastify.authenticate], // Requires valid JWT
  },
  async (request) => {
    const { useCase } = createAgendaFactory();

    // Access authenticated seller from request
    const sellerId = request.authSeller?.id as string;
    await useCase.execute({ ...request.body, sellerId });

    return { success: true };
  }
);
```

**Authentication Types** (`src/apps/api/@types/auth-seller.ts`):

```typescript
export type AuthSeller = {
  id: string;
  email: string;
};
```

The `request.authSeller` property is available on authenticated routes and contains the decoded JWT payload.

**Route Error Handling:**

- Routes rely on Fastify's automatic error handling
- Custom errors from use-cases are automatically caught by Fastify
- No try-catch blocks needed in route handlers (Fastify handles this)
- Validation errors from Zod are automatically converted to 400 responses

**Route File Pattern:**

Each route file in `src/apps/api/routes/` follows this structure:

1. **Import factories** - Import factory functions from `src/core/use-cases/factories/`
2. **Import schemas** - Import Zod schemas from use-cases (for validation only, not use-case classes)
3. **Import types** - Import `FastifyZodInstance` and `FastityInitRoutes` types
4. **Export init function** - Export a function named `init[Entity]Routes()` that returns `FastityInitRoutes`

Example pattern from [seller.ts](src/apps/api/routes/seller.ts):

```typescript
import z from "zod";
import { authSellerFactory } from "@core/use-cases/factories/auth-seller.js";
import { createSellerFactory } from "@core/use-cases/factories/create-seller.js";
import { updateSellerFactory } from "@core/use-cases/factories/update-seller.js";
import { AuthSellerSchema } from "@domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "@domain/use-cases/create-seller.js";
import { UpdateSellerSchema } from "@domain/use-cases/update-seller.js";
import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { FastityInitRoutes } from "@api/@types/init-routes.js";

export function initSellerRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/",
      { schema: { body: CreateSellerSchema } },
      async function (request, reply) {
        const { useCase } = createSellerFactory();
        const result = await useCase.execute(request.body);
        return { data: result.data };
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

**HTTP Test File Pattern:**

**CRITICAL:** Every route file MUST have a corresponding `.http` file with the same name in the same directory for manual testing and documentation.

Pattern: `src/apps/api/routes/[entity].ts` → `src/apps/api/routes/[entity].http`

Examples:

- `seller.ts` → `seller.http`
- `agenda.ts` → `agenda.http`

**HTTP File Structure:**

1. **Use `@name` for requests** - Name each request for response referencing
2. **Include auth setup** - Duplicate auth request in each file for self-contained testing
3. **Document test cases** - Include both valid and invalid examples
4. **Use variables** - Reference `{{baseUrl}}` and `{{TOKEN}}` from workspace settings

Example pattern from `seller.http`:

```http
# @name AuthSeller
POST {{baseUrl}}/sellers/auth
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "123456"
}

###

@TOKEN = {{AuthSeller.response.body.token}}

###

# @name CreateSeller
POST {{baseUrl}}/sellers
Content-Type: application/json

{
  "name": "Test Seller",
  "email": "newseller@gmail.com",
  "password": "123456"
}
```

**HTTP File Purpose:**

- Manual API testing during development
- API documentation with request/response examples
- Quick debugging of specific endpoints
- Shareable examples for team collaboration

**Workflow:**

1. Create route file (e.g., `seller.ts`)
2. Create corresponding HTTP file (e.g., `seller.http`)
3. Add test cases covering happy path and error scenarios
4. Use REST Client extension to test endpoints manually

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

**Domain Entities** (`src/domain/entities/`):

- `Seller` - User account with authentication (email/password)
- `AgendaConfig` - Top-level scheduling container per seller (timezone, advance notice settings)
- `AgendaDayOfWeek` - Links day (1-7) + periods, must be unique per agenda config
- `AgendaPeriods` - Time slots with start/end times, service duration, intervals
- `OverwriteDay` - Exception overrides for specific dates
- `AgendaEvent` - Event log entries (new_schedule, cancel_by_client, cancel_by_user, reschedule_by_user)
- `Schedule` - Client booking with day, time, and contact info

**Value Objects** (`src/domain/entities/value-objects/`):

- `IdObj` - UUID v7 validation
- `DayObj` - Year/month/day date representation
- `TimeObj` - Hour/minute time representation
- `Timestamp` - createdAt/updatedAt timestamps
- `ParanoidTimestamp` - Extends Timestamp with optional deletedAt for soft deletes

## Testing

Tests colocate with routes: `src/apps/api/routes/tests/`. Use **vitest** and **supertest** for unit/integration testing with Fastify.

**Test File Pattern:**

**CRITICAL:** Every time a route is created or changed, you MUST add or update tests in `src/apps/api/routes/tests/`.

Each test file follows this structure:

1. **Import testing utilities** - Import `describe`, `it`, `expect`, `beforeAll`, `afterAll` from vitest
2. **Import supertest** - Import `request` from supertest for HTTP testing
3. **Import server** - Import `fastifyInstance` from `server-config.js`
4. **Setup/Teardown** - Use `beforeAll()` to ready the server, `afterAll()` to close it
5. **Test structure** - Group tests by route using nested `describe()` blocks

Example pattern from [seller.test.ts](src/apps/api/routes/tests/seller.test.ts):

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { fastifyInstance } from "../../server-config.js";

describe("Seller Routes", () => {
  beforeAll(async () => {
    await fastifyInstance.ready();
  });

  afterAll(async () => {
    await fastifyInstance.close();
  });

  describe("POST /sellers", () => {
    it("should create a new seller with valid data", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({
          name: "Test Seller",
          email: "test@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });

    it("should fail with invalid data", async () => {
      const response = await request(fastifyInstance.server)
        .post("/sellers")
        .send({ invalid: "data" });

      expect(response.status).toBe(400);
    });
  });
});
```

**Test Coverage Guidelines:**

- Test happy path (valid data)
- Test validation errors (missing fields, invalid formats, out-of-range values)
- Test business logic errors (duplicates, not found, unauthorized)
- Test edge cases (optional fields, boundary values)
- Use descriptive test names starting with "should"

## Error Handling

**Custom Error Classes** (`src/domain/use-cases/errors/`):

- `DefaultUseCaseError` (`_default.ts`) - Base class for all domain errors
- `EntityAlreadyExist` - Duplicate creation attempts → HTTP 409 Conflict
- `EntityNotFound` - Entity not found in database → HTTP 404 Not Found
- `InvalidCreantionData` - Invalid creation data (business logic validation fails) → HTTP 400 Bad Request
- `InvalidCredentials` - Auth failures → HTTP 401 Unauthorized

**Creating New Error Types:**

```typescript
import { DefaultUseCaseError } from "./_default.js";

export class CustomError extends DefaultUseCaseError {
  constructor() {
    super("Custom error message");
  }
}
```

**Global Error Handler** (`src/apps/api/handlers/errors.ts`):

The global error handler automatically converts domain errors to HTTP responses:

- `ZodError` → 400 with validation details
- `EntityNotFound` → 404
- `EntityAlreadyExist` → 409
- `InvalidCredentials` → 401
- `InvalidCreantionData` → 400

**CRITICAL:** When adding new error types, update the error handler to map them to appropriate HTTP status codes.

Always throw from use-cases; routes catch and convert to HTTP responses.
