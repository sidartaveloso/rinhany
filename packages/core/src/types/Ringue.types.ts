import type { Brand } from "./Rinha.types.js";

export type EventoGolpe = {
  readonly tipo: "golpe";
  readonly ctx: {
    readonly agressor: Brand<string, "AlgoritmoId">;
    readonly vitima: Brand<string, "AlgoritmoId">;
    readonly intensidade: number;
    readonly descricao?: string;
  };
  readonly timestamp_ms: number;
};

export type EventoTonteou = {
  readonly tipo: "tonteou";
  readonly ctx: {
    readonly algoritmo: Brand<string, "AlgoritmoId">;
    readonly motivo: string;
  };
  readonly timestamp_ms: number;
};

export type EventoFoiPraLona = {
  readonly tipo: "foi-pra-lona";
  readonly ctx: {
    readonly algoritmo: Brand<string, "AlgoritmoId">;
    readonly motivo: string;
  };
  readonly timestamp_ms: number;
};

export type EventoRecuperou = {
  readonly tipo: "recuperou";
  readonly ctx: {
    readonly algoritmo: Brand<string, "AlgoritmoId">;
  };
  readonly timestamp_ms: number;
};

export type EventoNocaute = {
  readonly tipo: "nocaute";
  readonly ctx: {
    readonly vencedor: Brand<string, "AlgoritmoId">;
    readonly perdedor: Brand<string, "AlgoritmoId">;
    readonly descricao?: string;
  };
  readonly timestamp_ms: number;
};

export type EventoLuta =
  | EventoGolpe
  | EventoTonteou
  | EventoFoiPraLona
  | EventoRecuperou
  | EventoNocaute;

export type Ringue = {
  readonly emitir: (evento: EventoLuta) => void;
};

export type RingueComHistorico = Ringue & {
  readonly historico: ReadonlyArray<EventoLuta>;
};
