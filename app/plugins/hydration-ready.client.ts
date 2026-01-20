/**
 * Client plugin to emit 'nuxt:hydrated' event when Vue hydration completes.
 * This is used by the splash screen (injected via Nitro plugin) to know when to hide.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    // Emit custom event that the splash screen script listens to
    window.dispatchEvent(new CustomEvent('nuxt:hydrated'))
  })
})
