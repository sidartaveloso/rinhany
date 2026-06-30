<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from './AppIcon.vue'

const GITHUB_URL = 'https://github.com/sidartaveloso/rinhany'
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 12
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      scrolled ? 'nav-blur border-b border-white/5' : 'bg-transparent',
    ]"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <a href="#" class="flex items-center gap-2.5 group">
        <img
          src="/rinhany-logo.png"
          alt="rinhany"
          class="h-8 w-auto object-contain opacity-90 transition group-hover:opacity-100"
        />
      </a>

      <nav class="hidden items-center gap-8 text-sm text-white/60 md:flex">
        <a href="#features" class="transition hover:text-white">Recursos</a>
        <a href="#packages" class="transition hover:text-white">Pacotes</a>
        <a href="#code" class="transition hover:text-white">Código</a>
        <a href="#start" class="transition hover:text-white">Começar</a>
      </nav>

      <div class="flex items-center gap-3">
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <AppIcon name="github" icon-class="h-4 w-4" />
          <span class="hidden sm:inline">GitHub</span>
        </a>
        <a
          href="#start"
          class="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-red-400"
        >
          Instalar
          <AppIcon name="arrow-right" icon-class="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  </header>
</template>
