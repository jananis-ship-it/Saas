import { test, expect } from "@playwright/test";

test("landing page has hero and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/ship work together/i);
  await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /sign in/i }).toBeVisible();
});

test("landing has pricing and FAQ", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/simple pricing/i)).toBeVisible();
  await expect(page.getByText(/frequently asked/i)).toBeVisible();
});
