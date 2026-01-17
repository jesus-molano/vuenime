import type { AnimeStreamingResponse } from '~~/shared/types'

export const useAnimeStreaming = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error } = useFetch<AnimeStreamingResponse>(
    () => `/api/jikan/anime/${animeId.value}/streaming`,
    {
      key: () => `anime-streaming-${animeId.value}`,
      lazy: true,
    }
  )

  const streamingLinks = computed(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')
  const hasLinks = computed(() => streamingLinks.value.length > 0)

  return {
    streamingLinks,
    isLoading,
    hasLinks,
    error,
  }
}
