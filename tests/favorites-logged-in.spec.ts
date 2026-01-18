import { test } from '@nuxt/test-utils/playwright'

test.describe('Favorites page with logged in user', () => {
  test('capture load with authentication', async ({ page }) => {
    // First, go to home page and open auth modal
    console.log('🔐 Going to home page...')
    await page.goto('/es')
    await page.waitForLoadState('networkidle')

    // Debug: Screenshot to see the page
    await page.screenshot({ path: 'test-results/debug-home.png' })
    console.log('📸 Screenshot saved to debug-home.png')

    // Click the Sign In button specifically (has "Sign In" text visible)
    // The button has bg-rp-iris/10 styling and contains text "Sign In"
    const signInButton = page.locator('button:has-text("Sign In")').first()
    await signInButton.click()
    console.log('Clicked Sign In button')

    await page.waitForTimeout(500) // Wait for modal to open
    await page.screenshot({ path: 'test-results/debug-modal.png' })

    // Fill login form in the modal
    await page.fill('#auth-email', 'jessumolano@gmail.com')
    await page.fill('#auth-password', 'Jesus1995')

    // Click submit and wait for auth
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000) // Wait for auth

    console.log('✅ Logged in, navigating to favorites...')

    // Now test favorites page load
    const screenshots: string[] = []
    let idx = 0

    const capture = async (label: string) => {
      const path = `test-results/auth-fav-${String(idx++).padStart(2, '0')}-${label}.png`
      await page.screenshot({ path })
      screenshots.push(path)
      console.log(`📸 ${path}`)
    }

    // Navigate to favorites
    await page.goto('/es/favorites', { waitUntil: 'commit' })
    await capture('commit')

    await page.waitForLoadState('domcontentloaded')
    await capture('dom')

    // Rapid captures during hydration
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(100)
      await capture(`hydrate-${i * 100}ms`)
    }

    await page.waitForLoadState('networkidle')
    await capture('network-idle')

    await page.waitForTimeout(2000)
    await capture('final')

    // Check final state
    const bodyText = await page.textContent('body')
    console.log('\n📊 Final state:')
    console.log(`  - Has "anime guardados": ${bodyText?.includes('anime guardados')}`)
    console.log(`  - Has "Sin favoritos": ${bodyText?.includes('Sin favoritos')}`)

    // Count visible anime cards
    const cards = await page.locator('[data-testid="anime-card"]').count()
    const gridItems = await page.locator('.grid > a').count()
    console.log(`  - Anime cards: ${cards}`)
    console.log(`  - Grid links: ${gridItems}`)
  })
})
