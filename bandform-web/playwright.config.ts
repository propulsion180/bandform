import { defineConfig, devices } from "@playwright/test";

// End-to-end tests drive the real app in a browser. `webServer` auto-starts the
// esbuild dev server (:3000); the BACKEND must already be running on :8080 with
// the dev seeder (H2) so the seeded accounts (Nora Normal / Alex Admin, password
// "Password123") exist. See README / DEPLOYMENT for running the backend.
export default defineConfig({
  testDir: "./e2e",
  // Serial: the tests share one backend and the seeded accounts (whose lockout
  // counters are global state), so parallel workers would race on them.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
