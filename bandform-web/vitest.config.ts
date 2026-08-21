import { defineConfig } from "vitest/config";

// Unit + component tests (jsdom). Playwright e2e specs live under e2e/ and are
// excluded here so `vitest run` doesn't try to execute them.
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["frontend/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
  },
});
