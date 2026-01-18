import type { LocaleCode } from '~/stores/preferences'
import type { Ref } from 'vue'

interface I18nInstance {
  locale: Ref<string>
  setLocale: (locale: string) => Promise<void>
}

/**
 * Consolidated plugin for initializing stores and syncing state on app mount.
 * Combines: sync-favorites, sync-watched, sync-preferences
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    // Initialize stores that need Supabase sync
    const favoritesStore = useFavoritesStore()
    const watchedStore = useWatchedStore()
    const preferencesStore = usePreferencesStore()

    // Initialize favorites and watched stores in parallel
    // These fetch from Supabase if user is logged in
    await Promise.all([favoritesStore.initialize(), watchedStore.initialize()])

    // Sync i18n locale with preferences store
    const i18n = nuxtApp.$i18n as I18nInstance | undefined
    if (!i18n) return

    const currentLocale = i18n.locale.value

    // Sync the locale from the store with i18n only once at startup
    if (preferencesStore.locale && preferencesStore.locale !== currentLocale) {
      await i18n.setLocale(preferencesStore.locale)
    } else {
      // If no preference is saved, save the current locale of i18n
      preferencesStore.setLocale(currentLocale as LocaleCode)
    }
  })
})
