# Contract Testing com TypeScript e Vitest

> **Filosofia:** Interface e contrato ficam juntos por coesão.
> **Padrão:** Interface-first, implementações testadas pelo contrato — sem listas hardcoded, sem inversão de dependência.

---

## Princípios Fundamentais

### Interface + Contrato = Coesão

A **interface** define _o que_ um serviço deve fazer.
O **contrato** define _como_ validar que a implementação faz o que prometeu.

**Ambos devem ficar juntos** porque:

- Alta coesão: definição e validação no mesmo lugar
- Single source of truth: uma única localização para a "verdade" sobre o comportamento
- Facilita revisões: ao modificar interface, o contrato está ao lado
- DRY: implementações não duplicam asserções de contrato

### O que NÃO fazer

- **Testes hardcoded:** `test.each([new ImplA(), new ImplB()])` — esquece de adicionar `ImplC`.
- **Inversão errada de dependência:** o pacote de types importa o pacote de implementações para rodar os testes.
- **Testes duplicados:** cada implementação repete as mesmas asserções de contrato.
- **Contrato em pacote separado:** colocar contrato em `test-utils/` afasta-o da interface, perdendo coesão.

---

## A solução

O pacote que abriga a interface **exporta a função de contrato** em um arquivo `.contract.ts`.
Cada implementação, em seu próprio pacote, **chama essa função** dentro do próprio `.test.ts`.
A dependência flui na direção correta.

```
core/src/types/                        ←   cli/src/theme/
  Theme.types.ts                              temaBoxe.ts
  Theme.contract.ts        ←                 temaBoxe.test.ts
      ↑                                  ←   cli/src/narrador/
  exporta createThemeSuite()                    narradorTerminal.ts
                                               narradorTerminal.test.ts
```

O arquivo `.contract.ts` fica junto dos `.types.ts` e **não é coletado** pelo Vitest —
nem pelo build do TypeScript. Ele é consumido diretamente pelo Vitest da implementação
via subpath export do `package.json`.

### Por que `.contract.ts` no pacote de types não causa problema

O arquivo é:

1. **Excluído do `tsconfig.json`** (`exclude: ["src/**/*.contract.ts"]`) — não vai para `dist/`.
2. **Excluído do `vitest.config.ts`** (`include: ["src/**/*.test.ts"]` não pega `.contract.ts`,
   e `exclude: ["src/**/*.contract.ts"]` garante isolamento da coleta e coverage).
3. **Não invoca** `describe/it` no escopo do módulo — apenas exporta a função `createThemeSuite`.
   Os `describe/it` só rodam quando a implementação chama a função no seu próprio `.test.ts`.

---

## Estrutura de pacotes (caso real: `RinhaTheme`)

```
packages/
  core/                                  ← abriga interface + contrato
    src/
      types/
        Theme.types.ts                   ← interface pública (RinhaTheme)
        Theme.contract.ts                ← função de contrato exportada (createThemeSuite)
        index.ts                         ← re-exporta apenas types (contrato nunca entra no barrel)
      index.ts
    package.json                         ← exports: "./contract" → src/types/Theme.contract.ts
    tsconfig.json                        ← exclude: src/**/*.contract.ts
    vitest.config.ts                     ← exclude: src/**/*.contract.ts (coleta + coverage)

  cli/                                    ← pacote de implementação
    src/
      theme/
        temaBoxe.ts                      ← implementação do tema
        temaBoxe.test.ts                 ← importa contrato + chama createThemeSuite() + testes específicos
    package.json
    tsconfig.json
    vitest.config.ts
```

### Convenções de nomenclature do projeto

| Elemento | Convenção | Exemplo |
|---|---|---|
| `*.types.ts` | PascalCase | `Theme.types.ts`, `Papeis.types.ts` |
| `*.contract.ts` | PascalCase | `Theme.contract.ts` |
| Classes / entidades | PascalCase | `Publico.ts`, `ExecutorRinha.ts` |
| Factories / módulos | camelCase | `temaBoxe.ts`, `criarRingue.ts` |
| `index.ts` (barrel) | lowercase | `index.ts` |
| Teste por arquivo | **espelha o source** | `temaBoxe.test.ts` ↔ `temaBoxe.ts` |
| Teste por módulo | nome da pasta em lowercase | `narrador.test.ts` (pasta `narrador/`) |

---

## Passo 1 — Interface

