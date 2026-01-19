import type { NuxtApp } from '#app'

// Store fetch timestamps by cache key
const cacheTimestamps = new Map<string, number>()

/**
 * Creates a getCachedData function with TTL (time-to-live) support.
 * Returns cached data if it exists and hasn't expired, otherwise returns undefined to trigger a new fetch.
 *
 * @param ttlMs - Time to live in milliseconds
 * @returns getCachedData function for useFetch/useAsyncData
 *
 * @example
 * useFetch('/api/data', {
 *   key: 'my-data',
 *   getCachedData: createCachedData(CACHE_TTL.MEDIUM),
 * })
 */
export function createCachedData<T>(ttlMs: number) {
  return (key: string, nuxtApp: NuxtApp): T | undefined => {
    const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (!cached) return undefined

    const fetchedAt = cacheTimestamps.get(key)

    // If no timestamp (SSR data), accept it and set timestamp now
    if (!fetchedAt) {
      cacheTimestamps.set(key, Date.now())
      return cached as T
    }

    // Check if cache has expired
    const age = Date.now() - fetchedAt
    if (age > ttlMs) {
      // Clear expired timestamp
      cacheTimestamps.delete(key)
      return undefined // Trigger new fetch
    }

    return cached as T
  }
}

/**
 * Records the fetch timestamp for a cache key.
 * Call this in onResponse to track when data was fetched.
 *
 * @example
 * useFetch('/api/data', {
 *   key: 'my-data',
 *   getCachedData: createCachedData(CACHE_TTL.MEDIUM),
 *   onResponse() {
 *     markCacheFresh('my-data')
 *   }
 * })
 */
export function markCacheFresh(key: string) {
  cacheTimestamps.set(key, Date.now())
}

/**
 * Clears a specific cache entry timestamp.
 * Use when you want to force a refresh on next navigation.
 */
export function invalidateCache(key: string) {
  cacheTimestamps.delete(key)
}

/**
 * Clears all cache timestamps.
 * Useful for logout or full app refresh scenarios.
 */
export function clearAllCacheTimestamps() {
  cacheTimestamps.clear()
}

// Pre-configured TTL durations
export const CACHE_TTL = {
  /** 5 minutes - for frequently changing data like schedules */
  SHORT: 5 * 60 * 1000,
  /** 10 minutes - for home page data */
  MEDIUM: 10 * 60 * 1000,
  /** 30 minutes - for tab data like characters, news */
  LONG: 30 * 60 * 1000,
  /** 1 hour - for rarely changing data like anime details */
  VERY_LONG: 60 * 60 * 1000,
} as const
