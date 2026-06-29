import type { EventoLuta } from "./Ringue.types.js";
import type { Brand, RelatorioRinha } from "./Rinha.types.js";

export type ContextoRinha = {
  readonly nome: string;
  readonly descricao?: string;
  readonly total_algoritmos: number;
  readonly total_datasets: number;
  readonly total_rodadas: number;
};

export type ContextoRodada = {
  readonly rodada: number;
  readonly total_rodadas: number;
  readonly dataset_id: Brand<string, "DatasetId">;
  readonly dataset_nome: string;
  readonly total_algoritmos: number;
};

export type ContextoExecucao = {
  readonly rodada: number;
  readonly total_rodadas: number;
  readonly execucao: number;
  readonly total_execucoes: number;
  readonly algoritmo_id: Brand<string, "AlgoritmoId">;
  readonly algoritmo_nome: string;
  readonly dataset_id: Brand<string, "DatasetId">;
  readonly dataset_nome: string;
};

export type ContextoExecucaoFinalizada = ContextoExecucao & {
  readonly tempo_execucao_ms: number;
  readonly erro?: { readonly mensagem: string };
};

export type ResultadoRodada = {
  readonly algoritmo_id: Brand<string, "AlgoritmoId">;
  readonly algoritmo_nome: string;
  readonly tempo_ms: number;
  readonly erro?: { readonly mensagem: string };
};

export type ContextoRodadaFinalizada = ContextoRodada & {
  readonly resultados: ReadonlyArray<ResultadoRodada>;
};

export type EventoRinha =
  | { readonly tipo: "rinha:iniciou"; readonly ctx: ContextoRinha }
  | { readonly tipo: "rodada:iniciou"; readonly ctx: ContextoRodada }
  | { readonly tipo: "execucao:iniciou"; readonly ctx: ContextoExecucao }
  | { readonly tipo: "execucao:finalizou"; readonly ctx: ContextoExecucaoFinalizada }
  | { readonly tipo: "rodada:finalizou"; readonly ctx: ContextoRodadaFinalizada }
  | { readonly tipo: "rinha:finalizou"; readonly relatorio: RelatorioRinha<unknown, unknown> };

export type Juiz<TResultado> = {
  julgar(
    resultados: ReadonlyArray<TResultado>,
  ): ReadonlyMap<string, ReadonlyArray<Brand<string, "AlgoritmoId">>>;
};

export type Narrador = {
  onRinhaIniciar(ctx: ContextoRinha): void;
  onRodadaIniciar(ctx: ContextoRodada): void;
  onExecucaoIniciar(ctx: ContextoExecucao): void;
  onExecucaoFinalizar(ctx: ContextoExecucaoFinalizada): void;
  onRodadaFinalizar(ctx: ContextoRodadaFinalizada): void;
  onRinhaFinalizar(ctx: ContextoRinha & { tempo_total_ms: number }): void;
  onEventoLuta(evento: EventoLuta): void;
};

export type Apresentador<TResultado, TMetricas> = {
  apresentar(relatorio: RelatorioRinha<TResultado, TMetricas>): void;
};

export type Ouvinte = {
  onEvento(evento: EventoRinha): void;
};

export type Publico = {
  readonly ouvintes: ReadonlyArray<Ouvinte>;
  emitir(evento: EventoRinha): void;
};
