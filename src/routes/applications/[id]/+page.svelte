<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { data, form } = $props<{ data: PageData, form: ActionData }>();

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

<div class="max-w-3xl mx-auto space-y-6">
  <div class="flex items-center justify-between">
    <a 
      href={`/applications?programId=${data.application.programId}`}
      class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
    >
      &larr; Back to Applications
    </a>
    <div class={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(data.application.status)}`}>
      {data.application.status}
    </div>
  </div>

  {#if form?.success}
    <div class="rounded-md bg-green-50 p-4 border border-green-200">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">Status updated successfully!</p>
        </div>
      </div>
    </div>
  {/if}

  {#if form?.message}
    <div class="rounded-md bg-red-50 p-4 border border-red-200">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{form.message}</p>
        </div>
      </div>
    </div>
  {/if}

  <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Application Details</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Details for {data.application.startupName}</p>
    </div>
    <div class="px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Founder Name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.application.founderName}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email address</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.application.email}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Startup Name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.application.startupName}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Program</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.program?.name || 'Unknown'}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Submitted On</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(data.application.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  </div>

  <div class="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Update Status</h3>
    <form method="POST" action="?/updateStatus" use:enhance class="flex flex-wrap gap-3">
      {#each ['new', 'reviewed', 'accepted', 'rejected'] as status}
        <button
          type="submit"
          name="status"
          value={status}
          class={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
            data.application.status === status
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      {/each}
    </form>
  </div>
</div>
