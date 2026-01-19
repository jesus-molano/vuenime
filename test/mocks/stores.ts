import { vi } from 'vitest'
import { ref } from 'vue'
import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

/**
 * Mock favorites store for testing composables that depend on useFavoritesStore
 * Used by: useFavoriteToggle.test.ts
 */
export function createMockFavoritesStore(initialFavorites: FavoriteAnime[] = []) {
  const favorites = ref<FavoriteAnime[]>([...initialFavorites])

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

  return {
    favorites,
    isFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
