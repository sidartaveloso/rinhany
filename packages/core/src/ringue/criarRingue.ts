import type { EventoLuta, RingueComHistorico } from "../types/Ringue.types.js";

type ConfigRingue = {
  readonly onEvento?: (evento: EventoLuta) => void;
};

export const criarRingue = (config: ConfigRingue = {}): RingueComHistorico => {
  const _historico: EventoLuta[] = [];

  const emitir = (evento: EventoLuta): void => {
    _historico.push(evento);
    try {
      config.onEvento?.(evento);
    } catch {}
  };

  return {
    get historico(): ReadonlyArray<EventoLuta> {
      return Object.freeze([..._historico]);
    },
    emitir,
  };
};
