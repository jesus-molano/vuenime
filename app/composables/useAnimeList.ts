import type { AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'

export const useAnimeList = (page: number = PAGINATION.DEFAULT_PAGE) => {
  const { data: animeList, status, error, refresh } = useFetch<AnimeListResponse>(
    '/api/jikan/anime',
    {
      key: `anime-list-page-${page}`,
      query: { page, limit: PAGINATION.DEFAULT_LIMIT },
    }
  )

  const isLoading = computed(() => status.value === 'pending')

  return {
    animeList,
    isLoading,
    error,
    refresh,
  }
}