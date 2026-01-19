import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility (A11y)', () => {
  test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('anime detail page should be accessible', async ({ page }) => {
    // Naruto (id: 20)
    await page.goto('/anime/20') 
    await page.waitForLoadState('networkidle')
    
    // Wait for content 
    await expect(page.locator('h1').first()).toBeVisible()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Exclude generic third-party iframes if any (like youtube embeds which might have issues out of our control)
      .exclude('iframe') 
      .analyze()

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('favorites page (empty) should be accessible', async ({ page }) => {
    await page.goto('/favorites')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('search modal should be accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Open modal
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(500)
    
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]') // Scan only the modal
      .analyze()

    if (accessibilityScanResults.violations.length > 0) {
      console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2))
    }
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
