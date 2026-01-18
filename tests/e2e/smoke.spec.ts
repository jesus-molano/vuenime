import { expect, test } from '@nuxt/test-utils/playwright'

/**
 * Smoke tests - Basic checks that the app works
 * These are lightweight tests that verify core functionality
 */
test.describe('Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Logo visible
    await expect(page.locator('text=VueNime').first()).toBeVisible()
  })

  test('favorites page loads', async ({ page }) => {
    await page.goto('/favorites')
    await page.waitForLoadState('domcontentloaded')

    // Page renders without error
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('anime detail page loads', async ({ page }) => {
    await page.goto('/anime/20')
    await page.waitForLoadState('domcontentloaded')

    // Title should be visible
    const heading = page.locator('h1')
    await expect(heading.first()).toBeVisible()
  })

  test('Spanish locale works', async ({ page }) => {
    await page.goto('/es')
    await page.waitForLoadState('domcontentloaded')

    // URL should have /es
    expect(page.url()).toContain('/es')
  })

  test('search modal opens', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    // Press Ctrl+K
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(500)

    // Modal should appear
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog.first()).toBeVisible()
  })
})
