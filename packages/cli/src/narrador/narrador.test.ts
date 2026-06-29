import type { BaseResultado, Brand, EventoLuta, Narrador } from "@rinhany/core";
import { criarExecutorRinha } from "@rinhany/core";
import { describe, expect, it, vi } from "vitest";

type R = BaseResultado<string, Record<string, never>>;
const aid = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const algoritmos = [
  { id: aid("a"), nome: "Algo A", configuracao: {} },
  { id: aid("b"), nome: "Algo B", configuracao: {} },
];
const datasets = [
  { id: did("d1"), nome: "Dataset 1", dados: "" },
  { id: did("d2"), nome: "Dataset 2", dados: "" },
];
const runner = async (alg: (typeof algoritmos)[0], ds: (typeof datasets)[0]): Promise<R> => ({
  algoritmo_id: alg.id,
  dataset_id: ds.id,
  saida: "ok",
  metricas: {},
  tempo_execucao_ms: 5,
  timestamp: new Date(),
});

const narradorFake = (): Narrador => ({
  onRinhaIniciar: vi.fn(),
  onRodadaIniciar: vi.fn(),
  onExecucaoIniciar: vi.fn(),
  onExecucaoFinalizar: vi.fn(),
  onRodadaFinalizar: vi.fn(),
  onRinhaFinalizar: vi.fn(),
  onEventoLuta: vi.fn(),
});

describe("Narrador — hooks do executor", () => {
  it("chama onRinhaIniciar uma vez com contexto correto", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onRinhaIniciar).toHaveBeenCalledOnce();
    expect(narrador.onRinhaIniciar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Rinha X",
        total_algoritmos: 2,
        total_datasets: 2,
        total_rodadas: 2,
      }),
    );
  });

  it("chama onRodadaIniciar uma vez por dataset", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onRodadaIniciar).toHaveBeenCalledTimes(2);
  });

  it("onRodadaIniciar recebe dataset correto e total_algoritmos", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    const primeiraCall = vi.mocked(narrador.onRodadaIniciar).mock.calls[0];
    expect(primeiraCall).toBeDefined();
    const primeira = primeiraCall?.[0];
    expect(primeira?.dataset_nome).toBe("Dataset 1");
    expect(primeira?.total_algoritmos).toBe(2);
  });

  it("chama onExecucaoIniciar uma vez por algoritmo por dataset", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onExecucaoIniciar).toHaveBeenCalledTimes(4);
  });

  it("onExecucaoIniciar recebe nome do algoritmo e dataset", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    const call0 = vi.mocked(narrador.onExecucaoIniciar).mock.calls[0];
    expect(call0).toBeDefined();
    const primeira = call0?.[0];
    expect(primeira?.algoritmo_nome).toBe("Algo A");
    expect(primeira?.dataset_nome).toBe("Dataset 1");
  });

  it("chama onExecucaoFinalizar para cada execução sem erro", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onExecucaoFinalizar).toHaveBeenCalledTimes(4);
    const callFin0 = vi.mocked(narrador.onExecucaoFinalizar).mock.calls[0];
    expect(callFin0).toBeDefined();
    const ctx = callFin0?.[0];
    expect(ctx?.tempo_execucao_ms).toBeGreaterThanOrEqual(0);
    expect(ctx?.erro).toBeUndefined();
  });

  it("onExecucaoFinalizar recebe erro quando runner lança exceção", async () => {
    const narrador = narradorFake();
    const runnerComErro = async () => {
      throw new Error("explodiu");
    };
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets: [datasets[0] as (typeof datasets)[0]],
      algoritmos: [algoritmos[0] as (typeof algoritmos)[0]],
      runner: runnerComErro,
      agregador: () => [],
      narrador,
    }).executar();

    const callErr0 = vi.mocked(narrador.onExecucaoFinalizar).mock.calls[0];
    expect(callErr0).toBeDefined();
    const ctx = callErr0?.[0];
    expect(ctx?.erro?.mensagem).toBe("explodiu");
  });

  it("chama onRodadaFinalizar uma vez por dataset com resultados", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onRodadaFinalizar).toHaveBeenCalledTimes(2);
    const callRod0 = vi.mocked(narrador.onRodadaFinalizar).mock.calls[0];
    expect(callRod0).toBeDefined();
    const ctx = callRod0?.[0];
    expect(ctx?.resultados).toHaveLength(2);
  });

  it("chama onRinhaFinalizar uma vez com tempo total", async () => {
    const narrador = narradorFake();
    await criarExecutorRinha({
      nome: "Rinha X",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onRinhaFinalizar).toHaveBeenCalledOnce();
    const callFin = vi.mocked(narrador.onRinhaFinalizar).mock.calls[0];
    expect(callFin).toBeDefined();
    const ctx = callFin?.[0];
    expect(ctx?.tempo_total_ms).toBeGreaterThanOrEqual(0);
  });

  it("executa sem erros quando narrador não é fornecido", async () => {
    await expect(
      criarExecutorRinha({
        nome: "Rinha X",
        datasets,
        algoritmos,
        runner,
        agregador: () => [],
      }).executar(),
    ).resolves.toBeDefined();
  });

  it("chama narrador.onEventoLuta quando runner emite evento no ringue", async () => {
    const narrador = narradorFake();

    await criarExecutorRinha({
      nome: "Rinha X",
      datasets: [datasets[0] as (typeof datasets)[0]],
      algoritmos: [algoritmos[0] as (typeof algoritmos)[0]],
      runner: async (alg, ds, ringue) => {
        ringue.emitir({
          tipo: "golpe",
          ctx: { agressor: alg.id, vitima: alg.id, intensidade: 0.5 },
          timestamp_ms: 1,
        } satisfies EventoLuta);
        return runner(alg, ds);
      },
      agregador: () => [],
      narrador,
    }).executar();

    expect(narrador.onEventoLuta).toHaveBeenCalledOnce();
    const evento = vi.mocked(narrador.onEventoLuta).mock.calls[0]?.[0];
    expect(evento?.tipo).toBe("golpe");
  });
});
