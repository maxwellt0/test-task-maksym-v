import { error, fail } from '@sveltejs/kit';
import { getApplicationById, updateApplicationStatus, getProgramById } from '$lib/server/services/db';
import type { PageServerLoad, Actions } from './$types';
import type { ApplicationStatus } from '$lib/db/types';

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) throw error(400, 'Invalid ID');

  try {
    const application = await getApplicationById(id);
    if (!application) throw error(404, 'Application not found');

    const program = await getProgramById(application.programId);

    return {
      application,
      program
    };
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e) throw e; // Re-throw SvelteKit errors
    console.error(`Database connection error in /applications/${params.id}:`, e);
    throw error(500, {
      message: 'Database connection failed.'
    });
  }
};

export const actions: Actions = {
  updateStatus: async ({ request, params }) => {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

    const formData = await request.formData();
    const status = formData.get('status') as ApplicationStatus;

    const allowedStatuses: ApplicationStatus[] = ['new', 'reviewed', 'accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return fail(400, { message: 'Invalid status' });
    }

    const result = await updateApplicationStatus(id, status);
    console.log(`Update result for app ${id} to ${status}:`, result);

    if (!result || (result.numUpdatedRows !== undefined && result.numUpdatedRows === 0n)) {
       return fail(500, { message: 'Failed to update status. Application might not exist.' });
    }

    return { success: true };
  }
};
