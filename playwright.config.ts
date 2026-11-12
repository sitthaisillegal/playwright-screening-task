import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // fail CI if someone leaves test.only in
  retries: process.env.CI ? 2 : 1,       // retries are needed for "trace on first retry" to ever trigger
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',             // record a trace only when a test is retried after failing
  },
  projects: [
    {
      // Two sites under test means two base URLs, so one Chromium project per site
      name: 'docs-site',
      testMatch: /docs\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'https://playwright.dev' },
    },
    {
      name: 'todomvc-app',
      testMatch: /todomvc\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'https://demo.playwright.dev' },
    },
  ],
});