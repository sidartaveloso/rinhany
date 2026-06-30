<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const GITHUB_URL = 'https://github.com/sidartaveloso/rinhany'
</script>

<template>
  <section class="relative min-h-screen overflow-hidden pt-16">
    <div class="pointer-events-none absolute inset-0 grid-bg" />
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(239,68,68,0.18),transparent_55%)]" />
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(59,130,246,0.12),transparent_50%)]" />

    <div class="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 sm:pt-24">
      <div class="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        Motor genérico de rinha de algoritmos · TypeScript
      </div>

      <div class="animate-fade-up delay-1 mb-8 w-full max-w-4xl">
        <img
          src="/rinhany-banner.png"
          alt="rinhany — algorithm benchmark engine"
          class="mx-auto w-full max-w-3xl drop-shadow-[0_20px_60px_rgba(239,68,68,0.15)]"
        />
      </div>

      <p class="animate-fade-up delay-2 mb-3 max-w-2xl text-lg font-medium text-white/90 sm:text-xl">
        Toda rinha reinventa sua própria infraestrutura.
      </p>
      <p class="animate-fade-up delay-3 mb-10 max-w-2xl text-base text-white/55 sm:text-lg">
        <span class="font-semibold text-white/80">rinhany</span> é o motor
        extensível que falta. Você traz o problema, os algoritmos e as métricas —
        rinhany cuida do ciclo de execução, dos rankings e da apresentação.
      </p>

      <div class="animate-fade-up delay-4 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="#start"
          class="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-400 hover:shadow-red-400/30"
        >
          <AppIcon name="zap" icon-class="h-4 w-4" />
          Começar agora
        </a>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:bg-white/10"
        >
          <AppIcon name="github" icon-class="h-4 w-4" />
          Ver no GitHub
        </a>
        <a
          href="#code"
          class="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
        >
          <AppIcon name="play" icon-class="h-4 w-4" />
          Ver exemplo
        </a>
      </div>


    </div>
  </section>
</template>
