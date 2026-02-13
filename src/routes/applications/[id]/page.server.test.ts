import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { load, actions } from './+page.server';
import { getApplicationById, getProgramById, updateApplicationStatus } from '$lib/server/services/db';
import type { RequestEvent } from '@sveltejs/kit';
import type { Application, Program } from '$lib/db/types';

const mockGetApplicationById = getApplicationById as MockedFunction<typeof getApplicationById>;
const mockGetProgramById = getProgramById as MockedFunction<typeof getProgramById>;
const mockUpdateApplicationStatus = updateApplicationStatus as MockedFunction<typeof updateApplicationStatus>;

type UpdateStatusAction = (event: RequestEvent) => Promise<{ success: boolean } | unknown>;
const updateStatusAction = actions.updateStatus as UpdateStatusAction;

vi.mock('$lib/server/services/db', () => ({
  getApplicationById: vi.fn(),
  getProgramById: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

vi.mock('@sveltejs/kit', () => ({
  error: vi.fn((status, message) => ({ status, message })),
  fail: vi.fn((status, data) => ({ status, data })),
}));

describe('Application Detail Page Server Load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw 400 if ID is invalid', async () => {
    const params = { id: 'abc' };
    await expect(load({ params } as unknown as Parameters<typeof load>[0])).rejects.toEqual({ status: 400, message: 'Invalid ID' });
  });

  it('should throw 404 if application is not found', async () => {
    const params = { id: '1' };
    mockGetApplicationById.mockResolvedValue(undefined);

    await expect(load({ params } as unknown as Parameters<typeof load>[0])).rejects.toEqual({ status: 404, message: 'Application not found' });
  });

  it('should return application and program if found', async () => {
    const params = { id: '1' };
    const mockApp = { id: 1, programId: 10, startupName: 'Startup 1' } as Application;
    const mockProgram = { id: 10, name: 'Program 10' } as Program;

    mockGetApplicationById.mockResolvedValue(mockApp);
    mockGetProgramById.mockResolvedValue(mockProgram);

    const result = await load({ params } as unknown as Parameters<typeof load>[0]);

    expect(result).toEqual({
      application: mockApp,
      program: mockProgram,
    });
  });

  it('should throw 500 if database error occurs', async () => {
    const params = { id: '1' };
    mockGetApplicationById.mockRejectedValue(new Error('DB Error'));

    // We expect it to throw the result of error(500, ...)
    await expect(load({ params } as unknown as Parameters<typeof load>[0])).rejects.toEqual({
      status: 500,
      message: { message: 'Database connection failed.' },
    });
  });
});

describe('Application Detail Page Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if ID is invalid', async () => {
    const params = { id: 'abc' };
    const request = {} as Request;
    
    const result = await updateStatusAction({ request, params } as RequestEvent);
    
    expect(result).toEqual({ status: 400, data: { message: 'Invalid ID' } });
  });

  it('should fail if status is invalid', async () => {
    const params = { id: '1' };
    const formData = new FormData();
    formData.append('status', 'invalid-status');
    const request = {
      formData: async () => formData
    } as Request;

    const result = await updateStatusAction({ request, params } as RequestEvent);

    expect(result).toEqual({ status: 400, data: { message: 'Invalid status' } });
  });

  it('should update status and return success if valid', async () => {
    const params = { id: '1' };
    const formData = new FormData();
    formData.append('status', 'accepted');
    const request = {
      formData: async () => formData
    } as Request;

    mockUpdateApplicationStatus.mockResolvedValue({ numUpdatedRows: 1n, numChangedRows: 1n });

    const result = await updateStatusAction({ request, params } as RequestEvent);

    expect(updateApplicationStatus).toHaveBeenCalledWith(1, 'accepted');
    expect(result).toEqual({ success: true });
  });
});
