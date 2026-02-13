<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 font-sans">
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <a href="/applications" class="text-xl font-bold text-indigo-600">Accelerator Admin</a>
      </div>
      <nav class="flex space-x-4">
        <a href="/applications" class="text-gray-600 hover:text-gray-900">Applications</a>
      </nav>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {@render children()}
  </main>
</div>
