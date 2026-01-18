import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Navigation', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Logo should be visible
    const logo = page.locator('text=VueNime')
    await expect(logo.first()).toBeVisible({ timeout: 10000 })

    // Main sections should load
    const heroSection = page.locator('h1, [class*="hero"]')
    await expect(heroSection.first()).toBeVisible()
  })

  test('header navigation links work', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click Explore link
    const exploreLink = page.locator('nav a:has-text("Explore")')
    if (await exploreLink.isVisible()) {
      await exploreLink.click()
      await page.waitForURL('/')
    }

    // Click Favorites link
    const favoritesLink = page.locator('nav a:has-text("Favorites")')
    if (await favoritesLink.isVisible()) {
      await favoritesLink.click()
      await page.waitForURL('/favorites')
      expect(page.url()).toContain('/favorites')
    }
  })

  test('anime detail page loads correctly', async ({ page }) => {
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')

    // Anime title should be visible
    const animeTitle = page.locator('h1')
    await expect(animeTitle.first()).toBeVisible({ timeout: 10000 })

    // Synopsis section should exist
    const synopsisSection = page.locator('text=Synopsis, text=Sinopsis')
    await expect(synopsisSection.first()).toBeVisible()
  })

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist')

    // Should show error page or redirect
    // Check if we're on an error page or redirected to home
    const currentUrl = page.url()
    const isErrorOrRedirect =
      currentUrl.includes('error') || currentUrl === 'http://localhost:3000/' || currentUrl.endsWith('/')

    // Either shows error page or redirects - both are acceptable
    expect(isErrorOrRedirect || (await page.locator('text=404, text=not found').isVisible())).toBeTruthy()
  })

  test('back navigation works', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Navigate to favorites
    await page.goto('/favorites')
    await page.waitForLoadState('networkidle')

    // Go back
    await page.goBack()
    await page.waitForLoadState('networkidle')

    expect(page.url()).not.toContain('/favorites')
  })

  test('random anime button works', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Find random anime button
    const randomButton = page.locator('button:has-text("Random"), a:has-text("Random")')
    if (await randomButton.first().isVisible({ timeout: 5000 })) {
      await randomButton.first().click()
      await page.waitForTimeout(2000)

      // Should navigate to an anime detail page
      await page.waitForURL(/\/anime\/\d+/, { timeout: 10000 })
      expect(page.url()).toMatch(/\/anime\/\d+/)
    }
  })

  test('mobile navigation dock is visible on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Mobile dock should be visible
    const mobileDock = page.locator('[class*="MobileDock"], nav[class*="bottom"], [class*="dock"]')
    await expect(mobileDock.first()).toBeVisible({ timeout: 10000 })
  })

  test('desktop header is visible on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Header should be visible
    const header = page.locator('header')
    await expect(header.first()).toBeVisible()

    // Desktop navigation links should be visible
    const navLinks = page.locator('nav a')
    expect(await navLinks.count()).toBeGreaterThan(0)
  })
})
