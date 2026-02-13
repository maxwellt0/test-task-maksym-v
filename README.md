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

Note: While the project includes a Docker setup for MySQL, it can also connect to any external MySQL instance by providing the appropriate `DATABASE_URL`.

---

## Architectural Choices

- **SvelteKit 5**: Used the latest Svelte 5 syntax with runes (`$props`, `$state`, etc.) for reactive state management.
- **shadcn-svelte Integration**: Implemented Svelte 5-native components (like `Button`) following shadcn principles, using `tailwind-variants` and a centralized `cn` utility for consistent styling.
- **Kysely**: Used as the type-safe SQL query builder. It provides excellent TypeScript integration and prevents common SQL errors.
- **Service Layer**: Database logic is encapsulated in `src/lib/server/services/db.ts` to keep route handlers clean and reusable.
- **Server-Side Rendering (SSR)**: All data fetching and mutations happen on the server to ensure security and performance.
- **Tailwind CSS**: Used for styling to provide a clean, responsive, and maintainable UI without heavy external CSS frameworks.
- **Custom Migration Runner**: A lightweight script using Kysely's built-in migrator for easy database versioning.

## Future Improvements

### Functional
- **Authentication & Authorization**: Implement a secure admin login system (e.g., Auth.js) with Role-Based Access Control (RBAC).
- **Advanced Filtering**: Enhance the application list with multi-criteria filtering (status, date range, startup category) and full-text search.
- **Bulk Actions**: Allow admins to update the status of multiple applications simultaneously.
- **Application History**: Maintain a full audit trail of all changes made to an application, including who made the change and when.
- **Automated Workflows**: Integrate email or Slack notifications for founders and admins when application statuses change (with a "silent" option for admins to disable notifications)
- **Admin Dashboard**: Provide high-level analytics and visualizations of application trends across different programs.

### Design & UX
- **Responsive Design**: Further optimize the UI for seamless use across mobile, tablet, and desktop devices.
- **Accessibility (a11y)**: Ensure full compliance with WCAG 2.1 standards for better inclusivity.
- **Enhanced UI/UX**: Implement more intuitive navigation, skeleton loaders for better perceived performance, and a more refined color palette with support for Dark Mode.

### System & Quality
- **Test Suite Expansion**:
    - **Unit Tests**: Maintain and expand the current test coverage for server-side logic (already initiated).
    - **End-to-End (E2E) Tests**: Implement Playwright tests for critical user flows.
- **CI/CD Pipeline**: Automate testing, linting, and deployment processes using GitHub Actions or GitLab CI.
- **Database Resilience**: Implement automated backups and point-in-time recovery (PITR).
- **Security Enhancements**: Add rate limiting, CSRF protection (native in SvelteKit), and regular dependency vulnerability scanning.
- **Observability**: Integrate centralized logging and performance monitoring (e.g., Sentry, New Relic) for proactive issue resolution.