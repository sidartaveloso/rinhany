import type { BaseAlgoritmo, Brand } from "@rinhany/core";

type ConfigOrdenacao = {
  comparar: (a: number, b: number) => number;
};

export type AlgoritmoOrdenacao = BaseAlgoritmo<ConfigOrdenacao>;

const id = (s: string) => s as Brand<string, "AlgoritmoId">;

export const algoritmos: ReadonlyArray<AlgoritmoOrdenacao> = [
  {
    id: id("bubble-sort"),
    nome: "Bubble Sort",
    descricao: "Compara pares adjacentes repetidamente até ordenar",
    configuracao: {
      comparar: (a, b) => a - b,
    },
  },
  {
    id: id("selection-sort"),
    nome: "Selection Sort",
    descricao: "Seleciona o menor elemento e o coloca na posição correta",
    configuracao: {
      comparar: (a, b) => a - b,
    },
  },
  {
    id: id("merge-sort"),
    nome: "Merge Sort",
    descricao: "Divide e conquista — divide ao meio, ordena e mescla",
    configuracao: {
      comparar: (a, b) => a - b,
    },
  },
  {
    id: id("quick-sort"),
    nome: "Quick Sort",
    descricao: "Escolhe um pivô e particiona o array recursivamente",
    configuracao: {
      comparar: (a, b) => a - b,
    },
  },
];
