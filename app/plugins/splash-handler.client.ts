/**
 * Client plugin to handle splash screen hiding when Vue hydration completes.
 *
 * This is a bundled client plugin (no CSP issues) that:
 * 1. Blocks body scroll while splash is visible
 * 2. Uses 'app:suspense:resolve' hook to know when the app is ready
 * 3. Handles edge case where hydration already completed
 * 4. Has a fallback timeout for safety
 *
 * The splash HTML/CSS is injected by the Nitro plugin (splash-screen.ts)
 */
export default defineNuxtPlugin({
  name: 'splash-handler',
  enforce: 'pre', // Execute early
  setup(nuxtApp) {
    const splash = document.getElementById('splash-screen')
    if (!splash) return

    // Block scroll while splash is visible
    document.body.style.overflow = 'hidden'

    let hasHidden = false

    const hideSplash = () => {
      if (hasHidden) return
      hasHidden = true

      // Restore body scroll
      document.body.style.overflow = ''

      // Fade out animation
      splash.classList.add('hide')

      // Remove from DOM after animation
      setTimeout(() => {
        splash.remove()
        // Clean up splash styles from head
        document.getElementById('splash-styles')?.remove()
      }, 400)
    }

    // If hydration already finished (fast pre-rendered pages)
    if (!nuxtApp.isHydrating) {
      hideSplash()
      return
    }

    // Wait for suspense to resolve (recommended Nuxt pattern)
    nuxtApp.hook('app:suspense:resolve', hideSplash)

    // Fallback: 3 seconds maximum
    setTimeout(() => {
      if (splash.parentNode) hideSplash()
    }, 3000)
  },
})
