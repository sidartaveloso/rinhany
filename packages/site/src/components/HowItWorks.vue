<script setup lang="ts">
const steps = [
  { n: '01', title: 'Defina o problema', text: 'Datasets, algoritmos e a função runner que executa cada confronto.' },
  { n: '02', title: 'Rode a rinha', text: 'O executor orquestra as batalhas, mede tempo e coleta métricas.' },
  { n: '03', title: 'Veja o ranking', text: 'Agregue resultados, declare o vencedor e apresente no terminal.' },
]
</script>

<template>
  <section class="relative border-y border-white/5 bg-black/30 py-24 sm:py-28">
    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <div class="mb-14 text-center">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Como funciona</p>
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Três passos para a rinha</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <div
          v-for="(s, i) in steps"
          :key="s.n"
          class="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
        >
          <span class="mb-4 block font-mono text-3xl font-bold text-white/15">{{ s.n }}</span>
          <h3 class="mb-2 text-lg font-semibold text-white">{{ s.title }}</h3>
          <p class="text-sm text-white/55">{{ s.text }}</p>
          <div
            v-if="i < steps.length - 1"
            class="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/20 to-transparent md:block"
          />
        </div>
      </div>
    </div>
  </section>
</template>
