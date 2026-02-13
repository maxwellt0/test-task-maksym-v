<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import type { PageData, ActionData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  import { 
    Share2, 
    CheckCircle2, 
    User, 
    Mail, 
    Rocket, 
    Calendar, 
    Briefcase,
    ArrowLeft,
    Clock,
    ShieldCheck
  } from 'lucide-svelte';

  let { data, form } = $props<{ data: PageData, form: ActionData }>();
  let copied = $state(false);

  function getStatusColor(status: string) {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(page.url.toString());
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <Button 
      variant="ghost"
      href={`/applications?programId=${data.application.programId}`}
      class="text-white hover:bg-white/10 w-fit"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      Back to Applications
    </Button>
    <div class="flex items-center gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        onclick={copyToClipboard}
        type="button"
        class="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
      >
        {#if copied}
          <CheckCircle2 class="w-4 h-4 text-green-300" />
          <span class="text-green-300">Copied!</span>
        {:else}
          <Share2 class="w-4 h-4" />
          <span>Share Link</span>
        {/if}
      </Button>
      <div class={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm cursor-default border", getStatusColor(data.application.status))}>
        {data.application.status}
      </div>
    </div>
  </div>

  {#if form?.success}
    <div class="rounded-lg bg-green-500/10 p-4 border border-green-500/50 backdrop-blur-sm">
      <div class="flex items-center">
        <CheckCircle2 class="w-5 h-5 text-green-400 mr-3" />
        <p class="text-sm font-medium text-green-100">Status updated successfully!</p>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Left Column: Application Details -->
    <div class="md:col-span-2 space-y-6">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="px-6 py-5 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">{data.application.startupName}</h3>
            <p class="text-sm text-gray-500 mt-0.5">Application Details</p>
          </div>
          <Rocket class="w-8 h-8 text-indigo-500 opacity-20" />
        </div>
        
        <div class="px-6 py-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                  <User class="w-3.5 h-3.5 mr-1.5" />
                  Founder Info
                </h4>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{data.application.founderName}</p>
                    <p class="text-xs text-gray-500">Full Name</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-indigo-50 rounded-lg">
                      <Mail class="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <a href="mailto:{data.application.email}" class="text-sm font-medium text-indigo-600 hover:underline">
                        {data.application.email}
                      </a>
                      <p class="text-xs text-gray-500">Email Address</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                  <Briefcase class="w-3.5 h-3.5 mr-1.5" />
                  Program Info
                </h4>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{data.program?.name || 'Unknown'}</p>
                    <p class="text-xs text-gray-500">Applied Batch</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-purple-50 rounded-lg">
                      <Calendar class="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {new Date(data.application.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                      <p class="text-xs text-gray-500">Submission Date</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Actions & Meta -->
    <div class="space-y-6">
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wider">
          <ShieldCheck class="w-4 h-4 mr-2 text-indigo-500" />
          Update Status
        </h3>
        <form method="POST" action="?/updateStatus" use:enhance class="flex flex-col gap-3">
          {#each ['new', 'reviewed', 'accepted', 'rejected'] as status}
            <Button
              type="submit"
              name="status"
              value={status}
              disabled={data.application.status === status}
              variant={data.application.status === status ? 'default' : 'outline'}
              class={cn(
                "justify-start h-11 transition-all",
                data.application.status === status ? "bg-indigo-600 hover:bg-indigo-700 shadow-md scale-[1.02]" : "hover:border-indigo-200 hover:bg-indigo-50/50"
              )}
            >
              <div class={cn(
                "w-2 h-2 rounded-full mr-3",
                status === 'new' && "bg-blue-400",
                status === 'reviewed' && "bg-yellow-400",
                status === 'accepted' && "bg-green-400",
                status === 'rejected' && "bg-red-400",
              )}></div>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {#if data.application.status === status}
                <CheckCircle2 class="w-4 h-4 ml-auto text-white/80" />
              {/if}
            </Button>
          {/each}
        </form>
      </div>

      <div class="bg-indigo-900/10 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
        <div class="flex items-center gap-3 text-indigo-100 mb-2">
          <Clock class="w-4 h-4" />
          <span class="text-xs font-bold uppercase tracking-wider">Timeline</span>
        </div>
        <p class="text-sm text-indigo-100/70">
          Last updated on {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
</div>
