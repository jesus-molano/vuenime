interface ToastOptions {
  id?: string
  open?: boolean
  title: string
  description?: string
  color?: 'success' | 'error' | 'info' | 'warning'
  icon?: string
  duration?: number
}

// Direct toast function that works outside of component context
// Uses Nuxt's useState which doesn't require inject()
function addToast(options: ToastOptions) {
  const toasts = useState<ToastOptions[]>('toasts', () => [])
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const toast: ToastOptions = {
    id,
    open: true,
    ...options,
  }
  toasts.value = [...toasts.value, toast].slice(-5)
  return toast
}

export const useNotifications = () => {
  // Get i18n - try to use the composable, fallback to nuxt app
  const getTranslation = (key: string, params?: Record<string, string>) => {
    try {
      const { t } = useI18n()
      return t(key, params ?? {})
    } catch {
      // Fallback: try to get from nuxt app
      try {
        const nuxtApp = useNuxtApp()
        const i18n = nuxtApp.$i18n as { t: (key: string, params?: Record<string, string>) => string }
        return i18n.t(key, params ?? {})
      } catch {
        // Last resort: return key
        return key
      }
    }
  }

  const success = (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: 'success',
      icon: 'i-heroicons-check-circle',
      duration: 4000,
    })
  }

  const error = (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: 'error',
      icon: 'i-heroicons-x-circle',
      duration: 6000,
    })
  }

  const info = (title: string, description?: string) => {
    addToast({
      title,
      description,
      color: 'info',
      icon: 'i-heroicons-information-circle',
      duration: 4000,
    })
  }

  const favoriteAdded = (animeTitle: string) => {
    success(
      getTranslation('notifications.favoriteAdded'),
      getTranslation('notifications.favoriteAddedDesc', { title: animeTitle })
    )
  }

  const favoriteRemoved = (animeTitle: string) => {
    success(
      getTranslation('notifications.favoriteRemoved'),
      getTranslation('notifications.favoriteRemovedDesc', { title: animeTitle })
    )
  }

  const favoriteError = () => {
    error(getTranslation('notifications.error'), getTranslation('notifications.favoriteErrorDesc'))
  }

  const clearFavoritesSuccess = () => {
    success(getTranslation('notifications.clearFavorites'), getTranslation('notifications.clearFavoritesDesc'))
  }

  return {
    success,
    error,
    info,
    favoriteAdded,
    favoriteRemoved,
    favoriteError,
    clearFavoritesSuccess,
  }
}
