# AGENTS.md

## Monorepo Layout

| Package | Scope | Framework | Port |
|---------|-------|-----------|------|
| `aqa-backend-nestjs/` | `@aqa/backend` | NestJS + GraphQL (code-first) | 8000 |
| `aqa-client/` | `@aqa/client` | Next.js 14 (App Router) | 3000 |
| `aqa-crawl-data/` | `@aqa/crawl-data` | Node.js scripts (JS, not TS) | — |
| `aqa-llm/` | `@aqa/llm` | Node.js (JS, not TS) | — |

**`aqa-llm` and `aqa-crawl-data` are git submodules.** If they appear empty after cloning, run `git submodule update --init --recursive`.

## Commands

### Monorepo (from root)
```bash
pnpm install                    # Install all deps
pnpm turbo dev                  # Start all dev servers
pnpm turbo build                # Build all packages
pnpm turbo lint                 # Lint all packages
pnpm turbo test                 # Run all tests
```

CI pipeline order: **lint → test → build**.

### Backend (`cd aqa-backend-nestjs`)
```bash
pnpm dev                        # `nest start --watch` (hot reload)
pnpm build                      # `nest build`
pnpm start                      # `node dist/main` (production)
pnpm test                       # Jest (testRegex: *.spec.ts, rootDir: src/)
pnpm test:e2e                   # Jest with test/jest-e2e.json config
```

### Frontend (`cd aqa-client`)
```bash
pnpm dev                        # `next dev`
pnpm build                      # `next build`
pnpm lint                       # `next lint`
pnpm codegen                    # graphql-codegen --watch (needs BACKEND_URL or running backend)
```

**Codegen requires `BACKEND_URL` env var** (or a running backend) to fetch the GraphQL schema. Running `pnpm codegen` starts in watch mode. To run once, use `npx graphql-codegen --config codegen.ts`.

### Crawler (`cd aqa-crawl-data`)
```bash
pnpm crawl                      # node index.js
pnpm crawl-all                  # node crawl-all.js
pnpm aggregate                  # node aggregate-points.js -- aggregate point scores
pnpm transfer                   # node transfer-data-configurable.js --transfer
pnpm test-db                    # node test-connections.js -- verify DB connections
```
Many more scripts exist in `package.json` (crawl-lecturer, copy-staff-survey, split-lecturers, etc.).

### LLM (`cd aqa-llm`)
```bash
pnpm start                      # node index.js
pnpm get-dataset                # Fetch fine-tuning dataset
pnpm convert-dataset            # Convert dataset format
```
No real tests exist — `pnpm test` just prints an error.

## Single-Package / Single-Test Shortcuts

```bash
# Run a single backend test
pnpm turbo test --filter=@aqa/backend -- --testPathPattern=<pattern>

# Run a single frontend test (if any exist)
pnpm turbo test --filter=@aqa/client -- --testPathPattern=<pattern>

# Or just cd into the package:
cd aqa-backend-nestjs && pnpm test -- --testPathPattern=user.service
```

## Architecture & Key Details

### Backend (NestJS)
- **GraphQL code-first**: Schema is auto-generated at `aqa-backend-nestjs/schema.gql` from decorators. Do not hand-edit.
- Modules are **flat under `src/`** (e.g. `src/auth/`, `src/user/`), NOT in `src/modules/`.
- Shared code lives in `src/common/` (args, dto, logger, scalars, services, types, utils).
- Migrations use `src/data-source.ts` (TypeORM DataSource), NOT `ormconfig.json`. The `pnpm typeorm` script references the old ormconfig path which may not work — prefer using `src/data-source.ts` directly.
- TypeORM `synchronize: false` in production — always generate and run migrations explicitly.
- PostgreSQL extensions required: `uuid-ossp`, `unaccent`, `pg_trgm`, `btree_gin`.
- Redis is used for caching (defined in `docker-compose.yml`).

### Frontend (Next.js)
- **App Router** (`src/app/`), not Pages Router.
- Auth uses **NextAuth.js v5 beta** (next-auth@5.0.0-beta.20).
- Path aliases (in `tsconfig.json`): `@/*` → `./src/*`, `@components/*`, `@contexts/*`, `@assets/*`.
- `.graphql` files live in `src/api/graphql/`, **not** `src/graphql/`.
- Codegen output goes to `src/gql/graphql.ts`.
- Zustand stores are in `src/stores/`.
- Server actions are in `src/server-actions/`.

### Crawler
- Written in plain JavaScript (no TypeScript, no Jest).
- Connects directly to PostgreSQL via `pg` (not through the backend API).
- The sentiment-analysis subdirectory has its own Dockerfile and runs as a separate service (`absa-service` on port 8001).

## Formatting — Packages Differ

| Setting | Backend | Frontend |
|---------|---------|----------|
| Quotes | Single | **Double** |
| Indent | 2 spaces | **Tabs, width 4** |
| Semicolons | Default (yes) | Yes |
| Print width | 80 | 85 |
| Trailing commas | All | ES5 |

The existing AGENTS.md incorrectly stated frontend uses single quotes — it uses **double quotes** (see `.prettierrc`).

## TypeScript Strictness

Backend `tsconfig.json`: `strictNullChecks: false`, `noImplicitAny: false`. The codebase intentionally allows nullables and implicit `any`.

## Environment Variables

Root `.env` is required. Copy `.env.example` and fill in values:
- `DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` — PostgreSQL connection
- `NEXT_PUBLIC_API_URL_V2` — Client-facing GraphQL URL (injected at build time)
- `BACKEND_URL` / `BACKEND_API_URL` — Server-side backend URLs
- `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` — Google OAuth
- `JWT_SECRET` — Token signing

These three (`BACKEND_URL`, `BACKEND_API_URL`, `NEXT_PUBLIC_API_URL_V2`) are declared in `turbo.json` `globalEnv` and affect cache invalidation.

## Deployment

- Push to `main` → CI (lint/test/build) → if passing, Docker Hub push → SSH deploy via VPN.
- Push to `dev` → CI only (no deploy).
- Docker Compose builds from **monorepo root** context (Dockerfiles are inside each package directory).
- Backend container uses `network_mode: "host"`. Frontend container maps port 3000.
- The `absa-service` (sentiment analysis) is a separate container built from `aqa-crawl-data/src/sentiment-analysis/Dockerfile`.

## Gotchas

- Frontend codegen runs in **watch mode** by default (`--watch` flag). For one-shot generation, run `npx graphql-codegen --config codegen.ts`.
- The `pnpm typeorm` script references `ormconfig.json` which doesn't exist. Use `data-source.ts` for TypeORM CLI tasks.
- `aqa-llm` and `aqa-crawl-data` are git submodules — clone with `--recurse-submodules` or init after cloning.
- Backend port is 8000 (hardcoded in `main.ts`), not 3000.