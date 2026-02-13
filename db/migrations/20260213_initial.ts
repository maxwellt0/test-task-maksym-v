import { Kysely, sql } from 'kysely';
import type { Database } from '../../src/lib/db/types';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('programs')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('isActive', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await db.schema
    .createTable('applications')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('programId', 'integer', (col) =>
      col.references('programs.id').onDelete('cascade').notNull()
    )
    .addColumn('founderName', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('startupName', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('new'))
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await db.schema
    .createIndex('applications_program_id_index')
    .on('applications')
    .column('programId')
    .execute();

  await db.schema
    .createIndex('applications_status_index')
    .on('applications')
    .column('status')
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('applications').execute();
  await db.schema.dropTable('programs').execute();
}
