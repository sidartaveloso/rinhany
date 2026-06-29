import { juizPadrao } from "../juiz/juizPadrao.js";
import { criarRingue } from "../ringue/criarRingue.js";
import type {
  Apresentador,
  ContextoExecucao,
  ContextoRodada,
  Juiz,
  Narrador,
  Publico,
  ResultadoRodada,
} from "../types/Papeis.types.js";
import type { EventoLuta, Ringue } from "../types/Ringue.types.js";
import type {
  BaseAlgoritmo,
  BaseDataset,
  BaseResultado,
  Brand,
  ComparacaoRinha,
  RelatorioRinha,
  Rinha,
} from "../types/Rinha.types.js";
import type { RinhaTheme } from "../types/Theme.types.js";

export type ConfiguracaoExecutorRinha<
  TDataset extends BaseDataset<unknown, unknown>,
  TAlgoritmo extends BaseAlgoritmo<unknown>,
  TResultado extends BaseResultado<unknown, unknown>,
  TMetricas,
> = {
  readonly nome: string;
  readonly descricao?: string;
  readonly datasets: ReadonlyArray<TDataset>;
  readonly algoritmos: ReadonlyArray<TAlgoritmo>;
  readonly runner: (
    algoritmo: TAlgoritmo,
    dataset: TDataset,
    ringue: Ringue,
  ) => Promise<TResultado>;
  readonly agregador: (resultados: ReadonlyArray<TResultado>) => TMetricas;
  readonly juiz?: Juiz<TResultado>;
  readonly narrador?: Narrador;
  readonly apresentador?: Apresentador<TResultado, TMetricas>;
  readonly publico?: Publico;
  readonly onEventoLuta?: (evento: EventoLuta) => void;
  readonly tema?: RinhaTheme;
  readonly dryRun?: boolean;
  readonly observarResultado?: (resultado: TResultado, ringue: Ringue) => void;
};

export type ExecutorRinha<
  TDataset extends BaseDataset<unknown, unknown>,
  TAlgoritmo extends BaseAlgoritmo<unknown>,
  TResultado extends BaseResultado<unknown, unknown>,
  TMetricas,
> = Rinha<TDataset, TAlgoritmo, TResultado, TMetricas>;

export const criarExecutorRinha = <
  TDataset extends BaseDataset<unknown, unknown>,
  TAlgoritmo extends BaseAlgoritmo<unknown>,
  TResultado extends BaseResultado<unknown, unknown>,
  TMetricas,
