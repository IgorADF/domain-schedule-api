# Copilot Instructions

## Critical Rules

- **Formatting:** Tabs, double quotes (Biome config in `biome.json`)
- **ESM:** Always use `.js` extension in imports, prefer `import type { ... }` for types
- **No `any` type** (Biome warns on `noExplicitAny`)
- **Path aliases** for cross-layer imports; relative imports only within same feature
- **Always create migrations** when changing database via `npm run db:migrate:dev`

## Architecture (DDD)

```
src/
├── @types/           # Shared types (Class, Optional)
├── domain/           # Entities, use-cases, repository interfaces, errors, value-objects
├── infra/            # Prisma, cache, queue, services, factories
└── apps/             # api (Fastify), queue (RabbitMQ), jobs (node-cron)
```

**Path Aliases:** `@/*`, `@domain/*`, `@infra/*`, `@api/*`, `@queue/*`

## Database (Prisma + PostgreSQL)

- Schema: `src/infra/database/prisma/schema.prisma`
- Generated: `src/infra/database/prisma/_generated/`
- Use `creationDate`/`updateDate` (not `createdAt`), `@db.Timestamp()`, `@db.Uuid`, `@@map("TableName")`

**Mappers** (`entities-mappers/`): `toModel()` and `toEntity()` - always parse with Zod in `toEntity()`.

## Use-Cases

Located in `src/domain/use-cases/`. Structure:

1. Input schema via `.pick()` from entity schema
2. Type via `z.infer<>`
3. Class with `execute()` method

**Helpers:** `createEntity<T>()` (adds id + timestamps), `updateEntity<T>()` (sets updateDate)

**Transactions:** `await this.uow.withTransaction(async () => { ... })`

## Repository Pattern

1. Interface in `src/domain/repositories/[name].interface.ts`
2. Implementation in `src/infra/database/prisma/repositories/[name].ts` extends `ClassRepository`
3. Add getter to `IUnitOfWork` and `PrismaUnitOfWork`

**Rules:** Arrays return `[]`, single queries return `null` if not found.

## API Routes

Located in `src/apps/api/routes/`. Pattern:

```typescript
export const initEntityRoutes: InitRoute = (dbClient, logger, tags) => {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/",
      {
        schema: {
          body: Schema,
          tags,
          response: { 200: ResponseSchema },
          security: [{ cookieAuth: [] }],
        },
        onRequest: [fastify.authenticate],
      },
      async (request) => {
        const { useCase } = createEntityFactory(dbClient);
        return {
          data: (
            await useCase.execute({
              ...request.body,
              sellerId: request.authSeller.id,
            })
          ).data,
        };
      },
    );
  };
};
```

**Rules:**

- Always use factories, never instantiate UoW/use-cases directly
- Response schemas in `@api/schemas/responses.ts`
- Protected routes: `onRequest: [fastify.authenticate]` + `security: [{ cookieAuth: [] }]`

## Factories

Located in `src/infra/use-cases-factories/`. Pattern:

```typescript
export const createEntityFactory: CreateFactoryFunction<CreateEntityUseCase> = (
  dbClient,
) => {
  const { uow } = createUowFactory(dbClient);
  return { uow, useCase: new CreateEntityUseCase(uow) };
};
```

## Errors

Extend `DefaultUseCaseError` in `src/domain/shared/errors/`:

- `EntityAlreadyExist` (409), `EntityNotFound` (404), `InvalidCredentials` (401)
- `InvalidCreationData`, `ScheduleTooSoon`, `ScheduleTooFarAhead`, `SendEmailError` (400)
- `SlotNotAvailable` (409)

Mapping in `src/apps/api/handlers/errors/use-cases-error-mapper.ts`.

## Message Queue

**Add handler:**

1. Add type to `MessageSchema.type` in `src/infra/queue/message.ts`
2. Create handler in `src/apps/queue/handlers/[name]-handler.ts`
3. Add case to `MainHandler` in `_main.ts`

## Services

Interface in `src/domain/services/`, implementation in `src/infra/services/` with `static create()`.

Available: `LogService`, `HashPasswordService`, `QueueService`, `EmailService`, `RedisCacheService`

## Tests (Vitest + Supertest)

Located in `src/apps/api/tests/`. Bootstrap:

```typescript
let server: Server;
beforeAll(async () => {
  server = (await runInitTestConfigs()).server;
});
afterAll(async () => {
  await runFinalTestConfigs();
});
```

**Helpers:** `createAndAuthTestSeller(server)`, `setSellerFullInitialTestData(server)`, `createDefaultTestAgendaConfig()`

**Rules:** Unique emails with `randomUUID()`, compute dates for scheduling tests.

## Commands

| Command                     | Description             |
| --------------------------- | ----------------------- |
| `npm run dev:server`        | API with tsx watch      |
| `npm run dev:queue`         | Queue consumer          |
| `npm run dev:jobs`          | Scheduled jobs          |
| `npm run db:generate`       | Generate Prisma client  |
| `npm run db:migrate:dev`    | Create/apply migrations |
| `npm run db:migrate:deploy` | Apply migrations (prod) |
| `npm run ts:check`          | TypeScript check        |
| `npm run server:tests`      | Run API tests           |
| `npm run organize:all`      | Biome check and fix     |
