import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.contract.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      exclude: ["src/**/*.contract.ts"],
    },
  },
});
