import type { Apresentador, BaseResultado, Brand } from "@rinhany/core";
import { criarExecutorRinha } from "@rinhany/core";
import { describe, expect, it, vi } from "vitest";

type R = BaseResultado<string, Record<string, never>>;
const aid = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const algoritmos = [{ id: aid("a"), nome: "A", configuracao: {} }];
const datasets = [{ id: did("d"), nome: "D", dados: "" }];
const runner = async (alg: (typeof algoritmos)[0], ds: (typeof datasets)[0]): Promise<R> => ({
  algoritmo_id: alg.id,
  dataset_id: ds.id,
  saida: "ok",
  metricas: {},
  tempo_execucao_ms: 1,
  timestamp: new Date(),
});

describe("Apresentador — integração com executor", () => {
  it("chama apresentar uma vez ao final da execução", async () => {
    const apresentador: Apresentador<R, never[]> = { apresentar: vi.fn() };

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      apresentador,
    }).executar();

    expect(apresentador.apresentar).toHaveBeenCalledOnce();
  });

  it("apresentar recebe o relatório completo", async () => {
    const apresentador: Apresentador<R, never[]> = { apresentar: vi.fn() };

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      apresentador,
    }).executar();

    const primeiraCall = vi.mocked(apresentador.apresentar).mock.calls[0];
    expect(primeiraCall).toBeDefined();
    const [relatorio] = primeiraCall ?? [];
    expect(relatorio.sumario.total_execucoes).toBe(1);
    expect(relatorio.resultados).toHaveLength(1);
  });

  it("executa sem erros quando apresentador não é fornecido", async () => {
    await expect(
      criarExecutorRinha({
        nome: "R",
        datasets,
        algoritmos,
        runner,
        agregador: () => [],
      }).executar(),
    ).resolves.toBeDefined();
  });
});
