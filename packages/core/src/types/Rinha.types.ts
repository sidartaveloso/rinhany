export type Brand<T, TBrand> = T & { __brand: TBrand };

export type BaseAlgoritmo<TConfig = unknown> = {
  readonly id: Brand<string, "AlgoritmoId">;
  readonly nome: string;
  readonly descricao?: string;
  readonly versao?: string;
  readonly autor?: string;
  readonly configuracao: TConfig;
};

export type BaseDataset<TData, TMetadata = unknown> = {
  readonly id: Brand<string, "DatasetId">;
  readonly nome: string;
  readonly descricao?: string;
  readonly dados: TData;
  readonly metadados?: TMetadata;
};

export type BaseResultado<TOutput, TMetrics> = {
  readonly algoritmo_id: Brand<string, "AlgoritmoId">;
  readonly dataset_id: Brand<string, "DatasetId">;
  readonly saida: TOutput;
  readonly metricas: TMetrics;
  readonly tempo_execucao_ms: number;
  readonly timestamp: Date;
  readonly erro?: {
    readonly mensagem: string;
    readonly stack?: string;
  };
};

export type Rinha<
  TDataset extends BaseDataset<unknown, unknown>,
  TAlgoritmo extends BaseAlgoritmo<unknown>,
  TResultado extends BaseResultado<unknown, unknown>,
  TMetricas,
> = {
  readonly nome: string;
  readonly descricao?: string;
  readonly datasets: ReadonlyArray<TDataset>;
  readonly algoritmos: ReadonlyArray<TAlgoritmo>;
  executar(): Promise<RelatorioRinha<TResultado, TMetricas>>;
  executarUm(algoritmo: TAlgoritmo, dataset: TDataset): Promise<TResultado>;
  comparar(resultados: ReadonlyArray<TResultado>): ComparacaoRinha<TResultado, TMetricas>;
};

export type SumarioRinha = {
  readonly total_execucoes: number;
  readonly execucoes_com_sucesso: number;
  readonly execucoes_com_erro: number;
  readonly tempo_total_ms: number;
};

export type RelatorioRinha<TResultado, TMetricas> = {
  readonly resultados: ReadonlyArray<TResultado>;
  readonly comparacao: ComparacaoRinha<TResultado, TMetricas>;
  readonly metricas_agregadas: TMetricas;
  readonly sumario: SumarioRinha;
  readonly data_geracao: Date;
  readonly historico_eventos: ReadonlyArray<import("./Ringue.types.js").EventoLuta>;
};

export type ComparacaoRinha<TResultado, TMetricas> = {
  readonly resultados_matriz: ReadonlyMap<
    Brand<string, "AlgoritmoId">,
    ReadonlyMap<Brand<string, "DatasetId">, TResultado>
  >;
  readonly rankings: ReadonlyMap<string, ReadonlyArray<Brand<string, "AlgoritmoId">>>;
  readonly vencedor?: Brand<string, "AlgoritmoId">;
  readonly metricas_comparativas: ReadonlyArray<TMetricas>;
};

export type ExtractDataset<T> =
  T extends Rinha<infer TDataset, BaseAlgoritmo<unknown>, BaseResultado<unknown, unknown>, unknown>
    ? TDataset
    : never;

export type ExtractAlgoritmo<T> =
  T extends Rinha<
    BaseDataset<unknown, unknown>,
    infer TAlgoritmo,
    BaseResultado<unknown, unknown>,
    unknown
  >
    ? TAlgoritmo
    : never;

export type ExtractResultado<T> =
  T extends Rinha<BaseDataset<unknown, unknown>, BaseAlgoritmo<unknown>, infer TResultado, unknown>
    ? TResultado
    : never;

export type ExtractMetricas<T> =
  T extends Rinha<
    BaseDataset<unknown, unknown>,
    BaseAlgoritmo<unknown>,
    BaseResultado<unknown, unknown>,
    infer TMetricas
  >
    ? TMetricas
    : never;