>(
  config: ConfiguracaoExecutorRinha<TDataset, TAlgoritmo, TResultado, TMetricas>,
): ExecutorRinha<TDataset, TAlgoritmo, TResultado, TMetricas> => {
  const emitir = (evento: Parameters<Publico["emitir"]>[0]) => config.publico?.emitir(evento);

  const executarUm = (
    algoritmo: TAlgoritmo,
    dataset: TDataset,
    ringue: Ringue,
  ): Promise<TResultado> => config.runner(algoritmo, dataset, ringue);

  const comparar = (
    resultados: ReadonlyArray<TResultado>,
  ): ComparacaoRinha<TResultado, TMetricas> => {
    const resultados_matriz = new Map<
      Brand<string, "AlgoritmoId">,
      Map<Brand<string, "DatasetId">, TResultado>
    >();

    for (const r of resultados) {
      if (!resultados_matriz.has(r.algoritmo_id)) resultados_matriz.set(r.algoritmo_id, new Map());
      resultados_matriz.get(r.algoritmo_id)?.set(r.dataset_id, r);
    }

    const rankings = (config.juiz ?? juizPadrao).julgar(resultados);
    const vencedor = rankings.values().next().value?.[0];
    const metricas_comparativas = calcularMetricasComparativas(resultados, config.agregador);

    return {
      resultados_matriz: resultados_matriz as ReadonlyMap<
        Brand<string, "AlgoritmoId">,
        ReadonlyMap<Brand<string, "DatasetId">, TResultado>
      >,
      rankings,
      vencedor,
      metricas_comparativas,
    };
  };

  const resolverNome = (id: string): string => {
    const algo = config.algoritmos.find((a) => a.id === id);
    return algo?.nome ?? id;
  };
  const temaOpts = config.tema ? { resolverNome } : undefined;

  const executar = async (): Promise<RelatorioRinha<TResultado, TMetricas>> => {
    const inicio = performance.now();

    const total_rodadas = config.datasets.length;

    const ctxRinha = {
      nome: config.nome,
      descricao: config.descricao,
      total_algoritmos: config.algoritmos.length,
      total_datasets: config.datasets.length,
      total_rodadas,
    };

    config.narrador?.onRinhaIniciar(ctxRinha);
    emitir({ tipo: "rinha:iniciou", ctx: ctxRinha });

    const resultados: TResultado[] = [];
    const historico_eventos: EventoLuta[] = [];
    let execucoes_com_sucesso = 0;
    let execucoes_com_erro = 0;
    let rodada = 0;

    for (const dataset of config.datasets) {
      rodada++;

      const ctxRodada: ContextoRodada = {
        rodada,
        total_rodadas,
        dataset_id: dataset.id,
        dataset_nome: dataset.nome,
        total_algoritmos: config.algoritmos.length,
      };

      config.narrador?.onRodadaIniciar(ctxRodada);
      emitir({ tipo: "rodada:iniciou", ctx: ctxRodada });

      const ringue = criarRingue({
        onEvento: (evento) => {
          historico_eventos.push(evento);
          config.narrador?.onEventoLuta(evento);
          config.onEventoLuta?.(evento);
        },
      });

      const resultadosRodada: ResultadoRodada[] = [];
      let execucao = 0;

      for (const algoritmo of config.algoritmos) {
        execucao++;

        const ctxExecucao: ContextoExecucao = {
          rodada,
          total_rodadas,
          execucao,
          total_execucoes: config.algoritmos.length,
          algoritmo_id: algoritmo.id,
          algoritmo_nome: algoritmo.nome,
          dataset_id: dataset.id,
          dataset_nome: dataset.nome,
        };

        config.narrador?.onExecucaoIniciar(ctxExecucao);
        emitir({ tipo: "execucao:iniciou", ctx: ctxExecucao });

        if (config.dryRun) {
          const ctxExecucaoFinalizada = { ...ctxExecucao, tempo_execucao_ms: 0 };
          config.narrador?.onExecucaoFinalizar(ctxExecucaoFinalizada);
          emitir({ tipo: "execucao:finalizou", ctx: ctxExecucaoFinalizada });
          resultadosRodada.push({
            algoritmo_id: algoritmo.id,
            algoritmo_nome: algoritmo.nome,
            tempo_ms: 0,
          });
          continue;
        }

        const inicioExecucao = performance.now();
        let resultado: TResultado;
        let erroExecucao: { mensagem: string; stack?: string } | undefined;

        try {
          resultado = await executarUm(algoritmo, dataset, ringue);
          execucoes_com_sucesso++;
        } catch (error) {
          erroExecucao = {
            mensagem: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          };
          resultado = {
            algoritmo_id: algoritmo.id,
            dataset_id: dataset.id,
            saida: undefined as unknown,
            metricas: undefined as unknown,
            tempo_execucao_ms: 0,
            timestamp: new Date(),
            erro: erroExecucao,
          } as TResultado;
          execucoes_com_erro++;
        }

        resultados.push(resultado);

        const tempo_ms = performance.now() - inicioExecucao;

        const ctxExecucaoFinalizada = {
          ...ctxExecucao,
          tempo_execucao_ms: tempo_ms,
          erro: erroExecucao,
        };

        config.narrador?.onExecucaoFinalizar(ctxExecucaoFinalizada);
        emitir({ tipo: "execucao:finalizou", ctx: ctxExecucaoFinalizada });

        if (!erroExecucao) {
          try {
            config.observarResultado?.(resultado, ringue);
          } catch {}
        }

        resultadosRodada.push({
          algoritmo_id: algoritmo.id,
          algoritmo_nome: algoritmo.nome,
          tempo_ms,
          erro: erroExecucao,
        });
      }

      const validos = [...resultadosRodada]
        .filter((r) => !r.erro)
        .sort((a, b) => a.tempo_ms - b.tempo_ms);

      if (validos.length >= 2) {
        const vencedor = validos[0] as (typeof validos)[0];
        const perdedor = validos.at(-1) as (typeof validos)[0];
        const agora = performance.now();

        const golpeCtx = {
          agressor: vencedor.algoritmo_id,
          vitima: perdedor.algoritmo_id,
          intensidade: Math.min(1, perdedor.tempo_ms / (vencedor.tempo_ms || 1) / 100),
        };

        ringue.emitir({
          tipo: "golpe",
          timestamp_ms: agora,
          ctx: {
            ...golpeCtx,
            descricao:
              config.tema?.descrever(
                {
                  tipo: "golpe",
                  timestamp_ms: agora,
                  ctx: golpeCtx,
                },
                temaOpts,
              ) ??
              `${vencedor.algoritmo_nome} (${vencedor.tempo_ms.toFixed(2)}ms) acerta ${perdedor.algoritmo_nome} (${perdedor.tempo_ms.toFixed(2)}ms)`,
          },
        });

        ringue.emitir({
          tipo: "nocaute",
          timestamp_ms: agora,
          ctx: {
            vencedor: vencedor.algoritmo_id,
            perdedor: perdedor.algoritmo_id,
            descricao:
              config.tema?.descrever(
                {
                  tipo: "nocaute",
                  timestamp_ms: agora,
                  ctx: {
                    vencedor: vencedor.algoritmo_id,
                    perdedor: perdedor.algoritmo_id,
                  },
                },
                temaOpts,
              ) ?? `${vencedor.algoritmo_nome} vence ${dataset.nome}`,
          },
        });
      }

      const ctxRodadaFinalizada = {
        ...ctxRodada,
        resultados: resultadosRodada,
      };

      config.narrador?.onRodadaFinalizar(ctxRodadaFinalizada);
      emitir({ tipo: "rodada:finalizou", ctx: ctxRodadaFinalizada });
    }

    const tempo_total_ms = performance.now() - inicio;
    const comparacao = comparar(resultados);
    const metricas_agregadas = config.agregador(resultados);

    const relatorio: RelatorioRinha<TResultado, TMetricas> = {
      resultados,
      comparacao,
      metricas_agregadas,
      sumario: {
        total_execucoes: resultados.length,
        execucoes_com_sucesso,
        execucoes_com_erro,
        tempo_total_ms,
      },
      data_geracao: new Date(),
      historico_eventos,
    };

    config.narrador?.onRinhaFinalizar({ ...ctxRinha, tempo_total_ms });
    config.apresentador?.apresentar(relatorio);
    emitir({ tipo: "rinha:finalizou", relatorio: relatorio as RelatorioRinha<unknown, unknown> });

    return relatorio;
  };

  return {
    nome: config.nome,
    descricao: config.descricao,
    datasets: config.datasets,
    algoritmos: config.algoritmos,
    executar,
    executarUm: (algoritmo: TAlgoritmo, dataset: TDataset) =>
      executarUm(algoritmo, dataset, criarRingue()),
    comparar,
  };
};

const calcularMetricasComparativas = <
  TResultado extends BaseResultado<unknown, unknown>,
  TMetricas,
>(
  resultados: ReadonlyArray<TResultado>,
  agregador: (rs: ReadonlyArray<TResultado>) => TMetricas,
): ReadonlyArray<TMetricas> => {
  const porAlgoritmo = new Map<Brand<string, "AlgoritmoId">, TResultado[]>();
  for (const r of resultados) {
    if (!porAlgoritmo.has(r.algoritmo_id)) porAlgoritmo.set(r.algoritmo_id, []);
    porAlgoritmo.get(r.algoritmo_id)?.push(r);
  }
  return Array.from(porAlgoritmo.values()).map(agregador);
};
