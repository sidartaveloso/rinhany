import type {
  Brand,
  ContextoExecucao,
  ContextoExecucaoFinalizada,
  ContextoRinha,
  ContextoRodada,
  ContextoRodadaFinalizada,
  EventoLuta,
  RinhaTheme,
} from "@rinhany/core";
import { describe, expect, it, vi } from "vitest";
import { criarNarradorTerminal } from "./narradorTerminal.js";

const algoId = (s: string) => s as Brand<string, "AlgoritmoId">;
const dataId = (s: string) => s as Brand<string, "DatasetId">;

const ctxRinha: ContextoRinha = {
  nome: "Rinha de Teste",
  total_algoritmos: 2,
  total_datasets: 3,
  total_rodadas: 3,
};

const ctxRodada: ContextoRodada = {
  rodada: 1,
  total_rodadas: 3,
  dataset_id: dataId("ds-1"),
  dataset_nome: "Dataset Um",
  total_algoritmos: 2,
};

const ctxExecucao: ContextoExecucao = {
  rodada: 1,
  total_rodadas: 3,
  execucao: 1,
  total_execucoes: 2,
  algoritmo_id: algoId("algo-1"),
  algoritmo_nome: "Algo Um",
  dataset_id: dataId("ds-1"),
  dataset_nome: "Dataset Um",
};

const ctxExecucaoOk: ContextoExecucaoFinalizada = {
  ...ctxExecucao,
  tempo_execucao_ms: 42.5,
};

const ctxExecucaoErro: ContextoExecucaoFinalizada = {
  ...ctxExecucao,
  tempo_execucao_ms: 0,
  erro: { mensagem: "falhou feio" },
};

const ctxRodadaFinalizada: ContextoRodadaFinalizada = {
  ...ctxRodada,
  resultados: [
    { algoritmo_id: algoId("algo-1"), algoritmo_nome: "Algo Um", tempo_ms: 10 },
    { algoritmo_id: algoId("algo-2"), algoritmo_nome: "Algo Dois", tempo_ms: 50 },
  ],
};

describe("criarNarradorTerminal", () => {
  it("onRinhaIniciar exibe nome em maiúsculas e totais", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onRinhaIniciar(ctxRinha);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("RINHA DE TESTE");
    expect(tudo).toContain("2 competidores");
    expect(tudo).toContain("3 datasets");
    expect(tudo).toContain("3 rodadas");
  });

  it("onRodadaIniciar exibe número da rodada e dataset", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onRodadaIniciar(ctxRodada);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("Rodada 1/3");
    expect(tudo).toContain("Dataset Um");
  });

  it("onExecucaoIniciar exibe número da execução e algoritmo", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onExecucaoIniciar(ctxExecucao);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("[1/2]");
    expect(tudo).toContain("Algo Um");
  });

  it("onExecucaoFinalizar exibe tempo quando sem erro", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onExecucaoFinalizar(ctxExecucaoOk);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("42.50ms");
    expect(tudo).not.toContain("ERRO");
  });

  it("onExecucaoFinalizar exibe mensagem de erro quando com erro", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onExecucaoFinalizar(ctxExecucaoErro);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("ERRO");
    expect(tudo).toContain("falhou feio");
  });

  it("onRodadaFinalizar exibe vencedor da rodada", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onRodadaFinalizar(ctxRodadaFinalizada);

    const tudo = linhas.join("\n");
    expect(tudo).toContain("Algo Um");
    expect(tudo).toContain("10.00ms");
  });

  it("onRinhaFinalizar exibe tempo total", () => {
    const linhas: string[] = [];
    const narrador = criarNarradorTerminal({ escrever: (l) => linhas.push(l) });

    narrador.onRinhaFinalizar({ ...ctxRinha, tempo_total_ms: 1234 });

    const tudo = linhas.join("\n");
    expect(tudo).toContain("1234ms");
  });

  it("usa console.log quando escrever não é injetado", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const narrador = criarNarradorTerminal();

    narrador.onRinhaFinalizar({ ...ctxRinha, tempo_total_ms: 99 });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  describe("com tema", () => {
    const eventoGolpe: EventoLuta = {
      tipo: "golpe",
      ctx: { agressor: algoId("A"), vitima: algoId("B"), intensidade: 0.8 },
      timestamp_ms: 10,
    };

    it("onRinhaIniciar chama tema.iniciar e renderiza comandos", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema de teste",
        descrever: () => "",
        iniciar: () => [
          { tipo: "quadro", linhas: ["== RING ==", "== FIGHT =="] },
          { tipo: "texto", conteudo: "LET'S GET READY TO RUMBLE!" },
        ],
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onRinhaIniciar(ctxRinha);

      expect(linhas).toEqual(["== RING ==", "== FIGHT ==", "LET'S GET READY TO RUMBLE!"]);
    });

    it("onRinhaIniciar sem tema.iniciar mantém comportamento padrão", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema sem iniciar",
        descrever: () => "",
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onRinhaIniciar(ctxRinha);

      const tudo = linhas.join("\n");
      expect(tudo).toContain("RINHA DE TESTE");
    });

    it("onEventoLuta com tema.eventoLuta renderiza comandos", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema de teste",
        descrever: () => "descricao fallback",
        eventoLuta: () => [
          { tipo: "texto", conteudo: "🥊 POW!" },
          { tipo: "pausa", duracao_ms: 100 },
          { tipo: "texto", conteudo: "💥 Diretão!" },
        ],
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onEventoLuta(eventoGolpe);

      expect(linhas).toEqual(["🥊 POW!", "💥 Diretão!"]);
    });

    it("onEventoLuta sem tema.eventoLuta usa tema.descrever como fallback", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema sem eventoLuta",
        descrever: () => "🥊 A acerta B!",
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onEventoLuta(eventoGolpe);

      expect(linhas).toEqual(["🥊 A acerta B!"]);
    });

    it("onEventoLuta sem tema escreve info genérica", () => {
      const linhas: string[] = [];
      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
      });

      narrador.onEventoLuta(eventoGolpe);

      expect(linhas).toHaveLength(1);
      expect(linhas[0]).toContain("golpe");
    });

    it("onRinhaFinalizar chama tema.finalizar e renderiza comandos", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema de teste",
        descrever: () => "",
        finalizar: () => [
          { tipo: "quadro", linhas: ["🏆 FIM DE JOGO 🏆"] },
          { tipo: "texto", conteudo: "Total: 5000ms" },
        ],
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onRinhaFinalizar({ ...ctxRinha, tempo_total_ms: 5000 });

      expect(linhas).toEqual(["🏆 FIM DE JOGO 🏆", "Total: 5000ms"]);
    });

    it("onRinhaFinalizar sem tema.finalizar mantém comportamento padrão", () => {
      const linhas: string[] = [];
      const temaFake: RinhaTheme = {
        nome: "Teste",
        descricao: "Tema sem finalizar",
        descrever: () => "",
      };

      const narrador = criarNarradorTerminal({
        escrever: (l) => linhas.push(l),
        tema: temaFake,
      });

      narrador.onRinhaFinalizar({ ...ctxRinha, tempo_total_ms: 1234 });

      const tudo = linhas.join("\n");
      expect(tudo).toContain("1234ms");
    });
  });
});
