# Criando Temas para a Rinhany

> Um **tema** controla como a rinha é renderizada no terminal.
> Este guia mostra como criar um tema do zero, testá-lo com o contrato,
> e plugá-lo na execução.

---

## O que é um tema

Um tema implementa a interface `RinhaTheme`, definida em `@rinhany/core`:

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

### Campos obrigatórios

| Campo | Tipo | Descrição |
|---|---|---|
| `nome` | `string` | Nome curto do tema (ex.: `"Boxe Clássico"`) |
| `descricao` | `string` | Descrição humana (ex.: `"Luta de boxe estilo Atari 2600"`) |
| `descrever` | `(evento, options?) => string` | Converte um `EventoLuta` em texto curto. Usado pelo executor ao sintetizar eventos e pelo narrador como fallback de `eventoLuta`. |

### Hooks opcionais (lifecycle)

Todos os hooks retornam `ReadonlyArray<ComandoRenderizacao>` — uma lista de comandos
de renderização que o narrador executa no terminal. Se um hook não for definido,
o narrador usa um comportamento padrão (banner ASCII, linha de texto, etc.).

| Hook | Quando é chamado | Contexto recebido |
|---|---|---|
| `iniciar` | Início da rinha | `ContextoRinha` (nome, totais) |
| `rodadaIniciar` | Início de cada rodada | `ContextoRodada` (número, dataset) |
| `eventoLuta` | Ocorre um evento de luta | `EventoLuta` + `resolverNome?` |
| `finalizar` | Fim da rinha | `ContextoRinha` + `tempo_total_ms` |

### Fallbacks quando um hook não existe

| Hook ausente | Comportamento padrão do narrador |
|---|---|
| `iniciar` | Banner ASCII com nome da rinha e totais |
| `rodadaIniciar` | `── Rodada X/Y: dataset ──` |
| `eventoLuta` (mas `tema` existe) | `tema.descrever(evento)` como texto |
| `finalizar` | `Batalha encerrada em Xms` |

---

## ComandoRenderizacao

Os hooks retornam arrays de comandos. Há 5 tipos:

### `texto` — uma linha de texto

```typescript
{ tipo: "texto", conteudo: "🥊 Round 1!" }
```

### `quadro` — múltiplas linhas (box)

```typescript
{ tipo: "quadro", linhas: ["╔══════╗", "║  KO  ║", "╚══════╝"] }
```

### `canvas` — grid de pixels com cores ANSI

```typescript
{
  tipo: "canvas",
  pixels: [
    ["verde", "verde", "laranja"],
    ["branco", "preto", "nenhuma"],
  ],
  textos: [              // opcional — overlay de texto em coordenadas
    { y: 0, x: 1, texto: "ROUND 1" },
  ],
}
```

Cores disponíveis (`CorCanvas`):

```
"verde" | "laranja" | "branco" | "preto" | "cinza" | "vermelho" | "nenhuma"
```

Cada cor vira um background ANSI de 2 espaços no terminal. O `canvas` é a
forma mais rico de renderizar — permite pixel art, arenas, sprites animados.

### `limpar` — limpa a tela (no-op atualmente)

```typescript
{ tipo: "limpar" }
```

### `pausa` — busy-wait por N ms (controle de ritmo da animação)

```typescript
{ tipo: "pausa", duracao_ms: 600 }
```

---

## EventoLuta — o que o tema precisa descrever

O `descrever` e `eventoLuta` recebem um `EventoLuta`, que é uma discriminated
union com 5 variantes:

```typescript
type EventoLuta =
  | { tipo: "golpe";        ctx: { agressor, vitima, intensidade }; timestamp_ms }
  | { tipo: "tonteou";      ctx: { algoritmo, motivo };              timestamp_ms }
  | { tipo: "foi-pra-lona"; ctx: { algoritmo, motivo };              timestamp_ms }
  | { tipo: "recuperou";    ctx: { algoritmo };                      timestamp_ms }
  | { tipo: "nocaute";      ctx: { vencedor, perdedor, descricao? }; timestamp_ms }
```

Os IDs (`agressor`, `vitima`, etc.) são `Brand<string, "AlgoritmoId">` — strings
marcadas. O `resolverNome` opcional converte IDs em nomes legíveis.

---

## Passo a passo: criando um tema

### 1. Criar o arquivo do tema

Convenção do projeto: **camelCase** para factories/módulos funcionais.

```
packages/cli/src/theme/temaCapoeira.ts
```

### 2. Implementar a interface

