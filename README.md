# Accelerator Admin Tool

## 🚀 Quick Demo (Full Docker Setup)

If you have Docker installed, you can get everything up and running with a single command:

1. **Start everything:**
   ```bash
   docker-compose up -d --build
   ```
2. **Seed the database:**
   ```bash
   docker-compose exec app npm run db:seed
   ```
3. **Open the app:**
   Open [http://localhost:3000/applications](http://localhost:3000/applications).

---

## Setup Options

### Option 1: Full Docker (Recommended for Demo)
Everything (App + DB) runs in Docker containers.

1. **Start containers:**
   ```bash
   docker-compose up -d --build
   ```
2. **Seed data:**
   ```bash
   docker-compose exec app npm run db:seed
   ```
3. **Access:** [http://localhost:3000/applications](http://localhost:3000/applications)

### Option 2: Hybrid (DB in Docker + App Local)
Best for development with hot-reloading.

1. **Start Database only:**
   ```bash
   docker-compose up -d db
   ```
2. **Setup environment:**
   ```bash
   cp .env.example .env
   ```
3. **Install & Migrate:**
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```
4. **Run Dev Server:**
   ```bash
   npm run dev
   ```
5. **Access:** [http://localhost:5173/applications](http://localhost:5173/applications)

---

A minimal internal admin tool to review founder applications for acceleration programs.

## Setup Instructions (Detailed)

### 1. Database Setup
Ensure Docker is running and start the MySQL container:
```bash
docker-compose up -d db
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`. The defaults are configured to work with the Docker setup (localhost).
```bash
cp .env.example .env
```

### 4. Database Migrations & Seeding
Once the Docker container is running, apply migrations and seed the database:

**Run Migrations:**
```bash
npm run db:migrate
```

**Seed Data:**
```bash
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/applications](http://localhost:5173/applications) in your browser.

---

## Docker Support
A `docker-compose.yml` is provided to spin up both the SvelteKit app and a MySQL 8.0 instance. 
- **App**: [http://localhost:3000](http://localhost:3000)
- **DB Name**: `accelerator`
- **DB User**: `root`
- **DB Password**: `password`
- **DB Port**: `3310` (Mapped from 3306 in container)

---

## Architectural Choices

- **SvelteKit 5**: Used the latest Svelte 5 syntax with runes (`$props`, `$state`, etc.) for reactive state management.
- **Kysely**: Used as the type-safe SQL query builder. It provides excellent TypeScript integration and prevents common SQL errors.
- **Service Layer**: Database logic is encapsulated in `src/lib/server/services/db.ts` to keep route handlers clean and reusable.
- **Server-Side Rendering (SSR)**: All data fetching and mutations happen on the server to ensure security and performance.
- **Tailwind CSS**: Used for styling to provide a clean, responsive, and maintainable UI without heavy external CSS frameworks.
- **Custom Migration Runner**: A lightweight script using Kysely's built-in migrator for easy database versioning.

## Future Improvements

- **Authentication**: Add an admin login system (e.g., Auth.js or simple session-based auth).
- **Pagination**: Implement pagination for applications to handle large datasets.
- **Filtering & Search**: Add more filters (e.g., by status) and a search bar for startup or founder names.
- **Audit Log**: Track who changed application statuses and when.
- **Email Notifications**: Automatically notify founders when their application status changes.
- **Dashboard**: Add a high-level overview with statistics on application statuses across programs.
