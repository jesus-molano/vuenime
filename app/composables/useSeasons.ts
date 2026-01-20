import type { SeasonsResponse, Season } from '~~/shared/types'
import { DESKTOP_LIMITS } from '~~/shared/constants/api'
import { createCachedData, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'

export const useCurrentSeason = () => {
  // Use stable cache key with DESKTOP_LIMITS for SSR/hydration consistency
  // Responsiveness is handled via CSS, not different data payloads
  const carouselLimit = DESKTOP_LIMITS.CAROUSEL

  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/now', {
    key: CACHE_KEYS.CURRENT_SEASON,
    query: { limit: carouselLimit },
    watch: false,
    // Cache for 10 minutes - season data changes rarely
    getCachedData: createCachedData(CACHE_TTL.MEDIUM),
  })

  const animeList = computed(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')

  // Get current season name
  const seasonName = computed(() => {
    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    let season: Season

    if (month >= 0 && month <= 2) season = 'winter'
    else if (month >= 3 && month <= 5) season = 'spring'
    else if (month >= 6 && month <= 8) season = 'summer'
    else season = 'fall'

    return { season, year }
  })

  return {
    animeList,
    isLoading,
    error,
    refresh,
    seasonName,
  }
}

export const useUpcomingSeason = () => {
  // Use stable cache key with DESKTOP_LIMITS for SSR/hydration consistency
  const carouselLimit = DESKTOP_LIMITS.CAROUSEL

  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/upcoming', {
    key: CACHE_KEYS.UPCOMING_SEASON,
    query: { limit: carouselLimit },
    watch: false,
    // Cache for 10 minutes - upcoming anime changes rarely
    getCachedData: createCachedData(CACHE_TTL.MEDIUM),
  })

  const animeList = computed(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')

  return {
    animeList,
    isLoading,
    error,
    refresh,
  }
}
