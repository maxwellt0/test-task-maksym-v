import * as path from 'path';
import { createPool } from 'mysql2';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  MysqlDialect,
  FileMigrationProvider,
} from 'kysely';
import * as dotenv from 'dotenv';
import type { Database } from '../src/lib/db/types';

dotenv.config();

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new MysqlDialect({
      pool: createPool(process.env.DATABASE_URL!)
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be the path to the compiled migrations or the source if using ts-node
      migrationFolder: path.join(process.cwd(), 'db/migrations'),
    }),
  });

  const { error } = await migrator.migrateToLatest();

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
