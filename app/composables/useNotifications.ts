/**
 * Notification composable using Nuxt UI's toast system
 *
 * Works both in Vue components and Pinia stores by using:
 * - runWithContext() for useToast() (needs inject context)
 * - $i18n directly from nuxtApp for translations
 */

type ToastColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

interface ToastOptions {
  title: string
  description?: string
  color?: ToastColor
  icon?: string
  duration?: number
}

/**
 * Get translation using $i18n from nuxtApp (works outside component context)
 */
function t(key: string, params?: Record<string, unknown>): string {
  try {
    const nuxtApp = useNuxtApp()
    // Access i18n directly from nuxtApp
    const i18n = nuxtApp.$i18n
    if (i18n && typeof i18n.t === 'function') {
      return i18n.t(key, params ?? {}) as string
    }
    return key
  } catch {
    return key
  }
}

/**
 * Show toast notification (works in stores via runWithContext)
 */
function showToast(options: ToastOptions) {
  try {
    const nuxtApp = useNuxtApp()
    nuxtApp.runWithContext(() => {
      const toast = useToast()
      toast.add({
        title: options.title,
        description: options.description,
        color: options.color ?? 'primary',
        icon: options.icon,
        duration: options.duration ?? 4000,
      })
    })
  } catch (e) {
    console.error('[useNotifications] Failed to show toast:', e)
  }
}

/**
 * Show persistent toast that stays until manually dismissed
 * Returns a function to dismiss the toast
 */
function showPersistentToast(options: Omit<ToastOptions, 'duration'>): () => void {
  let dismissFn = () => {}

  try {
    const nuxtApp = useNuxtApp()
    nuxtApp.runWithContext(() => {
      const toast = useToast()
      const toastInstance = toast.add({
        title: options.title,
        description: options.description,
        color: options.color ?? 'primary',
        icon: options.icon,
        duration: 0, // 0 = persistent
      })
      dismissFn = () => toast.remove(toastInstance.id)
    })
  } catch (e) {
    console.error('[useNotifications] Failed to show persistent toast:', e)
  }

  return dismissFn
}

export const useNotifications = () => {
  // ============================================
  // Generic notifications
  // ============================================

  const success = (title: string, description?: string) => {
    showToast({
      title,
      description,
      color: 'success',
      icon: 'i-heroicons-check-circle',
      duration: 4000,
    })
  }

  const error = (title: string, description?: string) => {
    showToast({
      title,
      description,
      color: 'error',
      icon: 'i-heroicons-x-circle',
      duration: 6000,
    })
  }

  const info = (title: string, description?: string) => {
    showToast({
      title,
      description,
      color: 'info',
      icon: 'i-heroicons-information-circle',
      duration: 4000,
    })
  }

  const loading = (title: string, description?: string) => {
    showToast({
      title,
      description,
      color: 'warning',
      icon: 'i-heroicons-sparkles',
      duration: 5000,
    })
  }

  // ============================================
  // Favorites notifications
  // ============================================

  const favoriteAdded = (animeTitle: string) => {
    success(t('notifications.favoriteAdded'), t('notifications.favoriteAddedDesc', { title: animeTitle }))
  }

  const favoriteRemoved = (animeTitle: string) => {
    success(t('notifications.favoriteRemoved'), t('notifications.favoriteRemovedDesc', { title: animeTitle }))
  }

  const favoriteError = () => {
    error(t('notifications.error'), t('notifications.favoriteErrorDesc'))
  }

  const clearFavoritesSuccess = () => {
    success(t('notifications.clearFavorites'), t('notifications.clearFavoritesDesc'))
  }

  // ============================================
  // Watched episodes notifications
  // ============================================

  const episodeMarkedWatched = (animeTitle: string, episodeNumber: number) => {
    success(
      t('notifications.episodeWatched'),
      t('notifications.episodeWatchedDesc', {
        title: animeTitle,
        episode: String(episodeNumber),
      })
    )
  }

  const episodeMarkedUnwatched = (animeTitle: string, episodeNumber: number) => {
    info(
      t('notifications.episodeUnwatched'),
      t('notifications.episodeUnwatchedDesc', {
        title: animeTitle,
        episode: String(episodeNumber),
      })
    )
  }

  const allEpisodesMarkedWatched = (animeTitle: string) => {
    success(t('notifications.allEpisodesWatched'), t('notifications.allEpisodesWatchedDesc', { title: animeTitle }))
  }

  const watchedCleared = (animeTitle: string) => {
    info(t('notifications.watchedCleared'), t('notifications.watchedClearedDesc', { title: animeTitle }))
  }

  const watchedError = () => {
    error(t('notifications.error'), t('notifications.watchedErrorDesc'))
  }

  // ============================================
  // Loading notifications
  // ============================================

  const loadingAnime = (): (() => void) => {
    return showPersistentToast({
      title: t('notifications.loading'),
      description: t('notifications.loadingAnimeDesc'),
      color: 'warning',
      icon: 'i-heroicons-sparkles',
    })
  }

  return {
    // Generic
    success,
    error,
    info,
    loading,
    // Favorites
    favoriteAdded,
    favoriteRemoved,
    favoriteError,
    clearFavoritesSuccess,
    // Watched
    episodeMarkedWatched,
    episodeMarkedUnwatched,
    allEpisodesMarkedWatched,
    watchedCleared,
    watchedError,
    // Loading
    loadingAnime,
  }
}