```typescript
// packages/core/src/types/Theme.types.ts

export type RinhaTheme = {
  readonly nome: string;
  readonly descricao: string;

  readonly descrever: (
    evento: EventoLuta,
    options?: { readonly resolverNome?: (id: string) => string },
  ) => string;

  iniciar?(ctx: ContextoRinha): ReadonlyArray<ComandoRenderizacao>;
  rodadaIniciar?(ctx: ContextoRodada): ReadonlyArray<ComandoRenderizacao>;
  eventoLuta?(
    evento: EventoLuta,
    options?: { readonly resolverNome?: (id: string) => string },
  ): ReadonlyArray<ComandoRenderizacao>;
  finalizar?(
    ctx: ContextoRinha & { readonly tempo_total_ms: number },
  ): ReadonlyArray<ComandoRenderizacao>;
};
```

O `index.ts` de types re-exporta apenas types — a função de contrato nunca passa pelo barrel:

```typescript
// packages/core/src/types/index.ts
export type { RinhaTheme, ComandoRenderizacao, CorCanvas, ... } from "./Theme.types.js";
```

---

## Passo 2 — tsconfig e vitest.config do pacote de types

O `tsconfig.json` exclui arquivos `.contract.ts` do build — eles não vão para `dist/`:

```jsonc
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.contract.ts", "dist"]
}
```

O `vitest.config.ts` exclui `.contract.ts` da coleta de testes e da coverage,
já que o contrato só roda quando invocado pela implementação:

```typescript
// packages/core/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.contract.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      exclude: ["src/**/*.contract.ts"],
    },
  },
});
```

---

## Passo 3 — Subpath export no package.json

O `exports` do pacote de types adiciona um subpath `"./contract"` apontando para o
source `.ts` diretamente. Em monorepo, os consumidores resolvem via source —
não há `.js` para esse arquivo:

```json
// packages/core/package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./contract": {
      "types": "./src/types/Theme.contract.ts",
      "import": "./src/types/Theme.contract.ts"
    }
  }
}
```

O subpath separado impede que `vitest` vaze como dependência transitiva
de quem só precisa dos types (importa de `"."`).

---

## Passo 4 — Arquivo de contrato

Nomeado `Theme.contract.ts` (PascalCase, alinhado com `Theme.types.ts`):
deixa claro que pertence ao universo de testes, mas **não é coletado** pelo Vitest.

A função exporta testes que validam o **formato** dos dados — não o comportamento
específico de nenhuma implementação. Hooks opcionais são testados com `if` dentro
do `it`, nunca com `if` no escopo do `describe` (o `tema` ainda não existe
na fase de definição dos testes):

```typescript
// packages/core/src/types/Theme.contract.ts

import { beforeEach, describe, expect, it } from "vitest";
import type { RinhaTheme } from "./Theme.types.js";
import type { ContextoRinha, ContextoRodada } from "./Papeis.types.js";
import type { EventoLuta } from "./Ringue.types.js";

// Fixtures reutilizadas pelos testes de contrato
const CtxRinha: ContextoRinha = { ... };
const CtxRodada: ContextoRodada = { ... };
const eventos: Record<string, EventoLuta> = { ... };

export type OpcoesCreateThemeSuite = {
  readonly descricaoBloco?: string;
};

/**
 * Função de contrato reutilizável para qualquer implementação de RinhaTheme.
 *
 * Deve ser chamada dentro de um arquivo .test.ts no pacote de implementação,
 * passando uma factory que retorna o tema concreto.
 *
 * Os describe/it só são registrados quando esta função é invocada —
 * nunca pelo simples fato de o arquivo existir no pacote de types.
 *
 * @example
 * // packages/cli/src/theme/temaBoxe.test.ts
 * import { createThemeSuite } from "@rinhany/core/contract";
 * import { temaBoxe } from "./temaBoxe.js";
 *
 * createThemeSuite(() => temaBoxe);
 */
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

    // Hooks opcionais: testa se existem e retornam comandos válidos.
    // O `if` fica DENTRO do `it` — tema ainda não existe no escopo do describe.
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

    // ... rodadaIniciar, eventoLuta, finalizar seguem o mesmo padrão
  });
};
```

### Detalhe técnico: `if` dentro do `it`, não no escopo do `describe`

Os hooks da interface são **opcionais** (`iniciar?`, `rodadaIniciar?`, etc.).
A tentação é fazer:

```typescript
// ❌ NÃO funciona — tema é undefined na fase de definição dos testes
if (tema.iniciar) {
  describe("iniciar", () => {
    it("retorna comandos", () => { ... });
  });
}
```

