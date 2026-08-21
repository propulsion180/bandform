import { test, expect } from "@playwright/test";
import { login, NORMAL_USER, ADMIN_USER } from "./util";

// `exact: true` so "Admin" matches only the nav link, not the "Welcome, Alex
// Admin" greeting.
test("a normal user sees no Admin or Monitoring nav", async ({ page }) => {
  await login(page, NORMAL_USER);
  await expect(page.getByText("Admin", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Monitoring", { exact: true })).toHaveCount(0);
});

test("an admin sees the Admin and Monitoring nav", async ({ page }) => {
  await login(page, ADMIN_USER);
  await expect(page.getByText("Admin", { exact: true })).toBeVisible();
  await expect(page.getByText("Monitoring", { exact: true })).toBeVisible();
});
