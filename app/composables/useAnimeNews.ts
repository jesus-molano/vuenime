import type { NewsItem } from '~~/shared/types'

export const useAnimeNews = (animeId: Ref<string | number> | ComputedRef<string | number>) => {
  const { data: news, isLoading, error, refresh } = useLazyAnimeData<NewsItem>(animeId, 'news')

  return {
    news,
    isLoading,
    error,
    refresh,
  }
}
