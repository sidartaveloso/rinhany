import type { BaseResultado } from "@rinhany/core";
import type { AlgoritmoOrdenacao } from "./algoritmos.js";
import type { DatasetOrdenacao } from "./datasets.js";

type MetricasOrdenacao = {
  readonly correto: boolean;
  readonly comparacoes: number;
};

export type ResultadoOrdenacao = BaseResultado<number[], MetricasOrdenacao>;

const bubbleSort = (
  arr: number[],
  config: AlgoritmoOrdenacao["configuracao"],
): { saida: number[]; comparacoes: number } => {
  const a = [...arr];
  let comparacoes = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparacoes++;
      if (config.comparar(a[j] as number, a[j + 1] as number) > 0) {
        [a[j], a[j + 1]] = [a[j + 1] as number, a[j] as number];
      }
    }
  }
  return { saida: a, comparacoes };
};

const selectionSort = (
  arr: number[],
  config: AlgoritmoOrdenacao["configuracao"],
): { saida: number[]; comparacoes: number } => {
  const a = [...arr];
  let comparacoes = 0;
  for (let i = 0; i < a.length; i++) {
    let menorIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparacoes++;
      if (config.comparar(a[j] as number, a[menorIdx] as number) < 0) menorIdx = j;
    }
    if (menorIdx !== i) [a[i], a[menorIdx]] = [a[menorIdx] as number, a[i] as number];
  }
  return { saida: a, comparacoes: comparacoes };
};

const mergeSort = (
  arr: number[],
  config: AlgoritmoOrdenacao["configuracao"],
): { saida: number[]; comparacoes: number } => {
  let comparacoes = 0;

  const merge = (esquerda: number[], direita: number[]): number[] => {
    const resultado: number[] = [];
    let i = 0,
      j = 0;
    while (i < esquerda.length && j < direita.length) {
      comparacoes++;
      if (config.comparar(esquerda[i] as number, direita[j] as number) <= 0) {
        resultado.push(esquerda[i++] as number);
      } else {
        resultado.push(direita[j++] as number);
      }
    }
    return [...resultado, ...esquerda.slice(i), ...direita.slice(j)];
  };

  const ordenar = (a: number[]): number[] => {
    if (a.length <= 1) return a;
    const meio = Math.floor(a.length / 2);
    return merge(ordenar(a.slice(0, meio)), ordenar(a.slice(meio)));
  };

  return { saida: ordenar([...arr]), comparacoes };
};

const quickSort = (
  arr: number[],
  config: AlgoritmoOrdenacao["configuracao"],
): { saida: number[]; comparacoes: number } => {
  let comparacoes = 0;

  const ordenar = (a: number[]): number[] => {
    if (a.length <= 1) return a;
    const pivo = a[Math.floor(a.length / 2)] as number;
    const menores: number[] = [];
    const iguais: number[] = [];
    const maiores: number[] = [];
    for (const x of a) {
      comparacoes++;
      const cmp = config.comparar(x, pivo);
      if (cmp < 0) menores.push(x);
      else if (cmp === 0) iguais.push(x);
      else maiores.push(x);
    }
    return [...ordenar(menores), ...iguais, ...ordenar(maiores)];
  };

  return { saida: ordenar([...arr]), comparacoes };
};

const implementacoes: Record<
  string,
  (
    arr: number[],
    config: AlgoritmoOrdenacao["configuracao"],
  ) => { saida: number[]; comparacoes: number }
> = {
  "bubble-sort": bubbleSort,
  "selection-sort": selectionSort,
  "merge-sort": mergeSort,
  "quick-sort": quickSort,
};

const estaOrdenado = (arr: number[]): boolean =>
  arr.every((v, i) => i === 0 || (arr[i - 1] as number) <= v);

export const runnerOrdenacao = async (
  algoritmo: AlgoritmoOrdenacao,
  dataset: DatasetOrdenacao,
): Promise<ResultadoOrdenacao> => {
  const impl = implementacoes[algoritmo.id as string];
  if (!impl) throw new Error(`Implementação não encontrada: ${algoritmo.id}`);

  const inicio = performance.now();
  const { saida, comparacoes } = impl(dataset.dados, algoritmo.configuracao);
  const tempo_execucao_ms = performance.now() - inicio;

  return {
    algoritmo_id: algoritmo.id,
    dataset_id: dataset.id,
    saida,
    metricas: {
      correto: estaOrdenado(saida),
      comparacoes,
    },
    tempo_execucao_ms,
    timestamp: new Date(),
  };
};
