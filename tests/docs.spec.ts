import { test, expect } from '@playwright/test';

test.describe('playwright.dev docs site', () => {
  // Runs before every test in this block, so each test starts on the home page
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page title contains "Playwright"', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('"Get started" navigates to the intro docs', async ({ page }) => {
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });

  test('intro page shows the "Installation" heading', async ({ page }) => {
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('site search finds "locators"', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByPlaceholder('Search docs').fill('locators');
    await expect(page.getByRole('link', { name: /locators/i }).first()).toBeVisible();
  });
});