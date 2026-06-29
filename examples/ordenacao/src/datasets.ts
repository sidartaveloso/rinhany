import type { BaseDataset, Brand } from "@rinhany/core";

type MetadadosOrdenacao = {
  tamanho: number;
  descricao: string;
};

export type DatasetOrdenacao = BaseDataset<number[], MetadadosOrdenacao>;

const id = (s: string) => s as Brand<string, "DatasetId">;

const aleatorio = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n * 10));

const inversao = (n: number) => Array.from({ length: n }, (_, i) => n - i);

export const datasets: ReadonlyArray<DatasetOrdenacao> = [
  {
    id: id("pequeno-aleatorio"),
    nome: "Pequeno aleatório (100 elementos)",
    dados: aleatorio(100),
    metadados: { tamanho: 100, descricao: "Array pequeno com valores aleatórios" },
  },
  {
    id: id("medio-aleatorio"),
    nome: "Médio aleatório (1.000 elementos)",
    dados: aleatorio(1_000),
    metadados: { tamanho: 1_000, descricao: "Array médio com valores aleatórios" },
  },
  {
    id: id("grande-aleatorio"),
    nome: "Grande aleatório (10.000 elementos)",
    dados: aleatorio(10_000),
    metadados: { tamanho: 10_000, descricao: "Array grande com valores aleatórios" },
  },
  {
    id: id("grande-invertido"),
    nome: "Grande invertido (10.000 elementos)",
    dados: inversao(10_000),
    metadados: { tamanho: 10_000, descricao: "Pior caso para Bubble e Selection Sort" },
  },
];
