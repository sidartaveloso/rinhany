import type { Brand, EventoLuta } from "@rinhany/core";
import { createThemeSuite } from "@rinhany/core/contract";
import { describe, expect, it } from "vitest";
import { temaBoxe } from "./temaBoxe.js";

createThemeSuite(() => temaBoxe);

const aid = (s: string) => s as Brand<string, "AlgoritmoId">;

const eventos: Record<string, EventoLuta> = {
  golpe: {
    tipo: "golpe",
    ctx: { agressor: aid("A"), vitima: aid("B"), intensidade: 0.8 },
    timestamp_ms: 10,
  },
  tonteou: {
    tipo: "tonteou",
    ctx: { algoritmo: aid("B"), motivo: "pico de memória" },
    timestamp_ms: 20,
  },
  "foi-pra-lona": {
    tipo: "foi-pra-lona",
    ctx: { algoritmo: aid("B"), motivo: "estouro de pilha" },
    timestamp_ms: 30,
  },
  recuperou: {
    tipo: "recuperou",
    ctx: { algoritmo: aid("B") },
    timestamp_ms: 40,
  },
  nocaute: {
    tipo: "nocaute",
    ctx: {
      vencedor: aid("A"),
      perdedor: aid("B"),
      descricao: "A eliminou B",
    },
    timestamp_ms: 50,
  },
};

