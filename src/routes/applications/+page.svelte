<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  function handleProgramChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const programId = target.value;
    const url = new URL(page.url);
    if (programId) {
      url.searchParams.set('programId', programId);
    } else {
      url.searchParams.delete('programId');
    }
    goto(url.toString());
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
    
    <div class="flex items-center gap-2">
      <label for="program-select" class="text-sm font-medium text-gray-700">Program:</label>
      <select 
        id="program-select"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white border"
        value={data.selectedProgramId}
        onchange={handleProgramChange}
      >
        {#each data.programs as program}
          <option value={program.id}>
            {program.name} {!program.isActive ? '(Inactive)' : ''}
          </option>
        {/each}
      </select>
    </div>
  </div>

  <div class="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
    <ul role="list" class="divide-y divide-gray-200">
      {#if data.applications.length === 0}
        <li class="px-6 py-12 text-center text-gray-500">
          No applications found for this program.
        </li>
      {:else}
        {#each data.applications as app}
          <li>
            <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-indigo-600 truncate">{app.founderName}</p>
                  <div class="ml-2 flex-shrink-0 flex">
                    <p class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </p>
                  </div>
                </div>
                <div class="mt-2 flex justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      {app.startupName}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      {app.email}
                    </p>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div class="ml-6 flex-shrink-0">
                <a 
                  href={`/applications/${app.id}`}
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View
                </a>
              </div>
            </div>
          </li>
        {/each}
      {/if}
    </ul>
  </div>
</div>
