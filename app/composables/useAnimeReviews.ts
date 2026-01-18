import type { Review } from '~~/shared/types'

export const useAnimeReviews = (animeId: Ref<string | number> | ComputedRef<string | number>) => {
  const { data: reviews, isLoading, error, refresh } = useLazyAnimeData<Review>(animeId, 'reviews')

  return {
    reviews,
    isLoading,
    error,
    refresh,
  }
}
