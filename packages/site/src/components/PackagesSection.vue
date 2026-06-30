<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const packages = [
  { name: 'rinhany', desc: 'Meta-pacote que re-exporta tudo. Um único import para começar.', icon: 'package' },
  { name: '@rinhany/core', desc: 'Engine: executor, ringue, types, juiz e logger.', icon: 'boxes' },
  { name: '@rinhany/cli', desc: 'UI de terminal: apresentador, narrador, público e tema.', icon: 'scroll-text' },
  { name: '@rinhany/testing', desc: 'Utilities de teste e contract tests para algoritmos.', icon: 'gauge' },
]
</script>

<template>
  <section id="packages" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <div class="mb-14 max-w-2xl">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Monorepo</p>
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Pacotes modulares</h2>
        <p class="text-white/55">
          Use o meta-pacote ou importe apenas o que precisa. Tudo em TypeScript, com tipagem de ponta a ponta.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="p in packages"
          :key="p.name"
          class="flex gap-4 rounded-2xl border border-white/10 bg-[#0c1019] p-5 transition hover:border-white/15"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
            <AppIcon :name="p.icon" icon-class="h-5 w-5" />
          </div>
          <div>
            <div class="mb-1 flex flex-wrap items-center gap-2">
              <h3 class="font-mono text-sm font-semibold text-white">{{ p.name }}</h3>
              <span class="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">npm</span>
            </div>
            <p class="text-sm text-white/50">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
