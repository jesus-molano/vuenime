import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 3, // 3 locally (API rate limit), 2 in CI
  reporter: process.env.CI ? 'html' : 'list',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: true,
  },
  // Build and start server once before all tests
  webServer: {
    command: 'bun run build && bun run preview',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
