<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const features = [
  {
    icon: 'cpu',
    title: 'Engine extensível',
    description:
      'Executor, ringue, juiz e logger prontos. Você define o problema, os algoritmos e as métricas — o resto é com o core.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: 'terminal',
    title: 'CLI cinematográfica',
    description:
      'Apresentador, narrador e público no terminal. Transforme benchmarks em um espetáculo digno de uma rinha de verdade.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: 'trophy',
    title: 'Rankings automáticos',
    description:
      'Agregue resultados, compare algoritmos e gere relatórios. Cada rinha termina com um vencedor claro.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: 'test-tube',
    title: 'Contract tests',
    description:
      'Utilities de teste para validar contratos de BaseAlgoritmo. Garanta que cada competidor segue as regras.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]
</script>

<template>
  <section id="features" class="relative py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(59,130,246,0.08),transparent)]" />
    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <div class="mb-14 max-w-2xl">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Recursos</p>
        <h2 class="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Infraestrutura de rinha, <span class="gradient-text">pronta para usar</span>
        </h2>
        <p class="text-white/55">
          Pare de reescrever o mesmo harness a cada competição. Foque no que importa: o problema e os algoritmos.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="f in features"
          :key="f.title"
          :class="[
            'group rounded-2xl border bg-[#0c1019]/80 p-6 transition hover:bg-[#0c1019]',
            f.border,
          ]"
        >
          <div :class="['mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl', f.bg, f.color]">
            <AppIcon :name="f.icon" icon-class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-white">{{ f.title }}</h3>
          <p class="text-sm leading-relaxed text-white/55">{{ f.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
