import { apresentadorTerminal, criarNarradorTerminal, criarPublico, temaBoxe } from "@rinhany/cli";
import type { Brand, Ouvinte } from "@rinhany/core";
import { criarExecutorRinha } from "@rinhany/core";
import { agregadorOrdenacao } from "./agregador.js";
import { algoritmos } from "./algoritmos.js";
import { datasets } from "./datasets.js";
import type { ResultadoOrdenacao } from "./runner.js";
import { runnerOrdenacao } from "./runner.js";

const resolverNome = (id: string) => nomes[id] ?? id;

const narradorTerminal = criarNarradorTerminal({ tema: temaBoxe, resolverNome });

const publico = criarPublico();

const placar: Ouvinte = {
  onEvento(evento) {
    if (evento.tipo === "rinha:finalizou") {
      const vencedor = evento.relatorio.comparacao.vencedor;
      if (vencedor) {
        const nome = algoritmos.find((a) => a.id === vencedor)?.nome ?? vencedor;
        console.log(`  🏆 Campeão geral: ${nome}\n`);
      }
    }
  },
};

publico.adicionar(placar);

const nomes: Record<string, string> = Object.fromEntries(
  algoritmos.map((a) => [a.id as string, a.nome]),
);

await criarExecutorRinha({
  nome: "Rinha de Ordenação",
  descricao: "Bubble × Selection × Merge × Quick Sort",
  datasets,
  algoritmos,
  runner: runnerOrdenacao,
  agregador: agregadorOrdenacao,
  tema: temaBoxe,
  observarResultado(resultado: ResultadoOrdenacao, ringue) {
    const n = (resultado.saida as number[]).length;
    const { comparacoes } = resultado.metricas;
    const razao = n > 0 ? comparacoes / (n * n) : 0;
    if (razao > 2) {
      ringue.emitir({
        tipo: "tonteou",
        timestamp_ms: performance.now(),
        ctx: {
          algoritmo: resultado.algoritmo_id as Brand<string, "AlgoritmoId">,
          motivo: `${comparacoes.toLocaleString()} comparações em ${n} elementos (${razao.toFixed(1)}× n²)`,
        },
      });
    }
  },
  narrador: narradorTerminal,
  apresentador: {
    apresentar: (relatorio) =>
      apresentadorTerminal.apresentar(relatorio, {
        resolverNome: (id) => nomes[id as string] ?? (id as string),
      }),
  },
  publico,
}).executar();
