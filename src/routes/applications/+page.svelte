<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  import { 
    Users, 
    Rocket, 
    Mail, 
    Calendar, 
    ChevronRight, 
    Filter,
    Inbox,
    Search
  } from 'lucide-svelte';

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
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
</script>

<div class="space-y-8 pb-12">
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
    <div class="space-y-1">
      <h1 class="text-3xl font-extrabold text-white tracking-tight">Applications</h1>
      <p class="text-blue-100 text-sm font-medium flex items-center gap-2">
        <Inbox class="w-4 h-4" />
        Manage and review founder submissions
      </p>
    </div>
    
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div class="relative w-full sm:w-64">
        <label for="program-select" class="absolute -top-2 left-2 px-1 bg-white text-[10px] font-bold text-indigo-600 uppercase tracking-wider rounded z-10 border border-indigo-100">
          Program Filter
        </label>
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select 
            id="program-select"
            class="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-gray-900 shadow-xl ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-white bg-white sm:text-sm cursor-pointer appearance-none transition-all hover:shadow-2xl"
            value={data.selectedProgramId}
            onchange={handleProgramChange}
          >
            {#each data.programs as program}
              <option value={program.id}>
                {program.name} {!program.isActive ? '(Inactive)' : ''}
              </option>
            {/each}
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <ChevronRight class="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Applications List -->
  <div class="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20">
    {#if data.error}
      <div class="px-6 py-12 text-center space-y-4">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
          <Filter class="w-8 h-8" />
        </div>
        <div class="max-w-xs mx-auto">
          <p class="text-gray-900 font-bold">{data.error}</p>
          <p class="text-gray-500 text-sm mt-1">Please select a valid program from the dropdown above.</p>
        </div>
      </div>
    {:else}
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Users class="w-4 h-4" />
          Candidates ({data.applications.length})
        </h2>
        <div class="text-[10px] font-medium text-gray-400">
          Sorted by newest first
        </div>
      </div>

      <ul role="list" class="divide-y divide-gray-100">
        {#if data.applications.length === 0}
          <li class="px-6 py-20 text-center space-y-4">
            <div class="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
              <Search class="w-8 h-8" />
            </div>
            <div class="max-w-xs mx-auto">
              <p class="text-gray-900 font-bold">No applications found</p>
              <p class="text-gray-500 text-sm mt-1">There are currently no submissions for this program batch.</p>
            </div>
          </li>
        {:else}
          {#each data.applications as app}
            <li class="group">
              <div class="px-6 py-5 flex items-center justify-between hover:bg-indigo-50/30 transition-all duration-200">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <p class="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {app.founderName}
                    </p>
                    <span class={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm cursor-default", 
                      getStatusColor(app.status)
                    )}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-y-2 gap-x-6">
                    <div class="flex items-center text-sm text-gray-600">
                      <Rocket class="w-3.5 h-3.5 mr-2 text-indigo-400" />
                      <span class="font-medium">{app.startupName}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500">
                      <Mail class="w-3.5 h-3.5 mr-2 text-gray-400" />
                      {app.email}
                    </div>
                    <div class="flex items-center text-sm text-gray-500">
                      <Calendar class="w-3.5 h-3.5 mr-2 text-gray-400" />
                      {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div class="ml-6 flex items-center gap-4">
                  <Button 
                    href={`/applications/${app.id}`}
                    variant="outline"
                    size="sm"
                    class="hidden sm:flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                  >
                    View Details
                    <ChevronRight class="w-4 h-4" />
                  </Button>
                  <!-- Mobile arrow -->
                  <a href={`/applications/${app.id}`} class="sm:hidden text-gray-400 hover:text-indigo-600 p-1">
                    <ChevronRight class="w-6 h-6" />
                  </a>
                </div>
              </div>
            </li>
          {/each}
        {/if}
      </ul>
      
      {#if data.applications.length > 0}
        <div class="px-6 py-4 bg-gray-50/30 border-t border-gray-100">
          <p class="text-[10px] text-gray-400 text-center italic">
            End of list for the selected program.
          </p>
        </div>
      {/if}
    {/if}
  </div>
</div>
