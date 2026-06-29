import type { BaseAlgoritmo } from "@rinhany/core";
import { beforeEach, describe, expect, it } from "vitest";

export type OpcoesTestarBaseAlgoritmo = {
  readonly descricaoBloco?: string;
};

export const testarBaseAlgoritmo = (
  // biome-ignore lint/suspicious/noExplicitAny: factory genérica — TConfig é irrelevante para o contrato base
  factory: () => BaseAlgoritmo<any>,
  opcoes?: OpcoesTestarBaseAlgoritmo,
): void => {
  const descricao = opcoes?.descricaoBloco ?? "BaseAlgoritmo — contrato";

  describe(descricao, () => {
    // biome-ignore lint/suspicious/noExplicitAny: idem
    let algoritmo: BaseAlgoritmo<any>;

    beforeEach(() => {
      algoritmo = factory();
    });

    it("tem id não vazio", () => {
      expect(typeof algoritmo.id).toBe("string");
      expect(algoritmo.id.length).toBeGreaterThan(0);
    });

    it("tem nome não vazio", () => {
      expect(typeof algoritmo.nome).toBe("string");
      expect(algoritmo.nome.length).toBeGreaterThan(0);
    });

    it("descricao é string quando definida", () => {
      if (algoritmo.descricao !== undefined) {
        expect(typeof algoritmo.descricao).toBe("string");
      }
    });

    it("versao é string quando definida", () => {
      if (algoritmo.versao !== undefined) {
        expect(typeof algoritmo.versao).toBe("string");
      }
    });

    it("autor é string quando definido", () => {
      if (algoritmo.autor !== undefined) {
        expect(typeof algoritmo.autor).toBe("string");
      }
    });

    it("tem configuracao definida", () => {
      expect(algoritmo.configuracao).toBeDefined();
    });
  });
};
