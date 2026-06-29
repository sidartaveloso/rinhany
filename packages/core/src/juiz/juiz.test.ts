import { describe, expect, it, vi } from "vitest";
import { criarExecutorRinha } from "../executor/ExecutorRinha.js";
import type { Juiz } from "../types/Papeis.types.js";
import type { BaseResultado, Brand } from "../types/Rinha.types.js";

type R = BaseResultado<string, Record<string, never>>;
const aid = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const algoritmos = [
  { id: aid("rapido"), nome: "Rápido", configuracao: {} },
  { id: aid("lento"), nome: "Lento", configuracao: {} },
];
const datasets = [{ id: did("d1"), nome: "D1", dados: "" }];

const runner = async (alg: (typeof algoritmos)[0], ds: (typeof datasets)[0]): Promise<R> => ({
  algoritmo_id: alg.id,
  dataset_id: ds.id,
  saida: "ok",
  metricas: {},
  tempo_execucao_ms: alg.id === aid("rapido") ? 1 : 100,
  timestamp: new Date(),
});

describe("Juiz — integração com executor", () => {
  it("chama julgar com todos os resultados", async () => {
    const julgar = vi.fn().mockReturnValue(new Map());
    const juiz: Juiz<R> = { julgar };

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      juiz,
    }).executar();

    expect(julgar).toHaveBeenCalledOnce();
    const primeiraCall = julgar.mock.calls[0];
    expect(primeiraCall).toBeDefined();
    const [resultados] = primeiraCall ?? [];
    expect(resultados).toHaveLength(2);
  });

  it("rankings do relatório refletem o que o juiz retornou", async () => {
    const rankingCustom = new Map([["Meu ranking", [aid("lento"), aid("rapido")]]]);
    const juiz: Juiz<R> = { julgar: () => rankingCustom };

    const relatorio = await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      juiz,
    }).executar();

    const ids = relatorio.comparacao.rankings.get("Meu ranking");
    expect(ids?.[0]).toBe("lento");
    expect(ids?.[1]).toBe("rapido");
  });

  it("vencedor é o primeiro do primeiro ranking", async () => {
    const juiz: Juiz<R> = {
      julgar: () => new Map([["Velocidade", [aid("rapido"), aid("lento")]]]),
    };

    const relatorio = await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      juiz,
    }).executar();

    expect(relatorio.comparacao.vencedor).toBe("rapido");
  });

  it("sem juiz usa ranking padrão por velocidade", async () => {
    const relatorio = await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
    }).executar();

    const ranking = relatorio.comparacao.rankings.get("Velocidade (mais rápido)");
    expect(ranking?.[0]).toBe("rapido");
  });
});
