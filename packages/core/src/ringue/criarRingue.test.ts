import { describe, expect, it, vi } from "vitest";
import type { EventoLuta } from "../types/Ringue.types.js";
import type { Brand } from "../types/Rinha.types.js";
import { criarRingue } from "./criarRingue.js";

const aid = (s: string) => s as Brand<string, "AlgoritmoId">;

const golpe = (timestamp_ms = 10): EventoLuta => ({
  tipo: "golpe",
  ctx: { agressor: aid("a"), vitima: aid("b"), intensidade: 0.8 },
  timestamp_ms,
});

const tonteou = (timestamp_ms = 20): EventoLuta => ({
  tipo: "tonteou",
  ctx: { algoritmo: aid("b"), motivo: "pico de memória" },
  timestamp_ms,
});

describe("criarRingue", () => {
  it("começa com histórico vazio", () => {
    const ringue = criarRingue();
    expect(ringue.historico).toHaveLength(0);
  });

  it("emitir adiciona evento ao histórico", () => {
    const ringue = criarRingue();
    ringue.emitir(golpe());
    expect(ringue.historico).toHaveLength(1);
    expect(ringue.historico[0]?.tipo).toBe("golpe");
  });

  it("múltiplos eventos são acumulados em ordem", () => {
    const ringue = criarRingue();
    ringue.emitir(golpe(10));
    ringue.emitir(tonteou(20));
    expect(ringue.historico).toHaveLength(2);
    expect(ringue.historico[0]?.tipo).toBe("golpe");
    expect(ringue.historico[1]?.tipo).toBe("tonteou");
  });

  it("histórico é imutável — não pode ser modificado externamente", () => {
    const ringue = criarRingue();
    ringue.emitir(golpe());
    const historico = ringue.historico as EventoLuta[];
    expect(() => {
      historico.push(tonteou());
    }).toThrow();
  });

  it("emitir chama listener registrado", () => {
    const listener = vi.fn();
    const ringue = criarRingue({ onEvento: listener });
    ringue.emitir(golpe());
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(golpe());
  });

  it("listener com erro não impede acúmulo no histórico", () => {
    const ringue = criarRingue({
      onEvento: () => {
        throw new Error("ops");
      },
    });
    expect(() => ringue.emitir(golpe())).not.toThrow();
    expect(ringue.historico).toHaveLength(1);
  });

  it("todos os tipos de EventoLuta são aceitos", () => {
    const ringue = criarRingue();
    const eventos: EventoLuta[] = [
      {
        tipo: "golpe",
        ctx: { agressor: aid("a"), vitima: aid("b"), intensidade: 1 },
        timestamp_ms: 1,
      },
      { tipo: "tonteou", ctx: { algoritmo: aid("b"), motivo: "lento" }, timestamp_ms: 2 },
      { tipo: "foi-pra-lona", ctx: { algoritmo: aid("b"), motivo: "erro" }, timestamp_ms: 3 },
      { tipo: "recuperou", ctx: { algoritmo: aid("b") }, timestamp_ms: 4 },
      { tipo: "nocaute", ctx: { vencedor: aid("a"), perdedor: aid("b") }, timestamp_ms: 5 },
    ];
    for (const e of eventos) ringue.emitir(e);
    expect(ringue.historico).toHaveLength(5);
    expect(ringue.historico.map((e) => e.tipo)).toEqual([
      "golpe",
      "tonteou",
      "foi-pra-lona",
      "recuperou",
      "nocaute",
    ]);
  });
});

describe("criarRingue — integração com executor", () => {
  it("runner recebe ringue e pode emitir eventos", async () => {
    const { criarExecutorRinha } = await import("../executor/ExecutorRinha.js");
    const eventos: EventoLuta[] = [];

    const executor = criarExecutorRinha({
      nome: "Rinha Teste",
      datasets: [{ id: "d1" as Brand<string, "DatasetId">, nome: "D1", dados: "" }],
      algoritmos: [{ id: aid("a"), nome: "A", configuracao: {} }],
      runner: async (alg, ds, ringue) => {
        ringue.emitir({
          tipo: "golpe",
          ctx: { agressor: aid("a"), vitima: aid("a"), intensidade: 0.5 },
          timestamp_ms: 1,
        });
        return {
          algoritmo_id: alg.id,
          dataset_id: ds.id,
          saida: "ok",
          metricas: {},
          tempo_execucao_ms: 1,
          timestamp: new Date(),
        };
      },
      agregador: () => [],
      onEventoLuta: (e) => eventos.push(e),
    });

    await executor.executar();
    expect(eventos).toHaveLength(1);
    expect(eventos[0]?.tipo).toBe("golpe");
  });

  it("relatório contém histórico de eventos da luta", async () => {
    const { criarExecutorRinha } = await import("../executor/ExecutorRinha.js");

    const executor = criarExecutorRinha({
      nome: "Rinha Teste",
      datasets: [{ id: "d1" as Brand<string, "DatasetId">, nome: "D1", dados: "" }],
      algoritmos: [{ id: aid("a"), nome: "A", configuracao: {} }],
      runner: async (alg, ds, ringue) => {
        ringue.emitir({
          tipo: "tonteou",
          ctx: { algoritmo: alg.id, motivo: "devagar" },
          timestamp_ms: 5,
        });
        return {
          algoritmo_id: alg.id,
          dataset_id: ds.id,
          saida: "ok",
          metricas: {},
          tempo_execucao_ms: 1,
          timestamp: new Date(),
        };
      },
      agregador: () => [],
    });

    const relatorio = await executor.executar();
    expect(relatorio.historico_eventos).toHaveLength(1);
    expect(relatorio.historico_eventos[0]?.tipo).toBe("tonteou");
  });
});
