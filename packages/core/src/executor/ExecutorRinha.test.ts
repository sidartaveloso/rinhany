import { expect, test, vi } from "vitest";
import type { BaseAlgoritmo, BaseDataset, BaseResultado, Brand } from "../types/Rinha.types.js";
import type { RinhaTheme } from "../types/Theme.types.js";
import { criarExecutorRinha } from "./ExecutorRinha.js";

type ConfigSort = { ordem: "asc" | "desc" };
type SaidaSort = { ordenado: number[] };
type MetricasSort = { correto: boolean; comparacoes: number };
type MetricasAgregadas = { taxa_acerto: number };

type AlgoritmoSort = BaseAlgoritmo<ConfigSort>;
type DatasetSort = BaseDataset<number[], undefined>;
type ResultadoSort = BaseResultado<SaidaSort, MetricasSort>;

const makeAlgoritmo = (id: string, ordem: "asc" | "desc"): AlgoritmoSort => ({
  id: id as Brand<string, "AlgoritmoId">,
  nome: `Sort-${ordem}`,
  configuracao: { ordem },
});

const makeDataset = (id: string, dados: number[]): DatasetSort => ({
  id: id as Brand<string, "DatasetId">,
  nome: `Dataset-${id}`,
  dados,
});

const runnerSort = async (
  algoritmo: AlgoritmoSort,
  dataset: DatasetSort,
): Promise<ResultadoSort> => {
  const inicio = performance.now();
  let comparacoes = 0;
  const ordenado = [...dataset.dados].sort((a, b) => {
    comparacoes++;
    return algoritmo.configuracao.ordem === "asc" ? a - b : b - a;
  });
  const correto = ordenado.every(
    (v, i) =>
      i === 0 ||
      (algoritmo.configuracao.ordem === "asc"
        ? (ordenado[i - 1] as number) <= v
        : (ordenado[i - 1] as number) >= v),
  );
  return {
    algoritmo_id: algoritmo.id,
    dataset_id: dataset.id,
    saida: { ordenado },
    metricas: { correto, comparacoes },
    tempo_execucao_ms: performance.now() - inicio,
    timestamp: new Date(),
  };
};

const agregadorSort = (resultados: ReadonlyArray<ResultadoSort>): MetricasAgregadas => {
  const validos = resultados.filter((r) => !r.erro);
  return {
    taxa_acerto:
      validos.length === 0 ? 0 : validos.filter((r) => r.metricas.correto).length / validos.length,
  };
};

const algoritmoAsc = makeAlgoritmo("asc", "asc");
const algoritmoDesc = makeAlgoritmo("desc", "desc");
const datasetA = makeDataset("a", [3, 1, 4, 1, 5]);
const datasetB = makeDataset("b", [9, 2, 6]);

test("criarExecutorRinha: expõe nome, datasets e algoritmos da config", () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  expect(executor.nome).toBe("Rinha Sort");
  expect(executor.datasets).toEqual([datasetA]);
  expect(executor.algoritmos).toEqual([algoritmoAsc]);
});

test("executarUm: delega direto ao runner", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  const resultado = await executor.executarUm(algoritmoAsc, datasetA);

  expect(resultado.algoritmo_id).toBe(algoritmoAsc.id);
  expect(resultado.dataset_id).toBe(datasetA.id);
  expect(resultado.saida.ordenado).toEqual([1, 1, 3, 4, 5]);
});

test("executar: chama runner para cada combinação algoritmo × dataset", async () => {
  const chamadas: string[] = [];
  const runnerSpy = async (alg: AlgoritmoSort, ds: DatasetSort): Promise<ResultadoSort> => {
    chamadas.push(`${alg.id}×${ds.id}`);
    return runnerSort(alg, ds);
  };

  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSpy,
    agregador: agregadorSort,
  });

  await executor.executar();

  expect(chamadas).toHaveLength(4);
  expect(chamadas).toContain("asc×a");
  expect(chamadas).toContain("asc×b");
  expect(chamadas).toContain("desc×a");
  expect(chamadas).toContain("desc×b");
});

test("executar: sumário conta execuções com sucesso e com erro", async () => {
  let chamadas = 0;
  const runnerComErro = async (alg: AlgoritmoSort, ds: DatasetSort): Promise<ResultadoSort> => {
    chamadas++;
    if (chamadas === 2) throw new Error("falha simulada");
    return runnerSort(alg, ds);
  };

  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc],
    runner: runnerComErro,
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();

  expect(relatorio.sumario.total_execucoes).toBe(2);
  expect(relatorio.sumario.execucoes_com_sucesso).toBe(1);
  expect(relatorio.sumario.execucoes_com_erro).toBe(1);
});

test("executar: erro do runner vira resultado.erro, não exceção", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: async () => {
      throw new Error("runner explodiu");
    },
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();

  expect(relatorio.sumario.execucoes_com_erro).toBe(1);
  expect(relatorio.resultados[0]?.erro).toBeDefined();
  expect(relatorio.resultados[0]?.erro?.mensagem).toBe("runner explodiu");
});

