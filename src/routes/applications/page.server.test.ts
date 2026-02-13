import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { load } from './+page.server';
import { getPrograms, getApplications } from '$lib/server/services/db';
import type { Program, Application } from '$lib/db/types';

vi.mock('$lib/server/services/db', () => ({
  getPrograms: vi.fn(),
  getApplications: vi.fn(),
}));

vi.mock('@sveltejs/kit', () => ({
  error: vi.fn((status, message) => ({ status, message })),
}));

const mockGetPrograms = getPrograms as MockedFunction<typeof getPrograms>;
const mockGetApplications = getApplications as MockedFunction<typeof getApplications>;

describe('Applications List Page Server Load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should auto-select the first active program if no programId is provided', async () => {
    const mockPrograms = [
      { id: 1, name: 'Program 1', isActive: 0, createdAt: new Date() },
      { id: 2, name: 'Program 2', isActive: 1, createdAt: new Date() },
      { id: 3, name: 'Program 3', isActive: 1, createdAt: new Date() },
    ] as Program[];
    const mockApps = [{ id: 101, startupName: 'Startup A', programId: 2, founderName: 'F', email: 'e', status: 'new', createdAt: new Date() }] as Application[];

    mockGetPrograms.mockResolvedValue(mockPrograms);
    mockGetApplications.mockResolvedValue(mockApps);

    const url = new URL('http://localhost/applications');
    const result = await load({ url } as any);

    expect(mockGetPrograms).toHaveBeenCalled();
    expect(mockGetApplications).toHaveBeenCalledWith(2); // First active program is id 2
    expect(result).toEqual({
      programs: mockPrograms,
      applications: mockApps,
      selectedProgramId: 2,
    });
  });

  it('should use provided programId from search params', async () => {
    const mockPrograms = [
      { id: 1, name: 'Program 1', isActive: 1, createdAt: new Date() },
      { id: 2, name: 'Program 2', isActive: 1, createdAt: new Date() },
    ] as Program[];
    const mockApps = [{ id: 102, startupName: 'Startup B', programId: 2, founderName: 'F', email: 'e', status: 'new', createdAt: new Date() }] as Application[];

    mockGetPrograms.mockResolvedValue(mockPrograms);
    mockGetApplications.mockResolvedValue(mockApps);

    const url = new URL('http://localhost/applications?programId=2');
    const result = await load({ url } as any);

    expect(mockGetApplications).toHaveBeenCalledWith(2);
    if (result && 'selectedProgramId' in result) {
      expect(result.selectedProgramId).toBe(2);
    } else {
      throw new Error('selectedProgramId missing in result');
    }
  });

  it('should return error if provided programId is not found', async () => {
    const mockPrograms = [
      { id: 1, name: 'Program 1', isActive: 1, createdAt: new Date() },
    ] as Program[];

    mockGetPrograms.mockResolvedValue(mockPrograms);

    const url = new URL('http://localhost/applications?programId=999');
    const result = await load({ url } as any);
    
    expect(result).toEqual({
      programs: mockPrograms,
      applications: [],
      selectedProgramId: undefined,
      error: 'The requested program could not be found.',
    });
  });

  it('should return error if provided programId is not a number', async () => {
    const mockPrograms = [
      { id: 1, name: 'Program 1', isActive: 1, createdAt: new Date() },
    ] as Program[];

    mockGetPrograms.mockResolvedValue(mockPrograms);

    const url = new URL('http://localhost/applications?programId=abc');
    const result = await load({ url } as any);
    
    expect(result).toEqual({
      programs: mockPrograms,
      applications: [],
      selectedProgramId: undefined,
      error: 'The requested program could not be found.',
    });
  });

  it('should fallback to the first program if none are active and no programId is provided', async () => {
    const mockPrograms = [
      { id: 5, name: 'Program 5', isActive: 0, createdAt: new Date() },
      { id: 6, name: 'Program 6', isActive: 0, createdAt: new Date() },
    ] as Program[];
    
    mockGetPrograms.mockResolvedValue(mockPrograms);
    mockGetApplications.mockResolvedValue([]);

    const url = new URL('http://localhost/applications');
    const result = await load({ url } as any);

    expect(mockGetApplications).toHaveBeenCalledWith(5);
    if (result && 'selectedProgramId' in result) {
      expect(result.selectedProgramId).toBe(5);
    } else {
      throw new Error('selectedProgramId missing in result');
    }
  });

  it('should return empty applications if no programs exist', async () => {
    mockGetPrograms.mockResolvedValue([]);
    
    const url = new URL('http://localhost/applications');
    const result = await load({ url } as any);

    expect(mockGetApplications).not.toHaveBeenCalled();
    expect(result).toEqual({
      programs: [],
      applications: [],
      selectedProgramId: undefined,
    });
  });

  it('should throw 500 if database error occurs', async () => {
    mockGetPrograms.mockRejectedValue(new Error('DB connection failed'));

    const url = new URL('http://localhost/applications');
    
    await expect(load({ url } as any)).rejects.toEqual({
      status: 500,
      message: { message: 'Database connection failed. Please check if the database is running and the DATABASE_URL is correct.' },
    });
  });
});
