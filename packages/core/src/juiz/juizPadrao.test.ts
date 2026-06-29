import { describe, expect, it } from "vitest";
import type { BaseResultado, Brand } from "../types/Rinha.types.js";
import { juizPadrao } from "./juizPadrao.js";

const algoId = (s: string) => s as Brand<string, "AlgoritmoId">;
const dataId = (s: string) => s as Brand<string, "DatasetId">;

const resultado = (
  algoritmo_id: string,
  tempo_execucao_ms: number,
  erro?: { mensagem: string },
): BaseResultado<unknown, unknown> => ({
  algoritmo_id: algoId(algoritmo_id),
  dataset_id: dataId("ds-1"),
  saida: null,
  metricas: null,
  tempo_execucao_ms,
  timestamp: new Date(),
  erro,
});

describe("juizPadrao", () => {
  it("ordena do mais rápido ao mais lento por média de tempo", () => {
    const resultados = [resultado("lento", 100), resultado("rapido", 10), resultado("medio", 50)];

    const rankings = juizPadrao.julgar(resultados);
    const ranking = rankings.get("Velocidade (mais rápido)");

    expect(ranking).toBeDefined();
    expect(ranking?.[0]).toBe(algoId("rapido"));
    expect(ranking?.[1]).toBe(algoId("medio"));
    expect(ranking?.[2]).toBe(algoId("lento"));
  });

  it("retorna o ranking com chave 'Velocidade (mais rápido)'", () => {
    const resultados = [resultado("algo", 50)];
    const rankings = juizPadrao.julgar(resultados);

    expect(rankings.has("Velocidade (mais rápido)")).toBe(true);
  });

  it("com resultados vazios não lança exceção e retorna ranking vazio", () => {
    const rankings = juizPadrao.julgar([]);
    const ranking = rankings.get("Velocidade (mais rápido)");

    expect(ranking).toHaveLength(0);
  });

  it("ignora resultados com erro ao calcular a média", () => {
    const resultados = [
      resultado("bom", 10),
      resultado("bom", 20),
      resultado("ruim", 5, { mensagem: "erro catastrófico" }),
    ];

    const rankings = juizPadrao.julgar(resultados);
    const ranking = rankings.get("Velocidade (mais rápido)");

    expect(ranking).not.toContain(algoId("ruim"));
    expect(ranking).toContain(algoId("bom"));
  });

  it("usa média de múltiplos datasets para ordenar", () => {
    const resultados = [
      resultado("a", 20),
      resultado("a", 40),
      resultado("b", 10),
      resultado("b", 60),
    ];

    const rankings = juizPadrao.julgar(resultados);
    const ranking = rankings.get("Velocidade (mais rápido)");

    expect(ranking).toBeDefined();
    expect(ranking?.[0]).toBe(algoId("a"));
    expect(ranking?.[1]).toBe(algoId("b"));
  });
});
