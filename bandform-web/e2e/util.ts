import { Page, expect } from "@playwright/test";

// Seeded dev accounts (see backend DevDataSeeder). The login form authenticates
// on the username, and every seeded account shares this password.
export const SEED_PASSWORD = "Password123";
export const NORMAL_USER = "Nora Normal";
export const ADMIN_USER = "Alex Admin";

export async function login(page: Page, username: string, password = SEED_PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  // The Logout link only renders once authenticated.
  await expect(page.getByText("Logout")).toBeVisible();
}
