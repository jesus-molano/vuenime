import { defineStore } from 'pinia'

export type SortOption = 'recent' | 'score' | 'title'
export type LocaleCode = 'en' | 'es' | 'ja'

export interface PreferencesState {
  locale: LocaleCode
  favoritesSortBy: SortOption
}

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    // Estado
    const locale = ref<LocaleCode>('en')
    const favoritesSortBy = ref<SortOption>('recent')

    // Acciones
    const setLocale = (newLocale: LocaleCode) => {
      locale.value = newLocale
    }

    const setFavoritesSortBy = (sortBy: SortOption) => {
      favoritesSortBy.value = sortBy
    }

    return {
      locale,
      favoritesSortBy,
      setLocale,
      setFavoritesSortBy,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
)
