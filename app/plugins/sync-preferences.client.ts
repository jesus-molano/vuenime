import type { LocaleCode } from '~/stores/preferences'

export default defineNuxtPlugin((nuxtApp) => {
  // Esperar a que la app esté lista para acceder a i18n
  nuxtApp.hook('app:mounted', () => {
    const preferencesStore = usePreferencesStore()
    const i18n = nuxtApp.$i18n

    if (!i18n) return

    const currentLocale = i18n.locale.value

    // Sincronizar idioma del store con i18n una sola vez al inicio
    if (preferencesStore.locale && preferencesStore.locale !== currentLocale) {
      i18n.setLocale(preferencesStore.locale)
    }
    else {
      // Si no hay preferencia guardada, guardar el idioma actual de i18n
      preferencesStore.setLocale(currentLocale as LocaleCode)
    }
  })
})