```typescript
// packages/cli/src/theme/temaCapoeira.ts

import type {
  ComandoRenderizacao,
  EventoLuta,
  RinhaTheme,
} from "@rinhany/core";

const descreverEvento = (
  evento: EventoLuta,
  options?: { readonly resolverNome?: (id: string) => string },
): string => {
  const r = options?.resolverNome ?? ((id: string) => id);
  switch (evento.tipo) {
    case "golpe":
      return `🥊 ${r(evento.ctx.agressor)} acerta ${r(evento.ctx.vitima)}!`;
    case "tonteou":
      return `🎵 ${r(evento.ctx.algoritmo)} perdeu o ritmo!`;
    case "foi-pra-lona":
      return `🪘 ${r(evento.ctx.algoritmo)} caiu na roda!`;
    case "recuperou":
      return `🙌 ${r(evento.ctx.algoritmo)} voltou pro gingado!`;
    case "nocaute":
      return `🥊 NOCAUTE! ${r(evento.ctx.vencedor)} vence ${r(evento.ctx.perdedor)}!`;
  }
};

export const temaCapoeira: RinhaTheme = {
  nome: "Capoeira",
  descricao: "Roda de capoeira — ginga, berimbau e rasteira",

  descrever: descreverEvento,

  iniciar: (ctx) => [
    { tipo: "quadro", linhas: [
      `  🪘 ${ctx.nome.toUpperCase()}`,
      `  ${ctx.total_algoritmos} capoeiristas · ${ctx.total_rodadas} rodas`,
    ]},
    { tipo: "pausa", duracao_ms: 400 },
  ],

  // rodadaIniciar, eventoLuta, finalizar são opcionais.
  // Se omitir, o narrador usa fallback padrão.
};

// (void usado apenas para evitar "declared but never read" em alguns setups)
void temaCapoeira;
```

### 3. Criar o arquivo de teste

Convenção: **o teste espelha o source** (`temaCapoeira.test.ts` ↔ `temaCapoeira.ts`).

```typescript
// packages/cli/src/theme/temaCapoeira.test.ts

import { createThemeSuite } from "@rinhany/core/contract";
import { describe, expect, it } from "vitest";
import { temaCapoeira } from "./temaCapoeira.js";

// Contrato — valida conformidade com RinhaTheme (24 testes automáticos)
createThemeSuite(() => temaCapoeira, { descricaoBloco: "temaCapoeira — contrato" });

// Testes específicos do seu tema
describe("temaCapoeira — específico", () => {
  it("nome é 'Capoeira'", () => {
    expect(temaCapoeira.nome).toBe("Capoeira");
  });

  it("descrever golpe menciona agressor e vítima", () => {
    const texto = temaCapoeira.descrever({
      tipo: "golpe",
      ctx: { agressor: "A" as never, vitima: "B" as never, intensidade: 0.8 },
      timestamp_ms: 10,
    });
    expect(texto).toContain("A");
    expect(texto).toContain("B");
  });
});
```

### 4. Rodar os testes

```bash
pnpm --filter @rinhany/cli test
```

Output esperado:

```
 ✓ temaCapoeira.test.ts
    temaCapoeira — contrato
      ✓ nome é string não vazia
      ✓ descricao é string não vazia
      descrever
        ✓ golpe retorna string não vazia
        ✓ tonteou retorna string não vazia
        ...
      iniciar
        ✓ retorna array de comandos quando definido
        ✓ cada comando tem tipo válido
      ...

  temaCapoeira — específico
    ✓ nome é 'Capoeira'
    ✓ descrever golpe menciona agressor e vítima
```

Se algo estiver fora do contrato (canvas com cor inválida, pausa com
`duracao_ms <= 0`, `descrever` retornando string vazia), o teste de contrato
falha automaticamente — sem precisar escrever asserções manuais.

### 5. Exportar o tema (opcional)

Se quiser disponibilizar via pacote, adicione ao barrel:

```typescript
// packages/cli/src/index.ts
export { temaCapoeira } from "./theme/temaCapoeira.js";
```

### 6. Usar o tema na execução

O tema é passado em **dois lugares** ao montar a rinha:

```typescript
import { criarNarradorTerminal } from "@rinhany/cli";
import { criarExecutorRinha } from "@rinhany/core";
import { temaCapoeira } from "./temaCapoeira.js";

const narrador = criarNarradorTerminal({ tema: temaCapoeira, resolverNome });

await criarExecutorRinha({
  // ...
  tema: temaCapoeira,       // usado para descrever eventos sintetizados
  narrador,                 // usado para renderizar hooks do tema
  // ...
}).executar();
```

---

## Contrato de teste

O contrato está em `packages/core/src/types/Theme.contract.ts` e é exportado
via `@rinhany/core/contract`. Ele valida automaticamente:

| O que valida | Como |
|---|---|
| `nome` e `descricao` | Strings não vazias |
| `descrever` para os 5 tipos de evento | Retorna string não vazia |
| `descrever` com `resolverNome` | Usa o resolver para traduzir IDs |
| Hooks opcionais (se definidos) | Retornam array não vazio de comandos válidos |
| `ComandoCanvas` | `pixels` é array 2D não vazio, cores válidas, `textos` com x/y/texto |
| `ComandoPausa` | `duracao_ms > 0` |
| `ComandoTexto` | `conteudo` é string |
| `ComandoQuadro` | `linhas` é array não vazio de strings |

