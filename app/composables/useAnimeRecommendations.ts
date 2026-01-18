import type { Recommendation } from '~~/shared/types'

export const useAnimeRecommendations = (animeId: Ref<string | number> | ComputedRef<string | number>) => {
  const {
    data: recommendations,
    isLoading,
    error,
    refresh,
  } = useLazyAnimeData<Recommendation>(animeId, 'recommendations')

  return {
    recommendations,
    isLoading,
    error,
    refresh,
  }
}
