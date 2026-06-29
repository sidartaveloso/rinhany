import type { Brand, RelatorioRinha } from "@rinhany/core";

export type ConfigApresentador = {
  readonly resolverNome?: (id: Brand<string, "AlgoritmoId">) => string;
  readonly escrever?: (linha: string) => void;
};

export type Apresentador<TResultado, TMetricas> = {
  apresentar(relatorio: RelatorioRinha<TResultado, TMetricas>, config?: ConfigApresentador): void;
};
