import type { Anime } from '~~/shared/types/anime'
import type { FavoriteAnime } from '~/stores/favorites'

/**
 * Composable for favorite button functionality with animation
 */
export function useFavoriteToggle(anime: Ref<Anime | FavoriteAnime> | ComputedRef<Anime | FavoriteAnime>) {
  const favoritesStore = useFavoritesStore()

  const isFavorite = computed(() => favoritesStore.isFavorite(anime.value.mal_id))
  const isAnimating = ref(false)

  const toggleFavorite = () => {
    isAnimating.value = true

    const animeData = anime.value
    favoritesStore.toggleFavorite({
      mal_id: animeData.mal_id,
      title: animeData.title,
      images: animeData.images,
      score: animeData.score,
      year: animeData.year,
      episodes: animeData.episodes,
      genres: animeData.genres,
      airing: animeData.airing,
    })

    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }

  return {
    isFavorite,
    isAnimating,
    toggleFavorite,
  }
}
