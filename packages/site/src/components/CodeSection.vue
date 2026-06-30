<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const codeSnippet = `import { criarExecutorRinha } from "rinhany";

const relatorio = await criarExecutorRinha({
  nome: "Rinha de Busca",
  datasets: [
    { id: "grande", nome: "1M elementos", dados: gerarDados(1_000_000) },
  ],
  algoritmos: [
    { id: "linear",  nome: "Busca Linear",  impl: buscaLinear },
    { id: "binaria", nome: "Busca Binária", impl: buscaBinaria },
  ],
  runner: async (algoritmo, dataset) => {
    const inicio = performance.now();
    const resultado = algoritmo.impl(dataset.dados, alvo);
    return {
      algoritmo_id: algoritmo.id,
      dataset_id: dataset.id,
      saida: resultado,
      metricas: { encontrado: resultado !== -1 },
      tempo_execucao_ms: performance.now() - inicio,
      timestamp: new Date(),
    };
  },
  agregador: (resultados) => ({
    taxa_acerto: resultados.filter(r => r.metricas.encontrado).length
      / resultados.length,
  }),
}).executar();`

const fnNames = /^(criarExecutorRinha|performance|filter|length|Date|gerarDados|buscaLinear|buscaBinaria)$/
const tokenize = (line: string) => {
  const parts: { t: string; c?: string }[] = []
  const re = /(\b(?:import|from|const|await|async|return|new)\b)|("(?:\\.|[^"\\])*")|(\b\d[\d_]*\b)|(\/\/.*)|([A-Za-z_]\w*)|([{}()[\];,.:=<>!+\-*/&|?]+)|(\s+)/g
  let m: RegExpExecArray | null
  let last = 0
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) parts.push({ t: line.slice(last, m.index) })
    const [, kw, str, num, comment, ident, punct, ws] = m
    if (kw) parts.push({ t: kw, c: 'text-red-400' })
    else if (str) parts.push({ t: str, c: 'text-emerald-300/90' })
    else if (num) parts.push({ t: num, c: 'text-amber-300/90' })
    else if (comment) parts.push({ t: comment, c: 'text-white/30' })
    else if (ident) parts.push({ t: ident, c: fnNames.test(ident) ? 'text-blue-300' : 'text-white/80' })
    else if (punct) parts.push({ t: punct, c: 'text-white/40' })
    else if (ws) parts.push({ t: ws })
    last = m.index + m[0].length
  }
  if (last < line.length) parts.push({ t: line.slice(last) })
  if (parts.length === 0) parts.push({ t: line || '\u00A0' })
  return parts
}

const lines = codeSnippet.split('\n').map((line, i) => ({
  n: i + 1,
  tokens: tokenize(line),
}))

const copied = ref(false)
const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(codeSnippet)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch { /* ignore */ }
}
</script>

<template>
  <section id="code" class="relative py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(239,68,68,0.06),transparent)]" />
    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Uso básico</p>
          <h2 class="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Configure a rinha em poucas linhas</h2>
          <p class="mb-6 text-white/55">Traga datasets, algoritmos, um runner e um agregador. O executor orquestra os confrontos e devolve o relatório completo.</p>
          <ul class="space-y-3 text-sm text-white/65">
            <li v-for="item in ['Tipagem forte com TypeScript \u2265 5.4', 'M\u00e9tricas customiz\u00e1veis por rinha', 'Demo inclu\u00edda: rinha de ordena\u00e7\u00e3o', 'Licen\u00e7a MIT \u2014 use em qualquer projeto']" :key="item" class="flex items-start gap-2.5">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AppIcon name="check" icon-class="h-3 w-3" />
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="code-block overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
          <div class="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span class="ml-2 font-mono text-xs text-white/40">rinha.ts</span>
            </div>
            <button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white" @click="onCopy">
              <AppIcon :name="copied ? 'check' : 'copy'" :icon-class="copied ? 'h-3.5 w-3.5 text-emerald-400' : 'h-3.5 w-3.5'" />
              {{ copied ? 'copiado' : 'copiar' }}
            </button>
          </div>
          <pre class="overflow-x-auto p-4 text-left text-[11px] leading-relaxed sm:text-xs"><code class="font-mono"><div v-for="line in lines" :key="line.n" class="flex"><span class="select-none pr-4 text-right text-white/20 w-8 shrink-0">{{ line.n }}</span><span class="whitespace-pre-wrap"><span v-for="(tok, idx) in line.tokens" :key="idx" :class="tok.c ?? ''">{{ tok.t }}</span></span></div></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
