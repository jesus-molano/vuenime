import type { AnimeDetailResponse, Anime } from '~~/shared/types'
import { createCachedData, markCacheFresh, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'

// Track in-flight requests to deduplicate between prefetch and useFetch
const inFlightRequests = new Map<string, Promise<AnimeDetailResponse>>()

/**
 * Deduplicated fetch - ensures only one request per cache key is in flight at a time.
 * Both prefetch and useAsyncData use this to share in-flight requests.
 */
function fetchAnimeDetail(animeId: string): Promise<AnimeDetailResponse> {
  const cacheKey = CACHE_KEYS.animeDetail(animeId)

  // Return existing in-flight request if any
  const existing = inFlightRequests.get(cacheKey)
  if (existing) return existing

  // Create new request and track it
  const promise = $fetch<AnimeDetailResponse>(`/api/jikan/anime/${animeId}`).finally(() => {
    inFlightRequests.delete(cacheKey)
  })

  inFlightRequests.set(cacheKey, promise)
  return promise
}

export const useAnimeDetail = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error, refresh } = useAsyncData<AnimeDetailResponse>(
    computed(() => CACHE_KEYS.animeDetail(animeId.value)),
    () => fetchAnimeDetail(animeId.value),
    {
      // Server: blocking fetch for SSR (data in HTML)
      // Client: non-blocking, uses prefetch cache or shows skeleton
      lazy: import.meta.client,
      // Cache for 1 hour - anime details rarely change
      getCachedData: createCachedData(CACHE_TTL.VERY_LONG),
    },
  )

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
// Use LRU-style cleanup to prevent unbounded growth
const prefetchCache = new Set<string>()
const pendingPrefetch = new Map<string, ReturnType<typeof setTimeout>>()
const PREFETCH_DELAY = 400 // ms to wait before prefetching
const MAX_PREFETCH_CACHE_SIZE = 50

// Cleanup old entries when cache grows too large
function cleanupPrefetchCache() {
  if (prefetchCache.size > MAX_PREFETCH_CACHE_SIZE) {
    const iterator = prefetchCache.values()
    // Remove oldest half of entries
    const toRemove = Math.floor(prefetchCache.size / 2)
    for (let i = 0; i < toRemove; i++) {
      const value = iterator.next().value
      if (value) prefetchCache.delete(value)
    }
  }
}

/**
 * Clear all pending prefetch timeouts
 * Called on page navigation to prevent stale prefetches
 */
export const clearAllPendingPrefetch = () => {
  pendingPrefetch.forEach((timeoutId) => clearTimeout(timeoutId))
  pendingPrefetch.clear()
}

// Register cleanup on page navigation (client-side only)
if (import.meta.client) {
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:start', clearAllPendingPrefetch)
}

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

    // Re-check cache - useAsyncData might have populated it during the delay
    if (nuxtApp.payload.data[cacheKey] || nuxtApp.static.data[cacheKey]) {
      return
    }

    prefetchCache.add(cacheKey)
    cleanupPrefetchCache()

    try {
      // Use shared fetchAnimeDetail to deduplicate with useAsyncData
      const data = await fetchAnimeDetail(animeId)
      // Store in nuxt payload so useAsyncData picks it up
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
