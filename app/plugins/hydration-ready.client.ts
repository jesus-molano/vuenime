/**
 * Client plugin to emit 'nuxt:hydrated' event when Vue hydration completes.
 * This is used by the splash screen (injected via Nitro plugin) to know when to hide.
 *
 * Uses 'app:mounted' instead of 'app:suspense:resolve' because:
 * - Pre-rendered pages may not have pending suspense boundaries
 * - 'app:mounted' fires reliably after Vue mounts, even on pre-rendered pages
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    // Emit custom event that the splash screen script listens to
    window.dispatchEvent(new CustomEvent('nuxt:hydrated'))
  })
})
