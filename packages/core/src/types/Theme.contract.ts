import { beforeEach, describe, expect, it } from "vitest";
import type { ContextoRinha, ContextoRodada } from "./Papeis.types.js";
import type { EventoLuta } from "./Ringue.types.js";
import type { Brand } from "./Rinha.types.js";
import type { RinhaTheme, TextoOverlay } from "./Theme.types.js";

const aid = (s: string) => s as Brand<string, "AlgoritmoId">;
const did = (s: string) => s as Brand<string, "DatasetId">;

const CtxRinha: ContextoRinha = {
  nome: "Rinha de Teste",
  total_algoritmos: 2,
  total_datasets: 1,
  total_rodadas: 2,
};

const CtxRodada: ContextoRodada = {
  rodada: 1,
  total_rodadas: 2,
  dataset_id: did("ds-1"),
  dataset_nome: "Dataset Um",
  total_algoritmos: 2,
};

const CtxRinhaFinalizada = { ...CtxRinha, tempo_total_ms: 1234 };

const CORES_VALIDAS: ReadonlySet<string> = new Set([
  "verde",
  "laranja",
  "branco",
  "preto",
  "cinza",
  "vermelho",
  "nenhuma",
]);

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
    ctx: { vencedor: aid("A"), perdedor: aid("B"), descricao: "A eliminou B" },
    timestamp_ms: 50,
  },
};

const validarComandoRenderizacao = (cmd: unknown, _caminho: string): void => {
  expect(cmd).toBeTypeOf("object");
  expect(cmd).not.toBeNull();
  const c = cmd as { tipo: string };

  switch (c.tipo) {
    case "texto": {
      const t = cmd as { conteudo: string };
      expect(typeof t.conteudo).toBe("string");
      break;
    }
    case "quadro": {
      const q = cmd as { linhas: ReadonlyArray<string> };
      expect(Array.isArray(q.linhas)).toBe(true);
      expect(q.linhas.length).toBeGreaterThan(0);
      break;
    }
    case "canvas": {
      const cv = cmd as {
        pixels: ReadonlyArray<ReadonlyArray<string>>;
        textos?: ReadonlyArray<TextoOverlay>;
      };
      expect(Array.isArray(cv.pixels)).toBe(true);
      expect(cv.pixels.length).toBeGreaterThan(0);
      for (const [, row] of cv.pixels.entries()) {
        expect(Array.isArray(row)).toBe(true);
        expect(row.length).toBeGreaterThan(0);
        for (const cor of row) {
          expect(CORES_VALIDAS.has(cor)).toBe(true);
        }
      }
      if (cv.textos) {
        for (const t2 of cv.textos) {
          expect(typeof t2.y).toBe("number");
          expect(typeof t2.x).toBe("number");
          expect(typeof t2.texto).toBe("string");
        }
      }
      break;
    }
    case "limpar":
      break;
    case "pausa": {
      const p = cmd as { duracao_ms: number };
      expect(typeof p.duracao_ms).toBe("number");
      expect(p.duracao_ms).toBeGreaterThan(0);
      break;
    }
    default:
      expect.unreachable(`Tipo de comando desconhecido: ${c.tipo}`);
  }
};

export type OpcoesCreateThemeSuite = {
  readonly descricaoBloco?: string;
};

export const createThemeSuite = (
  factory: () => RinhaTheme,
  opcoes?: OpcoesCreateThemeSuite,
): void => {
  const descricao = opcoes?.descricaoBloco ?? "RinhaTheme — contrato";

  describe(descricao, () => {
    let tema: RinhaTheme;

    beforeEach(() => {
      tema = factory();
    });

    it("nome é string não vazia", () => {
      expect(typeof tema.nome).toBe("string");
      expect(tema.nome.length).toBeGreaterThan(0);
    });

    it("descricao é string não vazia", () => {
      expect(typeof tema.descricao).toBe("string");
      expect(tema.descricao.length).toBeGreaterThan(0);
    });

    describe("descrever", () => {
      for (const [tipo, evento] of Object.entries(eventos)) {
        it(`${tipo} retorna string não vazia`, () => {
          const texto = tema.descrever(evento);
          expect(typeof texto).toBe("string");
          expect(texto.length).toBeGreaterThan(0);
        });
      }

      it("usa resolverNome quando fornecido", () => {
        const resolver = (id: string) => ({ A: "Alfa", B: "Bravo" })[id] ?? id;
        const texto = tema.descrever(eventos.golpe, { resolverNome: resolver });
        expect(texto).toContain("Alfa");
        expect(texto).toContain("Bravo");
      });
    });

    describe("iniciar", () => {
      it("retorna array de comandos quando definido", () => {
        if (tema.iniciar) {
          const comandos = tema.iniciar(CtxRinha);
          expect(Array.isArray(comandos)).toBe(true);
          expect(comandos.length).toBeGreaterThan(0);
        }
      });

      it("cada comando tem tipo válido", () => {
        if (tema.iniciar) {
          const comandos = tema.iniciar(CtxRinha);
          for (const [i, cmd] of comandos.entries()) {
            validarComandoRenderizacao(cmd, `iniciar[${i}]`);
          }
        }
      });
    });

    describe("rodadaIniciar", () => {
      it("retorna array de comandos quando definido", () => {
        if (tema.rodadaIniciar) {
          const comandos = tema.rodadaIniciar(CtxRodada);
          expect(Array.isArray(comandos)).toBe(true);
          expect(comandos.length).toBeGreaterThan(0);
        }
      });

      it("cada comando tem tipo válido", () => {
        if (tema.rodadaIniciar) {
          const comandos = tema.rodadaIniciar(CtxRodada);
          for (const [i, cmd] of comandos.entries()) {
            validarComandoRenderizacao(cmd, `rodadaIniciar[${i}]`);
          }
        }
      });
    });

    describe("eventoLuta", () => {
      for (const [tipo, evento] of Object.entries(eventos)) {
        it(`${tipo} retorna array de comandos quando definido`, () => {
          if (tema.eventoLuta) {
            const comandos = tema.eventoLuta(evento);
            expect(Array.isArray(comandos)).toBe(true);
            expect(comandos.length).toBeGreaterThan(0);
          }
        });
      }

      it("usa resolverNome quando fornecido", () => {
        if (tema.eventoLuta) {
          const resolver = (id: string) => ({ A: "Alfa", B: "Bravo" })[id] ?? id;
          const comandos = tema.eventoLuta(eventos.golpe, { resolverNome: resolver });
          expect(Array.isArray(comandos)).toBe(true);
          expect(comandos.length).toBeGreaterThan(0);
        }
      });

      it("cada comando tem tipo válido", () => {
        if (tema.eventoLuta) {
          const comandos = tema.eventoLuta(eventos.golpe);
          for (const [i, cmd] of comandos.entries()) {
            validarComandoRenderizacao(cmd, `eventoLuta[${i}]`);
          }
        }
      });
    });

    describe("finalizar", () => {
      it("retorna array de comandos quando definido", () => {
        if (tema.finalizar) {
          const comandos = tema.finalizar(CtxRinhaFinalizada);
          expect(Array.isArray(comandos)).toBe(true);
          expect(comandos.length).toBeGreaterThan(0);
        }
      });

      it("cada comando tem tipo válido", () => {
        if (tema.finalizar) {
          const comandos = tema.finalizar(CtxRinhaFinalizada);
          for (const [i, cmd] of comandos.entries()) {
            validarComandoRenderizacao(cmd, `finalizar[${i}]`);
          }
        }
      });
    });
  });
};
