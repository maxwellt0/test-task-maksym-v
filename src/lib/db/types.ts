import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  programs: ProgramTable;
  applications: ApplicationTable;
}

export interface ProgramTable {
  id: Generated<number>;
  name: string;
  isActive: number; // 0 or 1 for MySQL boolean
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type ApplicationStatus = 'new' | 'reviewed' | 'accepted' | 'rejected';

export interface ApplicationTable {
  id: Generated<number>;
  programId: number;
  founderName: string;
  email: string;
  startupName: string;
  status: ApplicationStatus;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Program = Selectable<ProgramTable>;
export type NewProgram = Insertable<ProgramTable>;
export type ProgramUpdate = Updateable<ProgramTable>;

export type Application = Selectable<ApplicationTable>;
export type NewApplication = Insertable<ApplicationTable>;
export type ApplicationUpdate = Updateable<ApplicationTable>;
