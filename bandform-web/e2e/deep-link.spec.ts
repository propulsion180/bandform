import { test, expect } from "@playwright/test";

// Guards the esbuild dev server's `fallback: "index.html"` (and, in production,
// the reverse-proxy SPA fallback): a direct hit on a client-side route must
// serve the app rather than 404.

test("deep-linking /login serves the app", async ({ page }) => {
  const response = await page.goto("/login");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByLabel("Username")).toBeVisible();
});

test("deep-linking /signup serves the app", async ({ page }) => {
  const response = await page.goto("/signup");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
});
