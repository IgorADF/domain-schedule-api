# Doc

## TODO

### Business

- [x] Criar seller
- [x] Login
- [x] Logout
- [x] ResetPassword
- [x] Atualizar seller

- [X-] Cria agenda config
- [X-] Lista agenda config
- [x] List availables slots
- [x] Cria schedule
- [x] List schedules

- [x] Overwrite criar multiplos

### Tech

- Continuos:

  - Implemente tests to expire tokens (auth middlewere tests)
  - Create routines (jobs) to remove old test schemas

- Better route descriptions
- Fastify log to redis reconnection
- OTLP: https://www.youtube.com/watch?v=Wu0Ajkxh69Y
- Passar o redis como prop no init da api
- Add luxon to all project

---

Suggestion GPT 5

Here are concrete, “nice-to-create” refactors after actually scanning your real domain use-cases.

3. Date parsing should be centralized
   You have at least two patterns:

Local parsing inside the use-case: list-seller-schedules.ts
Delegating to another use-case helper: list-available-slots.ts (via generateSlotsUseCase.parseDateString)
Suggestion: move date-string parsing/validation into a shared value-object helper (or a small domain utility) so list use-cases don’t duplicate parsing logic differently.

4. Pagination helpers (already starting to repeat)
   Right now the canonical pagination shape appears in:

list-seller-agenda-events.ts
Suggestion: create a shared PaginationSchema (page, pageSize) + toPaginated(items,total,page,pageSize) so future list endpoints stay consistent (and you don’t re-encode max(100)/defaults each time).

5. “Group/sort schedules by date” could become a reusable formatter
   This logic is embedded in:

list-seller-schedules.ts
Suggestion: if you anticipate more schedule “views” (calendar, daily agenda, etc.), extracting the grouping/sorting into a pure function (domain-level) will make it reusable and testable without touching UoW.

6. Ordering type reuse
   You already have an explicit AgendaEventOrderBy in:

agenda-event.interface.ts
Suggestion: make a generic OrderBy<TField extends string> type in a shared place (domain shared types), then each repository just defines its allowed fields; keeps order-by consistent across repositories without duplicating "ASC" | "DESC" everywhere.

If you want, I can take one of these (transaction wrapper or seller agenda config resolver) and implement it across the affected use-cases in a minimal PR-style change.
