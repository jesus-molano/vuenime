import type { LocaleCode } from '~/stores/preferences'
import type { Ref } from 'vue'
import type { Database } from '~~/shared/types/database'

interface I18nInstance {
  locale: Ref<string>
  setLocale: (locale: string) => Promise<void>
}

/**
 * Consolidated plugin for initializing stores and syncing state.
 *
 * Auth events:
 * - INITIAL_SESSION: First load - initialize with cached data or sync
 * - SIGNED_IN: New login - sync guest data to user account
 * - SIGNED_OUT: Logout - clear user data
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const supabase = useSupabaseClient<Database>()
  const favoritesStore = useFavoritesStore()
  const watchedStore = useWatchedStore()
  const preferencesStore = usePreferencesStore()

  // Validate session before setting up listeners - clears invalid tokens
  try {
    await supabase.auth.getSession()
  } catch {
    // Invalid refresh token - sign out to clear corrupted session data
    await supabase.auth.signOut({ scope: 'local' })
  }

  let currentUserId: string | null = null
  let initialized = false

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    const userId = session?.user?.id ?? null

    if (event === 'INITIAL_SESSION' && !initialized) {
      // First load - initialize stores (uses cache if available)
      currentUserId = userId
      initialized = true
      await Promise.all([favoritesStore.initialize(userId), watchedStore.initialize(userId)])
    } else if (event === 'SIGNED_IN' && userId && currentUserId !== userId) {
      // New sign in - sync local guest data to user account
      currentUserId = userId
      if (initialized) {
        await Promise.all([favoritesStore.handleSignIn(userId), watchedStore.handleSignIn(userId)])
      }
    } else if (event === 'SIGNED_OUT') {
      // Sign out - clear user data
      currentUserId = null
      favoritesStore.handleSignOut()
      watchedStore.handleSignOut()
    }
  })

  // Sync i18n on mount
  nuxtApp.hook('app:mounted', async () => {
    const i18n = nuxtApp.$i18n as I18nInstance | undefined
    if (!i18n) return

    const currentLocale = i18n.locale.value

    if (preferencesStore.locale && preferencesStore.locale !== currentLocale) {
      await i18n.setLocale(preferencesStore.locale)
    } else {
      preferencesStore.setLocale(currentLocale as LocaleCode)
    }
  })

  // Cleanup auth subscription on app unmount to prevent memory leaks
  nuxtApp.hook('app:beforeMount', () => {
    window.addEventListener('beforeunload', () => {
      subscription.unsubscribe()
    })
  })
})
