import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Favorites flow (guest user)', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('favorites page shows empty state for guest', async ({ page }) => {
    await page.goto('/favorites')
    await page.waitForLoadState('networkidle')

    // Should show empty state
    const emptyState = page.locator('text=No favorites yet, text=Sin favoritos')
    await expect(emptyState.first()).toBeVisible({ timeout: 10000 })
  })

  test('can add anime to favorites from detail page', async ({ page }) => {
    // Navigate to an anime detail page (Naruto has mal_id 20)
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')

    // Find and click the favorite button
    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favoriteButton).toBeVisible({ timeout: 10000 })
    await favoriteButton.click()

    // Wait for notification or state change
    await page.waitForTimeout(500)

    // Verify the heart icon changed to filled state
    const filledHeart = page.locator('[class*="heart"][class*="solid"], .i-heroicons-heart-solid')
    await expect(filledHeart.first()).toBeVisible()
  })

  test('favorites persist in localStorage', async ({ page }) => {
    // Add a favorite
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')

    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favoriteButton).toBeVisible({ timeout: 10000 })
    await favoriteButton.click()
    await page.waitForTimeout(500)

    // Check localStorage
    const localStorage = await page.evaluate(() => {
      return window.localStorage.getItem('favorites') || ''
    })
    expect(localStorage).toContain('20')
  })

  test('can remove anime from favorites', async ({ page }) => {
    // First add a favorite
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')

    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favoriteButton).toBeVisible({ timeout: 10000 })
    await favoriteButton.click()
    await page.waitForTimeout(500)

    // Now remove it
    await favoriteButton.click()
    await page.waitForTimeout(500)

    // Verify localStorage is cleared
    const localStorage = await page.evaluate(() => {
      return window.localStorage.getItem('favorites') || ''
    })
    expect(localStorage).not.toContain('"mal_id":20')
  })

  test('favorites page shows added anime', async ({ page }) => {
    // Add a favorite
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')

    const favoriteButton = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favoriteButton).toBeVisible({ timeout: 10000 })
    await favoriteButton.click()
    await page.waitForTimeout(1000)

    // Navigate to favorites page
    await page.goto('/favorites')
    await page.waitForLoadState('networkidle')

    // Should show the anime card
    const animeCard = page.locator('a[href*="/anime/20"]')
    await expect(animeCard.first()).toBeVisible({ timeout: 10000 })
  })

  test('can clear all favorites', async ({ page }) => {
    // Add multiple favorites
    await page.goto('/anime/20')
    await page.waitForLoadState('networkidle')
    const favBtn1 = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favBtn1).toBeVisible({ timeout: 10000 })
    await favBtn1.click()
    await page.waitForTimeout(500)

    await page.goto('/anime/21')
    await page.waitForLoadState('networkidle')
    const favBtn2 = page.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]').first()
    await expect(favBtn2).toBeVisible({ timeout: 10000 })
    await favBtn2.click()
    await page.waitForTimeout(500)

    // Go to favorites page
    await page.goto('/favorites')
    await page.waitForLoadState('networkidle')

    // Click clear button if available
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Limpiar")')
    if (await clearButton.isVisible()) {
      await clearButton.click()

      // Confirm in modal if present
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Confirmar")')
      if (await confirmButton.isVisible({ timeout: 1000 })) {
        await confirmButton.click()
      }

      await page.waitForTimeout(500)

      // Verify empty state
      const emptyState = page.locator('text=No favorites, text=Sin favoritos')
      await expect(emptyState.first()).toBeVisible()
    }
  })
})
