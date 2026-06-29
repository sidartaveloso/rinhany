import { expect, test, vi } from "vitest";
import { defaultLogger } from "./DefaultLogger.js";

test("defaultLogger: tem todos os métodos de Logger", () => {
  expect(typeof defaultLogger.log).toBe("function");
  expect(typeof defaultLogger.error).toBe("function");
  expect(typeof defaultLogger.warn).toBe("function");
  expect(typeof defaultLogger.info).toBe("function");
  expect(typeof defaultLogger.debug).toBe("function");
});

test("defaultLogger: log delega para console.log", () => {
  const spy = vi.spyOn(console, "log").mockImplementation(() => {});
  defaultLogger.log("mensagem");
  expect(spy).toHaveBeenCalledWith("mensagem");
  spy.mockRestore();
});

test("defaultLogger: error delega para console.error", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  defaultLogger.error("erro");
  expect(spy).toHaveBeenCalledWith("erro");
  spy.mockRestore();
});
