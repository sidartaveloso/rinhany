import type { Logger } from "../types/Logger.types.js";

export const defaultLogger: Logger = {
  log: (msg: string) => console.log(msg),
  error: (msg: string) => console.error(msg),
  warn: (msg: string) => console.warn(msg),
  info: (msg: string) => console.info(msg),
  debug: (msg: string) => console.debug(msg),
};
