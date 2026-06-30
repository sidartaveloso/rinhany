import type { BaseResultado, Brand, RelatorioRinha } from "@rinhany/core";
import { describe, expect, it } from "vitest";
import { apresentadorTerminal } from "./ApresentadorTerminal.js";

type MetricasFake = { score: number };
type ResultadoFake = BaseResultado<string, MetricasFake>;

const id = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const resultado = (algoritmo_id: string, tempo: number, erro?: string): ResultadoFake => ({
  algoritmo_id: id(algoritmo_id),
  dataset_id: did("ds-1"),
  saida: "ok",
  metricas: { score: 1 },
  tempo_execucao_ms: tempo,
  timestamp: new Date("2026-01-01"),
  ...(erro ? { erro: { mensagem: erro } } : {}),
});

const relatorioBase = (): RelatorioRinha<ResultadoFake, MetricasFake[]> => ({
  resultados: [resultado("algo-a", 10), resultado("algo-b", 50), resultado("algo-c", 25)],
  comparacao: {
    resultados_matriz: new Map([
      [id("algo-a"), new Map([[did("ds-1"), resultado("algo-a", 10)]])],
      [id("algo-b"), new Map([[did("ds-1"), resultado("algo-b", 50)]])],
      [id("algo-c"), new Map([[did("ds-1"), resultado("algo-c", 25)]])],
    ]),
    rankings: new Map([["Velocidade", [id("algo-a"), id("algo-c"), id("algo-b")]]]),
    vencedor: id("algo-a"),
    metricas_comparativas: [],
  },
  metricas_agregadas: [{ score: 1 }],
  sumario: {
    total_execucoes: 3,
    execucoes_com_sucesso: 3,
    execucoes_com_erro: 0,
    tempo_total_ms: 85,
  },
  historico_eventos: [],
  data_geracao: new Date("2026-01-01"),
});

const capturar = (relatorio: RelatorioRinha<ResultadoFake, MetricasFake[]>, config = {}) => {
  const linhas: string[] = [];
  apresentadorTerminal.apresentar(relatorio, {
    ...config,
    escrever: (l) => linhas.push(l),
  });
  return linhas;
};

describe("apresentadorTerminal", () => {
  it("exibe o nome do ranking", () => {
    const linhas = capturar(relatorioBase());
    expect(linhas.some((l) => l.toUpperCase().includes("VELOCIDADE"))).toBe(true);
  });

  it("exibe os algoritmos na ordem correta do ranking", () => {
    const linhas = capturar(relatorioBase());
    const idxA = linhas.findIndex((l) => l.includes("algo-a"));
    const idxC = linhas.findIndex((l) => l.includes("algo-c"));
    const idxB = linhas.findIndex((l) => l.includes("algo-b"));
    expect(idxA).toBeLessThan(idxC);
    expect(idxC).toBeLessThan(idxB);
  });

  it("usa resolverNome quando fornecido", () => {
    const linhas = capturar(relatorioBase(), {
      resolverNome: (id: string) =>
        ({ "algo-a": "Algoritmo A", "algo-b": "Algoritmo B", "algo-c": "Algoritmo C" })[id] ?? id,
    });
    expect(linhas.some((l) => l.includes("Algoritmo A"))).toBe(true);
    expect(linhas.every((l) => !l.includes("algo-a"))).toBe(true);
  });

  it("exibe o sumário com totais corretos", () => {
    const linhas = capturar(relatorioBase());
    const sumario = linhas.join("\n");
    expect(sumario).toContain("3");
  });

  it("exibe o vencedor quando presente", () => {
    const linhas = capturar(relatorioBase());
    const saida = linhas.join("\n");
    expect(saida).toContain("algo-a");
  });

  it("indica execuções com erro no sumário", () => {
    const relatorio = relatorioBase();
    const comErro: RelatorioRinha<ResultadoFake, MetricasFake[]> = {
      ...relatorio,
      sumario: { ...relatorio.sumario, execucoes_com_erro: 1, execucoes_com_sucesso: 2 },
    };
    const linhas = capturar(comErro);
    const saida = linhas.join("\n");
    expect(saida).toMatch(/erro/i);
  });

  it("não lança exceção com relatorio vazio", () => {
    const vazio: RelatorioRinha<ResultadoFake, MetricasFake[]> = {
      resultados: [],
      comparacao: {
        resultados_matriz: new Map(),
        rankings: new Map(),
        vencedor: undefined,
        metricas_comparativas: [],
      },
      metricas_agregadas: [],
      sumario: {
        total_execucoes: 0,
        execucoes_com_sucesso: 0,
        execucoes_com_erro: 0,
        tempo_total_ms: 0,
      },
      historico_eventos: [],
      data_geracao: new Date("2026-01-01"),
    };
    expect(() => capturar(vazio)).not.toThrow();
  });

  it("sem vencedor, não exibe linha de vencedor", () => {
    const relatorio = relatorioBase();
    const semVencedor: RelatorioRinha<ResultadoFake, MetricasFake[]> = {
      ...relatorio,
      comparacao: { ...relatorio.comparacao, vencedor: undefined },
    };
    const linhas = capturar(semVencedor);
    expect(linhas.every((l) => !l.toLowerCase().includes("vencedor"))).toBe(true);
  });

  it("tempo médio em segundos quando >= 1000ms", () => {
    const relatorio = relatorioBase();
    const lento: RelatorioRinha<ResultadoFake, MetricasFake[]> = {
      ...relatorio,
      resultados: [resultado("algo-x", 1500), resultado("algo-y", 2500)],
      comparacao: {
        ...relatorio.comparacao,
        resultados_matriz: new Map([
          [id("algo-x"), new Map([[did("ds-1"), resultado("algo-x", 1500)]])],
          [id("algo-y"), new Map([[did("ds-1"), resultado("algo-y", 2500)]])],
        ]),
        rankings: new Map([["Velocidade", [id("algo-x"), id("algo-y")]]]),
        vencedor: id("algo-x"),
      },
      sumario: {
        total_execucoes: 2,
        execucoes_com_sucesso: 2,
        execucoes_com_erro: 0,
        tempo_total_ms: 4000,
      },
    };
    const linhas = capturar(lento);
    const saida = linhas.join("\n");
    expect(saida).toContain("1.50s");
    expect(saida).toContain("2.50s");
    expect(saida).toContain("4.00s");
  });

  it("tempo em microsegundos quando < 1ms", () => {
    const relatorio = relatorioBase();
    const rapido: RelatorioRinha<ResultadoFake, MetricasFake[]> = {
      ...relatorio,
      resultados: [resultado("algo-x", 0.5), resultado("algo-y", 0.05)],
      comparacao: {
        ...relatorio.comparacao,
        resultados_matriz: new Map([
          [id("algo-x"), new Map([[did("ds-1"), resultado("algo-x", 0.5)]])],
          [id("algo-y"), new Map([[did("ds-1"), resultado("algo-y", 0.05)]])],
        ]),
        rankings: new Map([["Velocidade", [id("algo-x"), id("algo-y")]]]),
        vencedor: id("algo-y"),
      },
      sumario: {
        total_execucoes: 2,
        execucoes_com_sucesso: 2,
        execucoes_com_erro: 0,
        tempo_total_ms: 0.55,
      },
    };
    const linhas = capturar(rapido);
    const saida = linhas.join("\n");
    expect(saida).toContain("µs");
    expect(saida).toContain("500µs");
  });
});
