import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedObject } from 'vitest';
import { getPrograms, getApplications, getApplicationById, updateApplicationStatus, getProgramById } from './db';
import { db } from '$lib/db';

interface QueryBuilderMock {
  selectAll: () => QueryBuilderMock;
  orderBy: (column: string, direction: 'asc' | 'desc') => QueryBuilderMock;
  where: (column: string, operator: string, value: number | string) => QueryBuilderMock;
  set: (values: Record<string, unknown>) => QueryBuilderMock;
  execute: () => Promise<unknown[]>;
  executeTakeFirst: () => Promise<unknown>;
}

const dbMock = db as unknown as MockedObject<typeof db> & { __queryBuilderMock: MockedObject<QueryBuilderMock> };

vi.mock('$lib/db', () => {
  const queryBuilderMock = {
    selectAll: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    execute: vi.fn(),
    executeTakeFirst: vi.fn(),
  };

  return {
    db: {
      selectFrom: vi.fn().mockReturnValue(queryBuilderMock),
      updateTable: vi.fn().mockReturnValue(queryBuilderMock),
      // Add it here so it's accessible on the imported db object
      __queryBuilderMock: queryBuilderMock,
    },
  };
});

describe('db service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const qbm = dbMock.__queryBuilderMock;
    qbm.selectAll.mockReturnThis();
    qbm.orderBy.mockReturnThis();
    qbm.where.mockReturnThis();
    qbm.set.mockReturnThis();
  });

  describe('getPrograms', () => {
    it('should fetch all programs ordered by name', async () => {
    const mockPrograms = [{ id: 1, name: 'Program A' }, { id: 2, name: 'Program B' }];
    const qbm = dbMock.__queryBuilderMock;
    qbm.execute.mockResolvedValue(mockPrograms);

      const result = await getPrograms();

      expect(db.selectFrom).toHaveBeenCalledWith('programs');
      expect(qbm.selectAll).toHaveBeenCalled();
      expect(qbm.orderBy).toHaveBeenCalledWith('name', 'asc');
      expect(result).toEqual(mockPrograms);
    });
  });

  describe('getApplications', () => {
    it('should fetch all applications when no programId is provided', async () => {
      const mockApps = [{ id: 1, startupName: 'Startup 1' }];
      const qbm = dbMock.__queryBuilderMock;
      qbm.execute.mockResolvedValue(mockApps);

      const result = await getApplications();

      expect(db.selectFrom).toHaveBeenCalledWith('applications');
      expect(qbm.where).not.toHaveBeenCalled();
      expect(qbm.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(result).toEqual(mockApps);
    });

    it('should fetch applications for a specific programId', async () => {
      const mockApps = [{ id: 1, programId: 10, startupName: 'Startup 1' }];
      const qbm = dbMock.__queryBuilderMock;
      qbm.execute.mockResolvedValue(mockApps);

      const result = await getApplications(10);

      expect(db.selectFrom).toHaveBeenCalledWith('applications');
      expect(qbm.where).toHaveBeenCalledWith('programId', '=', 10);
      expect(result).toEqual(mockApps);
    });
  });

  describe('getApplicationById', () => {
    it('should fetch a single application by id', async () => {
      const mockApp = { id: 1, startupName: 'Startup 1' };
      const qbm = dbMock.__queryBuilderMock;
      qbm.executeTakeFirst.mockResolvedValue(mockApp);

      const result = await getApplicationById(1);

      expect(db.selectFrom).toHaveBeenCalledWith('applications');
      expect(qbm.where).toHaveBeenCalledWith('id', '=', 1);
      expect(result).toEqual(mockApp);
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update the status of an application', async () => {
      const qbm = dbMock.__queryBuilderMock;
      qbm.executeTakeFirst.mockResolvedValue({ numUpdatedRows: 1 });

      await updateApplicationStatus(1, 'accepted');

      expect(db.updateTable).toHaveBeenCalledWith('applications');
      expect(qbm.set).toHaveBeenCalledWith({ status: 'accepted' });
      expect(qbm.where).toHaveBeenCalledWith('id', '=', 1);
    });
  });

  describe('getProgramById', () => {
    it('should fetch a single program by id', async () => {
      const mockProgram = { id: 1, name: 'Program A' };
      const qbm = dbMock.__queryBuilderMock;
      qbm.executeTakeFirst.mockResolvedValue(mockProgram);

      const result = await getProgramById(1);

      expect(db.selectFrom).toHaveBeenCalledWith('programs');
      expect(qbm.where).toHaveBeenCalledWith('id', '=', 1);
      expect(result).toEqual(mockProgram);
    });
  });
});
