import type { EventoRinha, Ouvinte, Publico } from "@rinhany/core";

type PublicoMutavel = Publico & {
  adicionar(ouvinte: Ouvinte): void;
};

export const criarPublico = (): PublicoMutavel => {
  const _ouvintes: Ouvinte[] = [];

  const emitir = (evento: EventoRinha): void => {
    for (const ouvinte of _ouvintes) {
      try {
        ouvinte.onEvento(evento);
      } catch {}
    }
  };

  return {
    get ouvintes() {
      return _ouvintes as ReadonlyArray<Ouvinte>;
    },
    adicionar(ouvinte: Ouvinte) {
      _ouvintes.push(ouvinte);
    },
    emitir,
  };
};
