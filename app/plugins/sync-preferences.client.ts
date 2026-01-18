import type { LocaleCode } from '~/stores/preferences'
import type { Ref } from 'vue'

interface I18nInstance {
  locale: Ref<string>
  setLocale: (locale: string) => Promise<void>
}

export default defineNuxtPlugin((nuxtApp) => {
  // Wait for the app to be mounted to access i18n
  nuxtApp.hook('app:mounted', () => {
    const preferencesStore = usePreferencesStore()
    const i18n = nuxtApp.$i18n as I18nInstance | undefined

    if (!i18n) return

    const currentLocale = i18n.locale.value

    // Sync the locale from the store with i18n only once at startup
    if (preferencesStore.locale && preferencesStore.locale !== currentLocale) {
      i18n.setLocale(preferencesStore.locale)
    } else {
      // If no preference is saved, save the current locale of i18n
      preferencesStore.setLocale(currentLocale as LocaleCode)
    }
  })
})
