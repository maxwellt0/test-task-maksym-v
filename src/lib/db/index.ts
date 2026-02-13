import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';
import type { Database } from './types';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

let url: URL;
try {
  url = new URL(env.DATABASE_URL);
} catch {
  throw new Error(`Invalid DATABASE_URL format: ${env.DATABASE_URL}. Expected format: mysql://user:password@host:port/database`);
}

const pool = createPool({
  host: url.hostname || 'localhost',
  port: url.port ? parseInt(url.port) : 3306,
  user: url.username || 'root',
  password: url.password ? decodeURIComponent(url.password) : undefined,
  database: url.pathname.substring(1) || 'accelerator',
  connectionLimit: 10,
  connectTimeout: 5000,
  waitForConnections: true,
  queueLimit: 0
});

const dialect = new MysqlDialect({
  pool
});

export const db = new Kysely<Database>({
  dialect,
});