describe("temaBoxe", () => {
  it("nome do tema é 'Boxe Clássico'", () => {
    expect(temaBoxe.nome).toBe("Boxe Clássico");
  });

  it("descricao menciona 'Atari 2600'", () => {
    expect(temaBoxe.descricao).toContain("Atari 2600");
  });

  describe("descrever — texto específico", () => {
    it("golpe", () => {
      expect(temaBoxe.descrever(eventos.golpe)).toBe("🥊 A acerta B com um cruzado de direita!");
    });

    it("tonteou", () => {
      expect(temaBoxe.descrever(eventos.tonteou)).toBe("😵 B está tonto!");
    });

    it("foi-pra-lona", () => {
      expect(temaBoxe.descrever(eventos["foi-pra-lona"])).toBe("💫 B foi para a lona!");
    });

    it("recuperou", () => {
      expect(temaBoxe.descrever(eventos.recuperou)).toBe("🙌 B se recuperou!");
    });

    it("nocaute", () => {
      expect(temaBoxe.descrever(eventos.nocaute)).toBe("🥊 NOCAUTE! A vence B!");
    });

    it("usa resolverNome quando fornecido", () => {
      const resolver = (id: string) => ({ A: "Alfa", B: "Bravo" })[id] ?? id;
      expect(temaBoxe.descrever(eventos.golpe, { resolverNome: resolver })).toBe(
        "🥊 Alfa acerta Bravo com um cruzado de direita!",
      );
    });
  });

  describe("iniciar", () => {
    it("retorna canvas com 80×50 pixels", () => {
      const comandos = temaBoxe.iniciar?.({
        nome: "Rinha Teste",
        total_algoritmos: 3,
        total_datasets: 2,
        total_rodadas: 2,
      });

      expect(comandos).toBeDefined();
      expect(comandos?.[0]?.tipo).toBe("canvas");
      if (comandos?.[0]?.tipo === "canvas") {
        expect(comandos[0].pixels.length).toBe(50);
        expect(comandos[0].pixels[0]?.length).toBe(80);
      }
    });

    it("inclui texto overlay com nome da rinha", () => {
      const comandos = temaBoxe.iniciar?.({
        nome: "Rinha Teste",
        total_algoritmos: 3,
        total_datasets: 2,
        total_rodadas: 2,
      });

      expect(comandos?.[0]?.tipo).toBe("canvas");
      if (comandos?.[0]?.tipo === "canvas") {
        expect(comandos[0].textos).toBeDefined();
        const textosJuntos = comandos[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("RINHA TESTE");
      }
    });

    it("desenha arena com cordas laranja nas bordas", () => {
      const comandos = temaBoxe.iniciar?.({
        nome: "Rinha Teste",
        total_algoritmos: 3,
        total_datasets: 2,
        total_rodadas: 2,
      });

      expect(comandos?.[0]?.tipo).toBe("canvas");
      if (comandos?.[0]?.tipo === "canvas") {
        const p = comandos[0].pixels;
        expect(p[5]?.[2]).toBe("laranja");
        expect(p[5]?.[77]).toBe("laranja");
        expect(p[4]?.[10]).toBe("laranja");
        expect(p[43]?.[10]).toBe("laranja");
        expect(p[25]?.[40]).toBe("verde");
      }
    });

    it("iniciar após eventos limpa mapeamento de equipes", () => {
      temaBoxe.eventoLuta?.({
        tipo: "golpe",
        ctx: { agressor: aid("X"), vitima: aid("Y"), intensidade: 0.8 },
        timestamp_ms: 10,
      });
      const comandos = temaBoxe.iniciar?.({
        nome: "Nova Rinha",
        total_algoritmos: 2,
        total_datasets: 1,
        total_rodadas: 1,
      });
      expect(comandos).toBeDefined();
      expect(comandos?.[0]?.tipo).toBe("canvas");
    });
  });

  describe("eventoLuta", () => {
    it("golpe retorna canvas", () => {
      const cmds = temaBoxe.eventoLuta?.(eventos.golpe);
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
    });

    it("nocaute exibe mensagem no overlay", () => {
      const cmds = temaBoxe.eventoLuta?.(eventos.nocaute);
      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("NOCAUTE");
        expect(textosJuntos).toContain("A");
        expect(textosJuntos).toContain("B");
      }
    });

    it("usa resolverNome quando fornecido no overlay", () => {
      const resolver = (id: string) => ({ A: "Alfa", B: "Bravo" })[id] ?? id;
      const cmds = temaBoxe.eventoLuta?.(eventos.golpe, { resolverNome: resolver });
      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("Alfa");
        expect(textosJuntos).toContain("Bravo");
      }
    });

    it("tonteou retorna canvas", () => {
      const cmds = temaBoxe.eventoLuta?.(eventos.tonteou);
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("tonto");
        expect(textosJuntos).toContain("B");
      }
    });

    it("foi-pra-lona retorna canvas", () => {
      const cmds = temaBoxe.eventoLuta?.(eventos["foi-pra-lona"]);
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("lona");
        expect(textosJuntos).toContain("B");
      }
    });

    it("recuperou retorna canvas", () => {
      const cmds = temaBoxe.eventoLuta?.(eventos.recuperou);
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("recuperou");
        expect(textosJuntos).toContain("B");
      }
    });

    it("golpe com agressor=preto e vitima=branco cobre branches alternativos", () => {
      temaBoxe.iniciar?.({
        nome: "X",
        total_algoritmos: 2,
        total_datasets: 1,
        total_rodadas: 1,
      });
      temaBoxe.eventoLuta?.({
        tipo: "golpe",
        ctx: { agressor: aid("_1"), vitima: aid("_2"), intensidade: 0.5 },
        timestamp_ms: 0,
      });
      const cmds = temaBoxe.eventoLuta?.({
        tipo: "golpe",
        ctx: { agressor: aid("_2"), vitima: aid("_1"), intensidade: 0.5 },
        timestamp_ms: 5,
      });
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
    });

    it("tonteou com cor=preto cobre sprite alternativo", () => {
      temaBoxe.iniciar?.({
        nome: "X",
        total_algoritmos: 2,
        total_datasets: 1,
        total_rodadas: 1,
      });
      temaBoxe.eventoLuta?.({
        tipo: "tonteou",
        ctx: { algoritmo: aid("_1"), motivo: "_" },
        timestamp_ms: 0,
      });
      const cmds = temaBoxe.eventoLuta?.({
        tipo: "tonteou",
        ctx: { algoritmo: aid("_2"), motivo: "teste" },
        timestamp_ms: 10,
      });
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
    });

    it("foi-pra-lona com cor=preto cobre sprite alternativo", () => {
      temaBoxe.iniciar?.({
        nome: "X",
        total_algoritmos: 2,
        total_datasets: 1,
        total_rodadas: 1,
      });
      temaBoxe.eventoLuta?.({
        tipo: "tonteou",
        ctx: { algoritmo: aid("_1"), motivo: "_" },
        timestamp_ms: 0,
      });
      const cmds = temaBoxe.eventoLuta?.({
        tipo: "foi-pra-lona",
        ctx: { algoritmo: aid("_2"), motivo: "teste" },
        timestamp_ms: 10,
      });
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
    });

    it("nocaute com vencedor=preto cobre branches alternativos", () => {
      temaBoxe.iniciar?.({
        nome: "X",
        total_algoritmos: 2,
        total_datasets: 1,
        total_rodadas: 1,
      });
      temaBoxe.eventoLuta?.({
        tipo: "tonteou",
        ctx: { algoritmo: aid("_1"), motivo: "_" },
        timestamp_ms: 0,
      });
      const cmds = temaBoxe.eventoLuta?.({
        tipo: "nocaute",
        ctx: { vencedor: aid("_2"), perdedor: aid("_1"), descricao: "nocaute" },
        timestamp_ms: 15,
      });
      expect(cmds).toBeDefined();
      expect(cmds?.[0]?.tipo).toBe("canvas");
    });
  });

  describe("rodadaIniciar", () => {
    it("retorna canvas com round info", () => {
      const cmds = temaBoxe.rodadaIniciar?.({
        rodada: 2,
        total_rodadas: 3,
        dataset_id: aid("ds-1") as unknown as Brand<string, "DatasetId">,
        dataset_nome: "Dataset X",
        total_algoritmos: 3,
      });

      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("ROUND 2/3");
        expect(textosJuntos).toContain("Dataset X");
      }
    });
  });

  describe("finalizar", () => {
    it("retorna canvas com mensagem de encerramento", () => {
      const cmds = temaBoxe.finalizar?.({
        nome: "Rinha Teste",
        total_algoritmos: 3,
        total_datasets: 2,
        total_rodadas: 2,
        tempo_total_ms: 5432,
      });

      expect(cmds?.[0]?.tipo).toBe("canvas");
      if (cmds?.[0]?.tipo === "canvas") {
        const textosJuntos = cmds[0].textos?.map((t) => t.texto).join("") ?? "";
        expect(textosJuntos).toContain("CAMPEÃO");
        expect(textosJuntos).toContain("5432ms");
      }
    });
  });
});
