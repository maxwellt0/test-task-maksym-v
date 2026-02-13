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
- SvelteKit using Svelte 5 syntax
- TypeScript end-to-end
- SQL database: prefer MySQL (allowed: SQLite/Postgres if easier)
- ORM/query builder: Kysely (required)
- Migrations + seeds required
- UI/styling: Tailwind + shadcn-svelte preferred; any UI is acceptable if clean and consistent
- Docker: Required for the setup (MySQL 8.0 and Application containerization)

Do not add heavy frameworks unless necessary.

---

## 2) Data Model (Minimum)
Entities:
- Program: `id`, `name`, `isActive`, timestamps (optional)
- Application: `id`, `programId`, `founderName`, `email`, `startupName`, `createdAt`, `status`
    - status enum: `"new" | "reviewed" | "accepted" | "rejected"`

Rules:
- Every Application belongs to a Program (`programId` FK).
- `createdAt` set on insert.
- Indexes:
    - `applications(programId)`
    - `applications(status)` (optional)

---

## 3) Database Setup Rules
### 3.1 Docker & Database
- Provide a `docker-compose.yml` for MySQL and the App.
- Use Docker for the standard local environment.
- Provide a `Dockerfile` for the application.

### 3.2 Migrations
- Use a migration tool that works well with Kysely (e.g., `kysely` migrator or a lightweight migration runner).
- Keep migrations in `./db/migrations`.
- Each migration must be reversible if supported.

### 3.2 Seeds
- Seeds live in `./db/seeds`.
- Seed:
    - 2–4 programs (at least one active)
    - 15–30 applications distributed across programs with mixed statuses
- Provide a single command to run seeds.

---

## 4) App Architecture (Preferred Shape)
### 4.1 Foldering
- `src/lib/db/` for DB connection + Kysely types
- `src/lib/server/` for server-only modules (queries, services)
- `src/routes/applications/` for the page and server endpoints

### 4.2 DB Access Pattern
- All SQL goes through Kysely.
- Define a typed `Database` interface (Kysely typing) and generate/maintain types manually.
- No raw SQL strings unless absolutely needed.

### 4.3 Server vs Client
- DB calls must run server-side only.
- UI uses:
    - `+page.server.ts` to load programs + applications
    - form actions OR `+server.ts` endpoints for mutations (status updates)
- Avoid putting secrets in client.

---

## 5) Routing Requirements
### 5.1 `/applications`
- Contains a `<select>` for programs (all programs).
- After selecting a program, show applications for it.
- Must support deep-linking via query param:
    - `/applications?programId=<id>`
- If no program selected:
    - either auto-select the first active program
    - or show “Select a program” state

### 5.2 Shareable application link
- Provide a route:
    - `/applications/<applicationId>`
    - Shows details + status + ability to update status
- Or an alternative:
    - `/applications?programId=...&applicationId=...` (less preferred)
- Keep links stable and bookmarkable.

---

## 6) UI Requirements
- Clean, minimal layout.
- List view shows:
    - founderName, startupName, email (optional), createdAt, status
    - a “View” link to the sharable page
    - status change control (select/buttons)
- Status updates should:
    - reflect immediately (optimistic optional)
    - show success/error feedback
- Basic empty/loading states:
    - no applications for program
    - invalid programId/applicationId

---

## 7) Validation & Error Handling
- Validate inputs on the server:
    - programId exists when used
    - applicationId exists
    - status is one of allowed enum values
- On errors:
    - return proper HTTP codes from endpoints
    - show a small user-friendly message in UI

---

## 8) Quality Bar (Definition of Done)
Before considering complete:
- App runs locally from README steps
- Migrations apply cleanly on a fresh DB
- Seeds populate usable data
- `/applications` works end-to-end
- Shareable link route works end-to-end
- Status updates persist to DB
- No TypeScript errors
- No secrets committed (use `.env.example`)

---

## 9) README Requirements
README must include:
1) How to run locally (Docker, install, env, migrate, seed, dev server)
2) Architectural choices (why this structure, where DB logic lives)
3) What can be improved (auth, pagination, filters, audit log, etc.)

---

## 10) Junie Instructions (How to Work on This Repo)
When implementing:
1) Propose a short plan (bullets) before changing many files.
2) Make changes in small steps.
3) After each step:
    - show what changed (files)
    - note how to verify (commands)
4) Prefer minimal dependencies.