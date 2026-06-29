import type { Narrador } from "@rinhany/core";

export const narradorSilencioso: Narrador = {
  onRinhaIniciar: () => undefined,
  onRodadaIniciar: () => undefined,
  onExecucaoIniciar: () => undefined,
  onExecucaoFinalizar: () => undefined,
  onRodadaFinalizar: () => undefined,
  onRinhaFinalizar: () => undefined,
  onEventoLuta: () => undefined,
};
