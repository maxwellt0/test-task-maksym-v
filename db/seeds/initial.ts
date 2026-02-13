import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';
import * as dotenv from 'dotenv';
import type { Database, ApplicationStatus } from '../../src/lib/db/types';

dotenv.config();

async function seed() {
  const db = new Kysely<Database>({
    dialect: new MysqlDialect({
      pool: createPool(process.env.DATABASE_URL!)
    }),
  });

  console.log('Seeding programs...');
  const programs = [
    { name: 'Winter 2026 Batch', isActive: 1 },
    { name: 'Summer 2026 Batch', isActive: 1 },
    { name: 'Legacy 2025 Batch', isActive: 0 },
  ];

  await db.insertInto('programs').values(programs).execute();
  
  const dbPrograms = await db.selectFrom('programs').selectAll().execute();
  
  console.log('Seeding applications...');
  const statuses: ApplicationStatus[] = ['new', 'reviewed', 'accepted', 'rejected'];
  const applications = [];

  for (let i = 1; i <= 25; i++) {
    const program = dbPrograms[Math.floor(Math.random() * dbPrograms.length)];
    applications.push({
      programId: program.id,
      founderName: `Founder ${i}`,
      email: `founder${i}@example.com`,
      startupName: `Startup ${i} Inc.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  await db.insertInto('applications').values(applications).execute();

  console.log('Seeding completed successfully!');
  await db.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
