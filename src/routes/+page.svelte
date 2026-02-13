<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
  <div class="space-y-4">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
      Accelerator Admin Portal
    </h1>
    <p class="text-xl text-gray-500 max-w-2xl mx-auto">
      Manage your startup acceleration programs and review founder applications with ease.
    </p>
  </div>

  <div class="flex gap-4">
    <Button href="/applications" size="lg" class="bg-indigo-600 hover:bg-indigo-700">
      View Applications
    </Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl">
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Review</h3>
      <p class="text-gray-500 text-sm">Easily browse and review all incoming applications.</p>
    </div>
    
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Decide</h3>
      <p class="text-gray-500 text-sm">Update application statuses with a single click.</p>
    </div>

    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Share</h3>
      <p class="text-gray-500 text-sm">Stable, bookmarkable links for every application.</p>
    </div>
  </div>
</div>
