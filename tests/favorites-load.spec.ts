import { test } from '@nuxt/test-utils/playwright'

test.describe('Favorites page load analysis', () => {
  test('capture screenshots at key moments', async ({ page }) => {
    // Ensure test-results directory exists
    const fs = await import('fs')
    if (!fs.existsSync('test-results')) {
      fs.mkdirSync('test-results', { recursive: true })
    }

    let screenshotIndex = 0
    const takeScreenshot = async (label: string) => {
      const filename = `test-results/fav-${String(screenshotIndex++).padStart(2, '0')}-${label}.png`
      await page.screenshot({ path: filename })
      console.log(`📸 ${filename}`)
    }

    // Navigate
    console.log('🚀 Navigating to /es/favorites...')
    await page.goto('/es/favorites', { waitUntil: 'commit' })
    await takeScreenshot('01-commit')

    await page.waitForLoadState('domcontentloaded')
    await takeScreenshot('02-dom-loaded')

    // Capture rapidly after DOM
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(100)
      await takeScreenshot(`03-hydration-${i * 100}ms`)
    }

    await page.waitForLoadState('networkidle')
    await takeScreenshot('04-network-idle')

    await page.waitForTimeout(1000)
    await takeScreenshot('05-final')

    // Log what we see
    const content = await page.content()
    const hasSkeletons = content.includes('animate-pulse')
    const hasEmptyState = content.includes('emptyTitle') || content.includes('Sin favoritos')
    const hasAnimeCards = content.includes('AnimeCard')

    console.log('\n📊 Final state:')
    console.log(`  - Has skeletons: ${hasSkeletons}`)
    console.log(`  - Has empty state: ${hasEmptyState}`)
    console.log(`  - Has anime cards: ${hasAnimeCards}`)

    // Check visible text
    const bodyText = await page.locator('body').textContent()
    console.log('\n📝 Visible text includes:')
    if (bodyText?.includes('Mis Favoritos')) console.log('  ✓ Title "Mis Favoritos"')
    if (bodyText?.includes('Sin favoritos')) console.log('  ✓ Empty state text')
    if (bodyText?.includes('anime guardados')) console.log('  ✓ Stats text')
  })

  test('visual timeline with rapid captures', async ({ page }) => {
    const timestamps: { time: number; label: string }[] = []
    const startTime = Date.now()
    let frameNum = 0

    // Navigate and capture frames as fast as possible
    void (async () => {
      while (frameNum < 30) {
        try {
          await page.screenshot({
            path: `test-results/timeline-${String(frameNum).padStart(3, '0')}.png`,
          })
          timestamps.push({ time: Date.now() - startTime, label: `frame-${frameNum}` })
          frameNum++
        } catch {
          // Page might be navigating
        }
        await page.waitForTimeout(50)
      }
    })()

    await page.goto('/es/favorites')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Stop capturing
    frameNum = 100

    console.log('\n🎬 Timeline:')
    timestamps.forEach((t) => {
      console.log(`  ${t.time}ms - ${t.label}`)
    })

    console.log(`\n📁 Screenshots saved to test-results/timeline-*.png`)
  })
})