O contrato **não** testa comportamento específico (sprites, cores escolhidas,
texto exibido). Para isso, escreva testes próprios após a chamada do contrato.

Veja [`CONTRACT-TESTING-GUIDE.md`](./CONTRACT-TESTING-GUIDE.md) para detalhes
do padrão de contract testing no projeto.

---

## Prompt template para IA

Use este prompt para pedir a uma IA (ou a si mesmo) que crie um tema novo.
Preencha os campos entre colchetes:

```text
Crie um tema para a Rinhany chamado "[NOME DO TEMA]" com a vibe de [DESCRIÇÃO/REFERÊNCIA].

Requisitos:

1. O tema deve implementar a interface RinhaTheme de @rinhany/core.
2. Crie o arquivo em packages/cli/src/theme/[nomeTema].ts (camelCase).
3. Crie o teste em packages/cli/src/theme/[nomeTema].test.ts que:
   - Chame createThemeSuite(() => meuTema) de "@rinhany/core/contract"
   - Adicione testes específicos abaixo da chamada do contrato
4. Implemente OBRIGATORIAMENTE:
   - nome: string curta
   - descricao: string humana
   - descrever: switch sobre os 5 tipos de EventoLuta (golpe, tonteou, foi-pra-lona, recuperou, nocaute),
     usando options.resolverNome quando fornecido.
5. Implemente OPCIONALMENTE os hooks que fizerem sentido para a vibe:
   - iniciar(ctx: ContextoRinha): ComandoRenderizacao[]
   - rodadaIniciar(ctx: ContextoRodada): ComandoRenderizacao[]
   - eventoLuta(evento, options?): ComandoRenderizacao[]
   - finalizar(ctx + tempo_total_ms): ComandoRenderizacao[]
   Use { tipo: "canvas", pixels, textos } para pixel art,
   { tipo: "quadro", linhas } para boxes ASCII,
   { tipo: "texto", conteudo } para linhas simples,
   { tipo: "pausa", duracao_ms } para controlar o ritmo da animação.
   Cores válidas: verde, laranja, branco, preto, cinza, vermelho, nenhuma.
6. O tema deve passar em todos os testes do contrato (createThemeSuite).
7. Useρα snake_case nos IDs de algoritmo mas mantenha o resolverNome.

Referência de tema completo: packages/cli/src/theme/temaBoxe.ts
Referência de teste: packages/cli/src/theme/temaBoxe.test.ts

Vibe visual: [DESCREVA A ESTÉTICA — ex: "8-bit wrestling", "pixel art medieval",
  "minimalista com apenas texto e quadros ASCII", "cyberpunk neon", etc.]
```

### Exemplo de prompt preenchido

```text
Crie um tema para a Rinhany chamado "Sumô Digital" com a vibe de luta de sumô
em pixel art verde-e-branco estilo Game Boy.

Requisitos:
1. Implemente RinhaTheme de @rinhany/core.
2. Arquivo: packages/cli/src/theme/temaSumo.ts
3. Teste: packages/cli/src/theme/temaSumo.test.ts com createThemeSuite + testes específicos.
4. descrever: "title="sumô"" — golpe = "angular slap", nocaute = "FORA DO TATAME!",
   tonteou = "perdeu o equilíbrio", etc.

5. Hooks:
   - iniciar: canvas 80x50 com tatame circular verde, dois lutadores brancos (8x9 sprites).
             Texto overlay com nome da rinha em maiúsculas. Pausa 500ms.
   - rodadaIniciar: canvas com "ROUND X/Y" + nome do dataset. Pausa 300ms.
   - eventoLuta: canvas refletindo o estado (golpe = um lutador "socando",
                 nocaute = perdedor caído no chão). Texto overlay com a descrição.
   - finalizar: canvas com "GRANDE CAMPEÃO" + tempo total. Pausa 2000ms.

6. Cores: use apenas "verde" (tatame), "branco" (lutadores), "preto" (sombra),
   "nenhuma" (fundo).

Vibe visual: Game Boy DMG (4 shades of green), lutadores circulares simples,
                 minimalista, sem emojis no canvas.
```

---

## Resumo

| Passo | O que fazer |
|---|---|
| 1 | Criar `[nomeTema].ts` em `packages/cli/src/theme/` |
| 2 | Implementar `nome`, `descricao`, `descrever` (obrigatório) + hooks (opcional) |
| 3 | Criar `[nomeTema].test.ts` chamando `createThemeSuite(() => tema)` |
| 4 | `pnpm --filter @rinhany/cli test` — contrato valida tudo |
| 5 | (Opcional) Exportar do `index.ts` do CLI |
| 6 | Passar `tema` para `criarNarradorTerminal` e `criarExecutorRinha` |

O contrato garante conformidade. A criatividade fica nos pixels.