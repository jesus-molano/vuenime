import type { AnimeDetailResponse } from '~~/shared/types'

export const useAnimeDetail = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error, refresh } = useFetch<AnimeDetailResponse>(
    () => `/api/jikan/anime/${animeId.value}`,
    {
      key: () => `anime-detail-${animeId.value}`,
    }
  )

  const anime = computed(() => data.value?.data)
  const isLoading = computed(() => status.value === 'pending')

  return {
    anime,
    isLoading,
    error,
    refresh,
  }
}
