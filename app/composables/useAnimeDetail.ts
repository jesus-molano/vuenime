import type { AnimeDetailResponse } from '~~/shared/types'

export const useAnimeDetail = (id: Ref<string> | string) => {
  const animeId = toRef(id)
  const nuxtApp = useNuxtApp()

  const { data, status, error, refresh } = useFetch<AnimeDetailResponse>(() => `/api/jikan/anime/${animeId.value}`, {
    key: () => `anime-detail-${animeId.value}`,
    getCachedData: (key) => nuxtApp.payload.data[key] as AnimeDetailResponse | undefined,
  })

  const anime = computed(() => data.value?.data)
  const isLoading = computed(() => status.value === 'pending')

  return {
    anime,
    isLoading,
    error,
    refresh,
  }
}

// Prefetch anime detail data - call on hover to warm the cache
const prefetchCache = new Set<string>()

export const prefetchAnimeDetail = async (id: string | number) => {
  const animeId = String(id)
  const cacheKey = `anime-detail-${animeId}`

  // Skip if already prefetched or in nuxt data cache
  if (prefetchCache.has(cacheKey)) return

  const nuxtApp = useNuxtApp()

  // Check if already in payload cache
  if (nuxtApp.payload.data[cacheKey]) return

  prefetchCache.add(cacheKey)

  try {
    const data = await $fetch<AnimeDetailResponse>(`/api/jikan/anime/${animeId}`)
    // Store in nuxt payload so useFetch picks it up
    nuxtApp.payload.data[cacheKey] = data
  } catch {
    // Silently fail - prefetch is best effort
    prefetchCache.delete(cacheKey)
  }
}
