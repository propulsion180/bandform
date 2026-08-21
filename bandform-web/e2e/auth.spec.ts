import { test, expect } from "@playwright/test";
import { login, NORMAL_USER } from "./util";

test("a user can log in and log out", async ({ page }) => {
  await login(page, NORMAL_USER);

  // Logged in: the app (not the login form) is showing.
  await expect(page.getByLabel("Password")).toHaveCount(0);

  await page.getByText("Logout").click();

  // Back to the signed-out state: a Login entry point is available again.
  await expect(page.getByText("Login").first()).toBeVisible();
  await expect(page.getByText("Logout")).toHaveCount(0);
});

test("bad credentials show an error and don't sign in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill(NORMAL_USER);
  await page.getByLabel("Password").fill("definitely-wrong");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Invalid username or password.")).toBeVisible();
  await expect(page.getByText("Logout")).toHaveCount(0);
});