O `if` roda **durante a fase de definição** (antes de qualquer `beforeEach`),
quando `tema` ainda não foi atribuído. O correto é colocar o `if` dentro de cada `it`:

```typescript
// ✅ tema já foi atribuído pelo beforeEach antes do `it` rodar
describe("iniciar", () => {
  it("retorna array de comandos quando definido", () => {
    if (tema.iniciar) {
      const comandos = tema.iniciar(CtxRinha);
      expect(comandos.length).toBeGreaterThan(0);
    }
  });
});
```

Assim o `describe` sempre existe (pára organização do relatório), e o `if` roda
em runtime quando `tema` já está disponível.

---

## Passo 5 — Implementação e consumo do contrato

A implementação chama o contrato em **uma linha** e depois adiciona testes específicos:

```typescript
// packages/cli/src/theme/temaBoxe.test.ts

import type { Brand, EventoLuta } from "@rinhany/core";
import { createThemeSuite } from "@rinhany/core/contract";
import { describe, expect, it } from "vitest";
import { temaBoxe } from "./temaBoxe.js";

// Contrato — obrigatório para toda implementação de tema
createThemeSuite(() => temaBoxe);

// Comportamento específico de temaBoxe
describe("temaBoxe", () => {
  it("nome do tema é 'Boxe Clássico'", () => {
    expect(temaBoxe.nome).toBe("Boxe Clássico");
  });

  describe("descrever — texto específico", () => {
    it("golpe", () => {
      expect(temaBoxe.descrever(eventos.golpe)).toBe(
        "🥊 A acerta B com um cruzado de direita!",
      );
    });
    // ...
  });

  describe("iniciar", () => {
    it("retorna canvas com 80×50 pixels", () => {
      const comandos = temaBoxe.iniciar?.({ ... });
      expect(comandos?.[0]?.pixels.length).toBe(50);
      expect(comandos?.[0]?.pixels[0]?.length).toBe(80);
    });
  });
});
```

O output do Vitest ao rodar o pacote de implementação:

```
 ✓ temaBoxe.test.ts
    RinhaTheme — contrato
      ✓ nome é string não vazia
      ✓ descricao é string não vazia
      descrever
        ✓ golpe retorna string não vazia
        ✓ tonteou retorna string não vazia
        ...
      iniciar
        ✓ retoma array de comandos quando definido
        ✓ cada comando tem tipo válido
      ...

  temaBoxe
    ✓ nome do tema é 'Boxe Clássico'
    descrever — texto específico
      ✓ golpe
      ...
```

---

## Fluxo ao criar um novo tema

```
1. Dev cria meuTema.ts
   → compila normalmente, nada falha ainda

2. Dev cria meuTema.test.ts:
     import { createThemeSuite } from "@rinhany/core/contract";
     import { meuTema } from "./meuTema.js";
     createThemeSuite(() => meuTema);
   → todos os testes de contrato rodam automaticamente para o novo tema

3. Dev adiciona testes específicos abaixo da chamada do contrato:
     describe("meuTema — comportamento específico", () => { ... });
```

O compilador não exige exhaustiveness check para temas (a interface não tem
discriminated union de IDs conhecidos), mas o contrato garante que qualquer
implementação que passe nos testes está em conformidade com `RinhaTheme`.

---

## Variação: implementações com dependências (DI)

Se o construtor precisa de dependências, a factory encapsula a construção completa:

```typescript
import { createThemeSuite } from "@rinhany/core/contract";
import { MeuTema } from "./MeuTema.js";
import { DepX } from "./DepX.js";

createThemeSuite(() => new MeuTema(new DepX()));
```

Cada chamada de `factory()` dentro do `beforeEach` garante uma **instância fresca
e isolada** por teste — sem estado compartilhado entre casos.

---

## Resumo dos princípios

| Princípio             | Aplicação neste padrão                                                          |
| --------------------- | ------------------------------------------------------------------------------- |
| Dependency Inversion  | O pacote de types nunca importa o pacote de implementações                       |
| Open/Closed           | Novas implementações não alteram o `.contract.ts` nem os testes existentes       |
| Single Responsibility | Contrato = responsabilidade do pacote que abriga a interface                     |
| DRY                   | Asserções escritas uma vez, executadas em todas as implementações                |
| Coesão                | `Theme.types.ts` e `Theme.contract.ts` ficam no mesmo diretório                  |
| Isolamento de build   | `*.contract.ts` excluído do `tsconfig.json` e do `vitest.config.ts` do pacote de types |