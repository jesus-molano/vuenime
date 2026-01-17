import type { Anime } from '~~/shared/types/anime'
import type { FavoriteAnime } from '~/stores/favorites'

/**
 * Composable for favorite button functionality with animation
 * @param anime - Reactive reference to the anime data
 * @param cardRef - Optional reference to the card element for remove animation
 */
export function useFavoriteToggle(
  anime: Ref<Anime | FavoriteAnime> | ComputedRef<Anime | FavoriteAnime>,
  cardRef?: Ref<HTMLElement | null> | ComputedRef<HTMLElement | null>
) {
  const favoritesStore = useFavoritesStore()

  const isFavorite = computed(() => favoritesStore.isFavorite(anime.value.mal_id))
  const isAnimating = ref(false)
  const isRemoving = ref(false)

  const toggleFavorite = async () => {
    isAnimating.value = true
    const animeData = anime.value
    const wasAlreadyFavorite = isFavorite.value

    // If removing and we have a card ref, animate first
    if (wasAlreadyFavorite && cardRef?.value) {
      isRemoving.value = true

      // Animate out the card
      const animation = cardRef.value.animate(
        [
          { opacity: 1, transform: 'scale(1) rotate(0deg)' },
          { opacity: 0, transform: 'scale(0.75) rotate(-5deg)' },
        ],
        {
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      )

      await animation.finished

      // Now remove from store
      favoritesStore.removeFavorite(animeData.mal_id)
      isRemoving.value = false
    } else {
      // Adding to favorites or no card ref - just toggle normally
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
    }

    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }

  return {
    isFavorite,
    isAnimating,
    isRemoving,
    toggleFavorite,
  }
}
