import type { Anime } from '~~/shared/types/anime'

export interface FavoriteAnime {
  mal_id: number
  title: string
  title_english?: string | null
  images: Anime['images']
  score?: number | null
  year?: number | null
  episodes?: number | null
  genres?: Anime['genres']
  airing?: boolean
  addedAt: number
}

// Tipo para añadir favoritos (campos mínimos requeridos)
export type AddFavoriteInput = Pick<Anime, 'mal_id' | 'title' | 'images'> & Partial<Pick<Anime, 'score' | 'year' | 'episodes' | 'genres' | 'airing' | 'title_english'>>

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteAnime[]>([])

  const favoritesCount = computed(() => favorites.value.length)

  const isFavorite = (malId: number) => {
    return favorites.value.some(fav => fav.mal_id === malId)
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
    const index = favorites.value.findIndex(fav => fav.mal_id === malId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  }

  const toggleFavorite = (anime: AddFavoriteInput) => {
    if (isFavorite(anime.mal_id)) {
      removeFavorite(anime.mal_id)
    }
    else {
      addFavorite(anime)
    }
  }

  const clearFavorites = () => {
    favorites.value = []
  }

  // Sort options
  const sortedFavorites = computed(() => {
    return [...favorites.value].sort((a, b) => b.addedAt - a.addedAt)
  })

  const sortFavoritesByScore = () => {
    return [...favorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  }

  const sortFavoritesByTitle = () => {
    return [...favorites.value].sort((a, b) => a.title.localeCompare(b.title))
  }

  return {
    favorites,
    favoritesCount,
    sortedFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    sortFavoritesByScore,
    sortFavoritesByTitle,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})
