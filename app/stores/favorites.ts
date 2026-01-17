import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

// Re-export types for backwards compatibility
export type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<FavoriteAnime[]>([])

    const favoritesCount = computed(() => favorites.value.length)

    const isFavorite = (malId: number) => {
      return favorites.value.some((fav) => fav.mal_id === malId)
    }

    const addFavorite = (anime: AddFavoriteInput) => {
      if (isFavorite(anime.mal_id)) return

      const favorite: FavoriteAnime = {
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        images: anime.images,
        score: anime.score,
        year: anime.year,
        episodes: anime.episodes,
        genres: anime.genres,
        airing: anime.airing,
        addedAt: Date.now(),
      }

      favorites.value.push(favorite)
    }

    const removeFavorite = (malId: number) => {
      const index = favorites.value.findIndex((fav) => fav.mal_id === malId)
      if (index !== -1) {
        favorites.value.splice(index, 1)
      }
    }

    const toggleFavorite = (anime: AddFavoriteInput) => {
      if (isFavorite(anime.mal_id)) {
        removeFavorite(anime.mal_id)
      } else {
        addFavorite(anime)
      }
    }

    const clearFavorites = () => {
      favorites.value = []
    }

    // Sort options - all as computeds for stable references
    const sortedByRecent = computed(() => {
      return [...favorites.value].sort((a, b) => b.addedAt - a.addedAt)
    })

    const sortedByScore = computed(() => {
      return [...favorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    })

    const sortedByTitle = computed(() => {
      return [...favorites.value].sort((a, b) => a.title.localeCompare(b.title))
    })

    // Alias for backwards compatibility
    const sortedFavorites = sortedByRecent

    return {
      favorites,
      favoritesCount,
      sortedFavorites,
      sortedByRecent,
      sortedByScore,
      sortedByTitle,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
)
