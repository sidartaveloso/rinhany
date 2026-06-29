import type { BaseResultado, Brand, Ouvinte } from "@rinhany/core";
import { criarExecutorRinha } from "@rinhany/core";
import { describe, expect, it, vi } from "vitest";
import { criarPublico } from "./Publico.js";

type R = BaseResultado<string, Record<string, never>>;
const aid = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const algoritmos = [
  { id: aid("a"), nome: "A", configuracao: {} },
  { id: aid("b"), nome: "B", configuracao: {} },
];
const datasets = [{ id: did("d"), nome: "D", dados: "" }];
const runner = async (alg: (typeof algoritmos)[0], ds: (typeof datasets)[0]): Promise<R> => ({
  algoritmo_id: alg.id,
  dataset_id: ds.id,
  saida: "ok",
  metricas: {},
  tempo_execucao_ms: 1,
  timestamp: new Date(),
});

describe("criarPublico", () => {
  it("começa sem ouvintes", () => {
    const publico = criarPublico();
    expect(publico.ouvintes).toHaveLength(0);
  });

  it("adicionar registra ouvinte", () => {
    const publico = criarPublico();
    const ouvinte: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(ouvinte);
    expect(publico.ouvintes).toHaveLength(1);
  });

  it("emitir chama onEvento em todos os ouvintes", () => {
    const publico = criarPublico();
    const o1: Ouvinte = { onEvento: vi.fn() };
    const o2: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(o1);
    publico.adicionar(o2);

    publico.emitir({
      tipo: "rinha:iniciou",
      ctx: { nome: "R", total_algoritmos: 1, total_datasets: 1, total_rodadas: 1 },
    });

    expect(o1.onEvento).toHaveBeenCalledOnce();
    expect(o2.onEvento).toHaveBeenCalledOnce();
  });

  it("ouvinte com erro não impede os demais de receber evento", () => {
    const publico = criarPublico();
    const oQuebra: Ouvinte = {
      onEvento: () => {
        throw new Error("ops");
      },
    };
    const oSaudavel: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(oQuebra);
    publico.adicionar(oSaudavel);

    expect(() =>
      publico.emitir({
        tipo: "rinha:iniciou",
        ctx: { nome: "R", total_algoritmos: 1, total_datasets: 1, total_rodadas: 1 },
      }),
    ).not.toThrow();
    expect(oSaudavel.onEvento).toHaveBeenCalledOnce();
  });
});

describe("Público — integração com executor", () => {
  it("recebe evento rinha:iniciou", async () => {
    const publico = criarPublico();
    const ouvinte: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(ouvinte);

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      publico,
    }).executar();

    const tipos = vi.mocked(ouvinte.onEvento).mock.calls.map(([e]) => e.tipo);
    expect(tipos).toContain("rinha:iniciou");
  });

  it("recebe evento rodada:iniciou uma vez por dataset", async () => {
    const publico = criarPublico();
    const ouvinte: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(ouvinte);

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      publico,
    }).executar();

    const rodadasIniciadas = vi
      .mocked(ouvinte.onEvento)
      .mock.calls.filter(([e]) => e.tipo === "rodada:iniciou");
    expect(rodadasIniciadas).toHaveLength(1);
  });

  it("recebe evento execucao:iniciou para cada algoritmo×dataset", async () => {
    const publico = criarPublico();
    const ouvinte: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(ouvinte);

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      publico,
    }).executar();

    const execucoesIniciadas = vi
      .mocked(ouvinte.onEvento)
      .mock.calls.filter(([e]) => e.tipo === "execucao:iniciou");
    expect(execucoesIniciadas).toHaveLength(2);
  });

  it("recebe evento rinha:finalizou com o relatório", async () => {
    const publico = criarPublico();
    const ouvinte: Ouvinte = { onEvento: vi.fn() };
    publico.adicionar(ouvinte);

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      publico,
    }).executar();

    const finalizou = vi
      .mocked(ouvinte.onEvento)
      .mock.calls.find(([e]) => e.tipo === "rinha:finalizou");
    expect(finalizou).toBeDefined();
  });

  it("ordem dos eventos respeita o ciclo de vida", async () => {
    const publico = criarPublico();
    const tipos: string[] = [];
    publico.adicionar({ onEvento: (e) => tipos.push(e.tipo) });

    await criarExecutorRinha({
      nome: "R",
      datasets,
      algoritmos,
      runner,
      agregador: () => [],
      publico,
    }).executar();

    expect(tipos[0]).toBe("rinha:iniciou");
    expect(tipos.at(-1)).toBe("rinha:finalizou");
    const iRodada = tipos.indexOf("rodada:iniciou");
    const iExecucao = tipos.indexOf("execucao:iniciou");
    expect(iRodada).toBeLessThan(iExecucao);
  });
});
