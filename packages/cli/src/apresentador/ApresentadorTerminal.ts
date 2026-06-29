import type { Brand, RelatorioRinha } from "@rinhany/core";
import type { Apresentador, ConfigApresentador } from "./tipos.js";

const formatarTempo = (ms: number): string =>
  ms < 1
    ? `${(ms * 1000).toFixed(0)}µs`
    : ms < 1000
      ? `${ms.toFixed(2)}ms`
      : `${(ms / 1000).toFixed(2)}s`;

const barra = (valor: number, max: number, largura = 20): string => {
  if (max === 0) return "░".repeat(largura);
  const preenchido = Math.round((valor / max) * largura);
  return "█".repeat(preenchido) + "░".repeat(largura - preenchido);
};

const MEDALHAS = ["🥇", "🥈", "🥉"];
const medalha = (pos: number) => MEDALHAS[pos] ?? `${pos + 1}.`;

const apresentar = <TResultado, TMetricas>(
  relatorio: RelatorioRinha<TResultado, TMetricas>,
  config: ConfigApresentador = {},
): void => {
  const escrever = config.escrever ?? ((l: string) => console.log(l));
  const resolverNome = config.resolverNome ?? ((id: Brand<string, "AlgoritmoId">) => id as string);

  const { sumario, comparacao, data_geracao } = relatorio;

  escrever("═".repeat(60));
  escrever("  RELATÓRIO DA RINHA");
  escrever(`  ${data_geracao.toLocaleString("pt-BR")}`);
  escrever("═".repeat(60));

  for (const [nomeRanking, ids] of comparacao.rankings) {
    escrever("");
    escrever(`📊 ${nomeRanking.toUpperCase()}`);
    escrever("");

    const tempos = ids.map((id) => {
      const porDataset = comparacao.resultados_matriz.get(id);
      if (!porDataset) return 0;
      const tempoTotal = Array.from(porDataset.values()).reduce(
        (s, r) => s + (r as { tempo_execucao_ms: number }).tempo_execucao_ms,
        0,
      );
      return tempoTotal / porDataset.size;
    });

    const maxTempo = Math.max(...tempos, 0);

    for (const [pos, id] of ids.entries()) {
      const nome = resolverNome(id).padEnd(20);
      const tempo = tempos[pos] ?? 0;
      escrever(`  ${medalha(pos)} ${nome} ${barra(tempo, maxTempo)}  ${formatarTempo(tempo)}`);
    }
  }

  escrever("");
  escrever("─".repeat(60));
  escrever("  SUMÁRIO");
  escrever(`  Total:   ${sumario.total_execucoes} execuções`);
  escrever(`  Sucesso: ${sumario.execucoes_com_sucesso}`);

  if (sumario.execucoes_com_erro > 0) {
    escrever(`  Erro:    ${sumario.execucoes_com_erro}`);
  }

  escrever(`  Tempo:   ${formatarTempo(sumario.tempo_total_ms)}`);

  if (comparacao.vencedor) {
    escrever("");
    escrever(`  🏆 ${resolverNome(comparacao.vencedor)}`);
  }

  escrever("═".repeat(60));
};

export const apresentadorTerminal: Apresentador<unknown, unknown> = { apresentar } as Apresentador<
  unknown,
  unknown
>;
