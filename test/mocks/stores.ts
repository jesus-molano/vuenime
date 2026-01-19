import { vi } from 'vitest'
import { ref, computed } from 'vue'
import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

/**
 * Mock favorites store for testing composables that depend on useFavoritesStore
 * Used by: useFavoriteToggle.test.ts, useFavoritesList.test.ts
 */
export function createMockFavoritesStore(initialFavorites: FavoriteAnime[] = []) {
  const favorites = ref<FavoriteAnime[]>([...initialFavorites])
  const isLoading = ref(false)

  const isFavorite = vi.fn((malId: number) => {
    return favorites.value.some((fav) => fav.mal_id === malId)
  })

  const removeFavorite = vi.fn(async (malId: number) => {
    const index = favorites.value.findIndex((fav) => fav.mal_id === malId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  })

  const toggleFavorite = vi.fn(async (anime: AddFavoriteInput) => {
    if (isFavorite(anime.mal_id)) {
      await removeFavorite(anime.mal_id)
    } else {
      const favorite: FavoriteAnime = {
        ...anime,
        addedAt: Date.now(),
      }
      favorites.value.push(favorite)
    }
  })

  const clearFavorites = vi.fn(() => {
    favorites.value = []
  })

  // Computed ref for storeToRefs compatibility
  const favoritesCount = computed(() => favorites.value.length)

  // Return object that works with both direct access and storeToRefs
  return {
    favorites,
    isLoading,
    isFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    // Computed ref (for storeToRefs to extract)
    favoritesCount,
    // Getters - accessed directly without storeToRefs (like Pinia getters)
    get sortedByRecent() {
      return [...favorites.value].sort((a, b) => b.addedAt - a.addedAt)
    },
    get sortedByScore() {
      return [...favorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    },
    get sortedByTitle() {
      return [...favorites.value].sort((a, b) => a.title.localeCompare(b.title))
    },
  }
}

/**
 * Mock preferences store for testing composables that depend on usePreferencesStore
 * Used by: useFavoritesList.test.ts
 */
export function createMockPreferencesStore(initialSortBy: 'recent' | 'score' | 'title' = 'recent') {
  const favoritesSortBy = ref(initialSortBy)

  return {
    favoritesSortBy,
  }
}
