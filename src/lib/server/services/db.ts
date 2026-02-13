import { db } from '$lib/db';
import type { ApplicationStatus } from '$lib/db/types';

export async function getPrograms() {
  return await db
    .selectFrom('programs')
    .selectAll()
    .orderBy('name', 'asc')
    .execute();
}

export async function getApplications(programId?: number) {
  let query = db.selectFrom('applications').selectAll();

  if (programId) {
    query = query.where('programId', '=', programId);
  }

  return await query.orderBy('createdAt', 'desc').execute();
}

export async function getApplicationById(id: number) {
  return await db
    .selectFrom('applications')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus) {
  return await db
    .updateTable('applications')
    .set({ status })
    .where('id', '=', id)
    .executeTakeFirst();
}

export async function getProgramById(id: number) {
  return await db
    .selectFrom('programs')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
}