test("executar: tempo_total_ms é >= 0", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();

  expect(relatorio.sumario.tempo_total_ms).toBeGreaterThanOrEqual(0);
});

test("comparar: constrói resultados_matriz indexada por algoritmo_id e dataset_id", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();
  const matriz = relatorio.comparacao.resultados_matriz;

  expect(matriz.get(algoritmoAsc.id)).toBeDefined();
  expect(matriz.get(algoritmoAsc.id)?.get(datasetA.id)).toBeDefined();
  expect(matriz.get(algoritmoAsc.id)?.get(datasetB.id)).toBeDefined();
});

test("comparar: usa juiz customizado quando fornecido", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSort,
    agregador: agregadorSort,
    juiz: {
      julgar: () => new Map([["Criterio customizado", [algoritmoDesc.id, algoritmoAsc.id]]]),
    },
  });

  const relatorio = await executor.executar();
  const ranking = relatorio.comparacao.rankings.get("Criterio customizado");

  expect(ranking).toBeDefined();
  expect(ranking?.[0]).toBe(algoritmoDesc.id);
});

test("comparar: usa ranking por velocidade como default quando ranker omitido", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();

  expect(relatorio.comparacao.rankings.size).toBeGreaterThan(0);
});

test("executar: vencedor é o primeiro do primeiro ranking", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSort,
    agregador: agregadorSort,
    juiz: {
      julgar: () => new Map([["F1", [algoritmoAsc.id, algoritmoDesc.id]]]),
    },
  });

  const relatorio = await executor.executar();

  expect(relatorio.comparacao.vencedor).toBe(algoritmoAsc.id);
});

test("executar: metricas_agregadas vêm do agregador injetado", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
  });

  const relatorio = await executor.executar();

  expect(relatorio.metricas_agregadas.taxa_acerto).toBe(1);
});

test("dryRun: runner nunca é chamado", async () => {
  const runnerSpy = vi.fn(runnerSort);

  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSpy,
    agregador: agregadorSort,
    dryRun: true,
  });

  await executor.executar();

  expect(runnerSpy).not.toHaveBeenCalled();
});

test("dryRun: relatorio.resultados está vazio", async () => {
  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSort,
    agregador: agregadorSort,
    dryRun: true,
  });

  const relatorio = await executor.executar();

  expect(relatorio.resultados).toHaveLength(0);
  expect(relatorio.sumario.total_execucoes).toBe(0);
  expect(relatorio.sumario.execucoes_com_sucesso).toBe(0);
});

test("dryRun: narrador.onExecucaoIniciar é chamado para cada algoritmo × dataset", async () => {
  const onExecucaoIniciar = vi.fn();

  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA, datasetB],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSort,
    agregador: agregadorSort,
    narrador: {
      onRinhaIniciar: vi.fn(),
      onRodadaIniciar: vi.fn(),
      onExecucaoIniciar,
      onExecucaoFinalizar: vi.fn(),
      onRodadaFinalizar: vi.fn(),
      onRinhaFinalizar: vi.fn(),
      onEventoLuta: vi.fn(),
    },
    dryRun: true,
  });

  await executor.executar();

  expect(onExecucaoIniciar).toHaveBeenCalledTimes(4);
});

test("dryRun: narrador.onRinhaFinalizar é chamado", async () => {
  const onRinhaFinalizar = vi.fn();

  const executor = criarExecutorRinha({
    nome: "Rinha Sort",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc],
    runner: runnerSort,
    agregador: agregadorSort,
    narrador: {
      onRinhaIniciar: vi.fn(),
      onRodadaIniciar: vi.fn(),
      onExecucaoIniciar: vi.fn(),
      onExecucaoFinalizar: vi.fn(),
      onRodadaFinalizar: vi.fn(),
      onRinhaFinalizar,
      onEventoLuta: vi.fn(),
    },
    dryRun: true,
  });

  await executor.executar();

  expect(onRinhaFinalizar).toHaveBeenCalledTimes(1);
});

test("executar com tema usa tema.descrever em eventos automáticos", async () => {
  const temaFake: RinhaTheme = {
    nome: "Teste",
    descricao: "Tema de teste",
    descrever: () => "💥 TEMA: golpe automático!",
  };

  const executor = criarExecutorRinha({
    nome: "Rinha Tema",
    datasets: [datasetA],
    algoritmos: [algoritmoAsc, algoritmoDesc],
    runner: runnerSort,
    agregador: agregadorSort,
    tema: temaFake,
  });

  const relatorio = await executor.executar();

  const eventosGolpe = relatorio.historico_eventos.filter((e) => e.tipo === "golpe");
  expect(eventosGolpe.length).toBeGreaterThanOrEqual(1);
  for (const e of eventosGolpe) {
    expect(e.ctx.descricao).toBe("💥 TEMA: golpe automático!");
  }
});
