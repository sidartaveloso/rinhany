<script setup lang="ts">
const GITHUB_URL = 'https://github.com/sidartaveloso/rinhany'
const NPM_URL = 'https://www.npmjs.com/package/rinhany'
</script>

<template>
  <footer class="border-t border-white/5 py-10">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-white/40 sm:flex-row sm:px-8">
      <div class="flex items-center gap-2">
        <img src="/rinhany-logo.png" alt="" class="h-5 w-auto opacity-60" />
        <span>© {{ new Date().getFullYear() }} rinhany · MIT License</span>
      </div>
      <div class="flex items-center gap-5">
        <a :href="GITHUB_URL" target="_blank" rel="noreferrer" class="transition hover:text-white/70">GitHub</a>
        <a :href="NPM_URL" target="_blank" rel="noreferrer" class="transition hover:text-white/70">npm</a>
        <a :href="`${GITHUB_URL}/blob/main/LICENSE`" target="_blank" rel="noreferrer" class="transition hover:text-white/70">License</a>
      </div>
    </div>
  </footer>
</template>
