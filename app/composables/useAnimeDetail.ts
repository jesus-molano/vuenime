import type { AnimeDetailResponse, Anime } from '~~/shared/types'
import { createCachedData, markCacheFresh, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'

export const useAnimeDetail = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error, refresh } = useFetch<AnimeDetailResponse>(() => `/api/jikan/anime/${animeId.value}`, {
    key: computed(() => CACHE_KEYS.animeDetail(animeId.value)),
    lazy: true,
    // Cache for 1 hour - anime details rarely change
    getCachedData: createCachedData(CACHE_TTL.VERY_LONG),
  })

  const anime = computed<Anime | null>(() => data.value?.data ?? null)
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
const pendingPrefetch = new Map<string, ReturnType<typeof setTimeout>>()
const PREFETCH_DELAY = 400 // ms to wait before prefetching

export const prefetchAnimeDetail = (id: string | number) => {
  const animeId = String(id)
  const cacheKey = CACHE_KEYS.animeDetail(animeId)

  // Skip if already prefetched
  if (prefetchCache.has(cacheKey)) return

  // Skip if already in payload cache
  const nuxtApp = useNuxtApp()
  if (nuxtApp.payload.data[cacheKey]) return

  // Cancel any existing pending prefetch for this id
  if (pendingPrefetch.has(cacheKey)) return

  // Debounce: only prefetch after user hovers for PREFETCH_DELAY ms
  const timeoutId = setTimeout(async () => {
    pendingPrefetch.delete(cacheKey)
    prefetchCache.add(cacheKey)

    try {
      const data = await $fetch<AnimeDetailResponse>(`/api/jikan/anime/${animeId}`)
      // Store in nuxt payload so useFetch picks it up
      nuxtApp.payload.data[cacheKey] = data
      // Mark cache as fresh for TTL tracking
      markCacheFresh(cacheKey)
    } catch (error) {
      // Prefetch is best effort - log in dev mode for debugging
      prefetchCache.delete(cacheKey)
      if (import.meta.dev) {
        console.debug('[prefetch] Failed:', {
          animeId,
          error: error instanceof Error ? error.message : 'Unknown',
        })
      }
    }
  }, PREFETCH_DELAY)

  pendingPrefetch.set(cacheKey, timeoutId)
}

// Cancel prefetch when mouse leaves card
export const cancelPrefetchAnimeDetail = (id: string | number) => {
  const cacheKey = CACHE_KEYS.animeDetail(id)
  const timeoutId = pendingPrefetch.get(cacheKey)
  if (timeoutId) {
    clearTimeout(timeoutId)
    pendingPrefetch.delete(cacheKey)
  }
}
