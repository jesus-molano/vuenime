import type { AnimeStreamingResponse, StreamingLink } from '~~/shared/types'

export const useAnimeStreaming = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error, refresh } = useFetch<AnimeStreamingResponse>(
    () => `/api/jikan/anime/${animeId.value}/streaming`,
    {
      key: computed(() => `anime-streaming-${animeId.value}`),
      lazy: true,
      // Use cached data on client navigation to avoid refetching
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
    }
  )

  const streamingLinks = computed<StreamingLink[]>(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')
  const hasLinks = computed(() => streamingLinks.value.length > 0)

  return {
    streamingLinks,
    isLoading,
    hasLinks,
    error,
    refresh,
  }
}
