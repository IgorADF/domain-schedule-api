# Copilot Instructions

## Architecture Overview

This is a **Domain-Driven Design (DDD)** TypeScript/Fastify API for managing seller schedules and agendas. The project follows strict layering:

- **`src/domain/`** - Pure business logic (entities, use-cases, repository interfaces)
- **`src/core/`** - Infrastructure (database models, mappers, repositories, utilities)
- **`src/apps/api/`** - Fastify HTTP layer (routes, server config)

Critical pattern: **Repositories are transaction-aware**. All data access flows through `SequelizeUnitOfWork` which manages a single Sequelize transaction per request.

## Database & Migrations

Uses **Sequelize ORM** with TypeScript decorators. Key conventions:

- Migrations use `.cjs` extension: `src/core/database/migrations/TIMESTAMP-description.cjs`
- Models in `src/core/database/models/` match migrations exactly
- **Mappers** (`src/core/database/entities-mappers/`) convert between Sequelize models ↔ domain entities
- Seeders also use `.cjs`: `src/core/database/seeders/TIMESTAMP-description.cjs`

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

## Use-Case Pattern

All business logic lives in `src/domain/use-cases/`. Each class:
- Takes `IUnitOfWork` in constructor
- Validates input with Zod schema
- Accesses repositories through UoW
- Throws custom errors from `src/domain/use-cases/errors/`

Example: `CreateSellerUseCase` validates email uniqueness, formats data, persists via UoW.

## API Routes & Transaction Handling

Routes in `src/apps/api/routes/` are initialized with `SequelizeUnitOfWork`:
- Each route handler creates a new UoW instance
- Call `uow.beginTransaction()` before use-cases
- Call `uow.commitTransaction()` on success or `uow.rollbackTransaction()` on errors
- Use-cases access repositories via `uow.sellerRepository`, `uow.agendaPeriodsRepository`, etc.

Routes use **fastify-type-provider-zod** for automatic request validation from Zod schemas.

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
