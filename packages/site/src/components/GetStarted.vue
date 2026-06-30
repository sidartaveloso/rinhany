<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const installCmd = 'pnpm add rinhany'
const demoCmd = 'pnpm demo:ordenacao'
const GITHUB_URL = 'https://github.com/sidartaveloso/rinhany'
const NPM_URL = 'https://www.npmjs.com/package/rinhany'

const copiedCmd = ref('')
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedCmd.value = text
    setTimeout(() => (copiedCmd.value = ''), 1800)
  } catch { /* ignore */ }
}
</script>

<template>
  <section id="start" class="relative py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <div class="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1019] via-[#0a0f1a] to-black">
        <div class="grid lg:grid-cols-2">
          <div class="p-8 sm:p-12">
            <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
              <AppIcon name="flag" icon-class="h-3.5 w-3.5" />
              Pronto para competir
            </div>
            <h2 class="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Suba no ringue em minutos
            </h2>
            <p class="mb-8 text-white/55">
              Node.js ≥ 22 e TypeScript ≥ 5.4. Instale o pacote, monte sua rinha e rode a demo de ordenação para ver a magia acontecer.
            </p>

            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm">
                <span class="text-white/80"><span class="text-red-400">$</span> {{ installCmd }}</span>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white" @click="copy(installCmd)">
                  <AppIcon :name="copiedCmd === installCmd ? 'check' : 'copy'" :icon-class="copiedCmd === installCmd ? 'h-3.5 w-3.5 text-emerald-400' : 'h-3.5 w-3.5'" />
                  {{ copiedCmd === installCmd ? 'copiado' : 'copiar' }}
                </button>
              </div>
              <div class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm">
                <span class="text-white/80"><span class="text-blue-400">$</span> {{ demoCmd }}</span>
                <button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white" @click="copy(demoCmd)">
                  <AppIcon :name="copiedCmd === demoCmd ? 'check' : 'copy'" :icon-class="copiedCmd === demoCmd ? 'h-3.5 w-3.5 text-emerald-400' : 'h-3.5 w-3.5'" />
                  {{ copiedCmd === demoCmd ? 'copiado' : 'copiar' }}
                </button>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <a
                :href="GITHUB_URL"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <AppIcon name="github" icon-class="h-4 w-4" />
                Repositório
              </a>
              <a
                :href="NPM_URL"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
              >
                <AppIcon name="package" icon-class="h-4 w-4" />
                npm package
              </a>
            </div>
          </div>

          <div class="relative flex items-center justify-center border-t border-white/5 bg-black/40 p-8 lg:border-l lg:border-t-0">
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_65%)]" />
            <img
              src="/rinhany-logo.png"
              alt="Logo rinhany"
              class="relative w-full max-w-md drop-shadow-[0_0_40px_rgba(239,68,68,0.2)]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
