# Começando

## Instalação

```bash
pnpm add rinhany
```

## Uso básico

```typescript
import { criarExecutorRinha } from "rinhany";

const relatorio = await criarExecutorRinha({
  nome: "Rinha de Busca",
  datasets: [
    { id: "grande", nome: "1M elementos", dados: gerarDados(1_000_000) },
  ],
  algoritmos: [
    { id: "linear",  nome: "Busca Linear",  impl: buscaLinear },
    { id: "binaria", nome: "Busca Binária", impl: buscaBinaria },
  ],
  runner: async (algoritmo, dataset) => {
    const inicio = performance.now();
    const resultado = algoritmo.impl(dataset.dados, alvo);
    return {
      algoritmo_id: algoritmo.id,
      dataset_id: dataset.id,
      saida: resultado,
      metricas: { encontrado: resultado !== -1 },
      tempo_execucao_ms: performance.now() - inicio,
      timestamp: new Date(),
    };
  },
  agregador: (resultados) => ({
    taxa_acerto: resultados.filter(r => r.metricas.encontrado).length
      / resultados.length,
  }),
}).executar();
```

## Demo

```bash
pnpm demo:ordenacao
```
