import type { Juiz } from "../types/Papeis.types.js";

export const juizSilencioso: Juiz<unknown> = {
  julgar: () => new Map(),
};
