import type { ResultadoOrdenacao } from "./runner.js";

export type MetricasAgregadasOrdenacao = {
  readonly algoritmo_id: string;
  readonly tempo_medio_ms: number;
  readonly comparacoes_medias: number;
  readonly taxa_acerto: number;
  readonly total_execucoes: number;
};

export const agregadorOrdenacao = (
  resultados: ReadonlyArray<ResultadoOrdenacao>,
): MetricasAgregadasOrdenacao[] => {
  const porAlgoritmo = new Map<string, ResultadoOrdenacao[]>();

  for (const r of resultados) {
    const id = r.algoritmo_id as string;
    if (!porAlgoritmo.has(id)) porAlgoritmo.set(id, []);
    porAlgoritmo.get(id)?.push(r);
  }

  return Array.from(porAlgoritmo.entries()).map(([algoritmo_id, rs]) => {
    const semErro = rs.filter((r) => !r.erro);
    return {
      algoritmo_id,
      tempo_medio_ms: semErro.reduce((s, r) => s + r.tempo_execucao_ms, 0) / (semErro.length || 1),
      comparacoes_medias:
        semErro.reduce((s, r) => s + r.metricas.comparacoes, 0) / (semErro.length || 1),
      taxa_acerto: semErro.filter((r) => r.metricas.correto).length / (semErro.length || 1),
      total_execucoes: rs.length,
    };
  });
};
