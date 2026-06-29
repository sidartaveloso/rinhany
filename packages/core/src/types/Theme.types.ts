import type { ContextoRinha, ContextoRodada } from "./Papeis.types.js";
import type { EventoLuta } from "./Ringue.types.js";

export type CorCanvas = "verde" | "laranja" | "branco" | "preto" | "cinza" | "vermelho" | "nenhuma";

export type ComandoTexto = {
  readonly tipo: "texto";
  readonly conteudo: string;
};

export type ComandoQuadro = {
  readonly tipo: "quadro";
  readonly linhas: ReadonlyArray<string>;
};

export type TextoOverlay = {
  readonly y: number;
  readonly x: number;
  readonly texto: string;
};

export type ComandoCanvas = {
  readonly tipo: "canvas";
  readonly pixels: ReadonlyArray<ReadonlyArray<CorCanvas>>;
  readonly textos?: ReadonlyArray<TextoOverlay>;
};

export type ComandoLimpar = {
  readonly tipo: "limpar";
};

export type ComandoPausa = {
  readonly tipo: "pausa";
  readonly duracao_ms: number;
};

export type ComandoRenderizacao =
  | ComandoTexto
  | ComandoQuadro
  | ComandoCanvas
  | ComandoLimpar
  | ComandoPausa;

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
