# Project Guidelines — Startup Accelerator Admin Tool

## 0) Objective
Build a minimal internal admin tool to review founder applications for acceleration programs.

Must-have user flows:
- Admin opens `/applications`
- Selects a Program from a dropdown
- Sees Applications for that program
- Can open an application (details) and change status
- Each application has a shareable link

No auth/users required.

---

## 1) Tech & Constraints (Hard Requirements)
- SvelteKit using Svelte 5 syntax (Runes: `$state`, `$derived`, `$props`, `$effect`)
- TypeScript end-to-end (Strict mode, avoid `any`)
- SQL database: MySQL 8.0
- ORM/query builder: Kysely (required)
- Migrations + seeds required
- UI/styling: Tailwind 4 + shadcn-svelte principles (centralized `cn` utility, variants)
- Docker: Required for the setup (MySQL 8.0 and Application containerization)
- Testing: Vitest for unit/integration tests

Do not add heavy frameworks unless necessary.

---

## 2) Data Model (Minimum)
Entities:
- Program: `id`, `name`, `isActive` (int 0/1 for MySQL), `createdAt`
- Application: `id`, `programId`, `founderName`, `email`, `startupName`, `createdAt`, `status`
    - status enum: `"new" | "reviewed" | "accepted" | "rejected"`

Rules:
- Every Application belongs to a Program (`programId` FK).
- `createdAt` set on insert via `sql`CURRENT_TIMESTAMP``.
- Indexes:
    - `applications(programId)`
    - `applications(status)`

---

## 3) Database Setup Rules
### 3.1 Docker & Database
- Provide a `docker-compose.yml` for MySQL and the App.
- Use Docker for the standard local environment.
- Provide a `Dockerfile` for the application.
- DB Resilience: Handle `DATABASE_URL` parsing errors gracefully and provide helpful fallbacks or error messages.

### 3.2 Migrations
- Use a migration tool that works well with Kysely (e.g., `kysely` migrator).
- Keep migrations in `./db/migrations`.
- Use `tsx` to run migrations directly in development.

### 3.3 Seeds
- Seeds live in `./db/seeds`.
- Seed:
    - 2–4 programs (at least one active)
    - 15–30 applications distributed across programs with mixed statuses
- Provide a single command to run seeds (`npm run db:seed`).

---

## 4) App Architecture (Preferred Shape)
### 4.1 Foldering
- `src/lib/db/` for DB connection + Kysely types
- `src/lib/server/` for server-only modules (queries, services)
- `src/lib/components/ui/` for reusable shadcn-style components
- `src/routes/` for the pages and server endpoints

### 4.2 DB Access Pattern
- All SQL goes through Kysely via a Service Layer (`src/lib/server/services/db.ts`).
- Define a typed `Database` interface (Kysely typing).
- No raw SQL strings unless absolutely needed.
- Verify mutation results (e.g., check `numUpdatedRows` for updates).

### 4.3 Server vs Client
- DB calls must run server-side only.
- UI uses:
    - `+page.server.ts` to load data
    - form actions (`use:enhance`) for mutations
- Re-throw SvelteKit errors (`error`, `redirect`) in catch blocks.

---

## 5) Routing Requirements
### 5.1 `/applications`
- Contains a `<select>` for programs.
- Supports deep-linking via query param: `?programId=<id>`.
- Auto-selection logic:
    1. Prefer `programId` from URL.
    2. Fallback to first **active** program.
    3. Fallback to first program if none are active.
- Validate `programId` on server and throw 400 if invalid.

### 5.2 Shareable application link
- Route: `/applications/<applicationId>`.
- Keep links stable and bookmarkable.
- Provide a "Share Link" button with clipboard feedback.

---

## 6) UI & Design Requirements
- **Theme**: Clean, minimal layout using Tailwind 4 with a modern blue-to-purple gradient background (`bg-linear-to-br from-blue-500 to-purple-600`) on the root layout.
- **Glassmorphism**: Use translucent white backgrounds (`bg-white/95`) and backdrops (`backdrop-blur-md`) for primary content containers to create a modern dashboard feel.
- **Consistent Feedback**:
    - **Mandatory**: Use `cursor-pointer` for all interactive elements: buttons, links, and `<select>` elements.
    - Use `cursor-default` for informational labels, badges, and static text.
- **Iconography**: Integrate `lucide-svelte` icons consistently for visual anchors (e.g., `Rocket` for startups, `User` for founders).
- **Interactivity**: 
    - Use `use:enhance` for all form submissions.
    - Provide immediate visual feedback for actions (e.g., "Copied!" for clipboard actions).
    - Implement subtle hover states (e.g., `hover:bg-indigo-50/30`) for list items to improve scannability.
- **Responsive Design**: Ensure layouts are optimized for both desktop (e.g., two-column detail views) and mobile (e.g., icon-only buttons on small screens).
- **Status Badges**: Use color-coded badges with borders for application statuses:
    - New: Blue
    - Reviewed: Yellow
    - Accepted: Green
    - Rejected: Red

---

## 7) Validation & Error Handling
- Validate all inputs on the server (IDs, status enums, query params).
- Return proper HTTP codes (400, 404, 500) using SvelteKit's `error` or `fail`.
- Zero-Error Policy: Maintain 0 linting and TypeScript errors. Avoid `any` except in test files and shared UI component prop definitions where necessary (configured in `eslint.config.js`).

---

## 8) Testing Standards
- Test files should be named `*.test.ts`.
- **CRITICAL**: Do NOT name test files with a `+` prefix in `src/routes` (e.g., use `page.server.test.ts`, NOT `+page.server.test.ts`) as SvelteKit reserves the `+` prefix for routing files.
- Mock database services using `vi.mock` to isolate route logic.
- Ensure strict typing in tests (use `ServerLoadEvent`, `RequestEvent`).

---

## 9) Quality Bar (Definition of Done)
Before considering complete:
- App runs locally from README steps.
- Migrations apply cleanly on a fresh DB.
- Seeds populate usable data.
- `/applications` works end-to-end with validation.
- Shareable link route works end-to-end.
- Status updates persist to DB and verify impact.
- **Zero linting/TypeScript errors**.
- All tests pass (`npm test`).
- No secrets committed.

---

## 10) README Requirements
README must include:
1) How to run locally (Docker, install, env, migrate, seed, dev server).
2) Architectural choices (Svelte 5, Kysely, Service Layer, etc.).
3) Future roadmap (Auth, E2E tests, CI/CD).

---

## 11) Junie Instructions (How to Work on This Repo)
When implementing:
1) Propose a short plan (bullets) before changing many files.
2) Make changes in small steps.
3) Use `update_status` to keep track of progress.
4) Verify changes with `npm run lint`, `npm test`, and `npm run build`.
5) Prefer minimal dependencies.