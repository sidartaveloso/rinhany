import type { Juiz } from "../types/Papeis.types.js";
import type { BaseResultado, Brand } from "../types/Rinha.types.js";

export const juizPadrao: Juiz<BaseResultado<unknown, unknown>> = {
  julgar(resultados) {
    const porAlgoritmo = new Map<Brand<string, "AlgoritmoId">, number[]>();

    for (const r of resultados) {
      if (r.erro) continue;
      if (!porAlgoritmo.has(r.algoritmo_id)) porAlgoritmo.set(r.algoritmo_id, []);
      porAlgoritmo.get(r.algoritmo_id)?.push(r.tempo_execucao_ms);
    }

    const ranking = Array.from(porAlgoritmo.entries())
      .map(([id, tempos]) => ({
        id,
        media: tempos.reduce((a, b) => a + b, 0) / tempos.length,
      }))
      .sort((a, b) => a.media - b.media)
      .map((x) => x.id);

    return new Map([["Velocidade (mais rápido)", ranking]]);
  },
};
