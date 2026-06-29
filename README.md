<p align="center">
  <img src="./assets/rinhany-banner.png" alt="rinhany — motor genérico de rinha de algoritmos" />
</p>

---

# rinhany

> Toda rinha reinventa sua própria infraestrutura. **rinhany** é o motor genérico que falta.

Motor extensível para criar rinhas de algoritmos em TypeScript. Você traz o problema, os algoritmos e as métricas — rinhany cuida do ciclo de execução, dos rankings e da apresentação.

## Monorepo

Este repositório contém os seguintes pacotes:

| Pacote | npm | Descrição |
|---|---|---|
| `packages/rinhany` | `rinhany` | Meta-pacote que re-exporta tudo |
| `packages/core` | `@rinhany/core` | Engine: executor, ringue, types, juiz, logger |
| `packages/cli` | `@rinhany/cli` | UI de terminal: apresentador, narrador, publico, tema |
| `packages/testing` | `@rinhany/testing` | Utilities de teste: contract tests para `BaseAlgoritmo` |
| `examples/ordenacao` | — | Demo: rinha de algoritmos de ordenação |

## Instalação

```bash
pnpm add rinhany
```

**Requisitos:** Node.js ≥ 22, TypeScript ≥ 5.4.

## Uso básico

```typescript
import { criarExecutorRinha } from "rinhany";

const relatorio = await criarExecutorRinha({
  nome: "Rinha de Busca",
  datasets: [
    { id: "grande" as DatasetId, nome: "1 milhão de elementos", dados: gerarDados(1_000_000) },
  ],
  algoritmos: [
    { id: "linear"  as AlgoritmoId, nome: "Busca Linear",  impl: buscaLinear },
    { id: "binaria" as AlgoritmoId, nome: "Busca Binária", impl: buscaBinaria },
  ],
  runner: async (algoritmo, dataset) => {
    const inicio = performance.now();
    const resultado = algoritmo.impl(dataset.dados, alvo);
    return {
      algoritmo_id: algoritmo.id,
      dataset_id:   dataset.id,
      saida:        resultado,
      metricas:     { encontrado: resultado !== -1 },
      tempo_execucao_ms: performance.now() - inicio,
      timestamp:    new Date(),
    };
  },
  agregador: (resultados) => ({
    taxa_acerto: resultados.filter((r) => r.metricas.encontrado).length / resultados.length,
  }),
}).executar();
```

## Demo

```bash
pnpm demo:ordenacao
```

## Licença

MIT
