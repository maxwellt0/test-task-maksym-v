import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';
import type { Database } from './types';
import { env } from '$env/dynamic/private';

const url = new URL(env.DATABASE_URL);
const pool = createPool({
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.substring(1),
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
