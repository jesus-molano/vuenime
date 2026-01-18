import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  testDir: './tests',
  // Run tests sequentially to avoid memory issues
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Limit workers to avoid overwhelming the system
  workers: 1,
  reporter: process.env.CI ? 'html' : 'list',
  // Shorter timeouts for faster feedback
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    trace: 'on-first-retry',
    // Reuse Nuxt instance across tests
    nuxt: {
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
    },
    // Headless by default
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
