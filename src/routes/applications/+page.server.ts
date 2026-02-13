import { error } from '@sveltejs/kit';
import { getPrograms, getApplications } from '$lib/server/services/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  try {
    const programs = await getPrograms();
    const programIdParam = url.searchParams.get('programId');
    
    let selectedProgramId: number | undefined;
    
    if (programIdParam) {
      selectedProgramId = parseInt(programIdParam, 10);
    } else if (programs.length > 0) {
      // Guidelines 5.1: If no program selected, auto-select the first active program
      const activeProgram = programs.find(p => p.isActive) || programs[0];
      selectedProgramId = activeProgram.id;
    }

    const applications = selectedProgramId 
      ? await getApplications(selectedProgramId)
      : [];

    return {
      programs,
      applications,
      selectedProgramId
    };
  } catch (e) {
    console.error('Database connection error in /applications:', e);
    throw error(500, {
      message: 'Database connection failed. Please check if the database is running and the DATABASE_URL is correct.'
    });
  }
};
