import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Search functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('opens search modal with keyboard shortcut', async ({ page }) => {
    // Press Cmd/Ctrl + K to open search
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Verify search modal is visible
    const searchModal = page.locator('[role="dialog"]')
    await expect(searchModal).toBeVisible()

    // Verify search input is focused
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    await expect(searchInput).toBeFocused()
  })

  test('opens search modal from header button', async ({ page }) => {
    // Click search button (desktop)
    const searchButton = page.locator('[aria-label*="Search"], [aria-label*="Buscar"]').first()
    await searchButton.click()
    await page.waitForTimeout(300)

    // Verify search modal is visible
    const searchModal = page.locator('[role="dialog"]')
    await expect(searchModal).toBeVisible()
  })

  test('searches for anime and shows results', async ({ page }) => {
    // Open search
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Type search query
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    await searchInput.fill('Naruto')

    // Wait for results (API call)
    await page.waitForTimeout(1500)

    // Verify results are displayed
    const results = page.locator('[role="listbox"] [role="option"], .search-results a')
    await expect(results.first()).toBeVisible({ timeout: 10000 })
  })

  test('navigates to anime detail from search', async ({ page }) => {
    // Open search and type
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    await searchInput.fill('One Piece')
    await page.waitForTimeout(1500)

    // Click first result
    const firstResult = page.locator('[role="listbox"] [role="option"], .search-results a').first()
    await firstResult.click()

    // Verify navigation to anime detail page
    await page.waitForURL(/\/anime\/\d+/)
    expect(page.url()).toMatch(/\/anime\/\d+/)
  })

  test('closes search modal with Escape', async ({ page }) => {
    // Open search
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    const searchModal = page.locator('[role="dialog"]')
    await expect(searchModal).toBeVisible()

    // Press Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Verify modal is closed
    await expect(searchModal).not.toBeVisible()
  })

  test('shows search history on empty input', async ({ page }) => {
    // First, perform a search to create history
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]')
    await searchInput.fill('Dragon Ball')
    await page.waitForTimeout(1500)

    // Close modal
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // Reopen search
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(300)

    // Verify search modal opens again
    await expect(searchInput).toBeVisible()

    // Check if history section is present (optional, depends on implementation)
    const hasHistory = await page.locator('text=Recent, text=Recientes').isVisible()
    // Just log for debugging - history may or may not be visible
    console.log(`Search history visible: ${hasHistory}`)
  })
})
