import type { SeasonsResponse, Season } from '~~/shared/types'
import { MOBILE_LIMITS, DESKTOP_LIMITS } from '~~/shared/constants/api'
import { createCachedData, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'
import { isMobileUserAgent } from '~/utils/device-detection'

export const useCurrentSeason = () => {
  // Detect mobile via User-Agent for SSR optimization
  const headers = useRequestHeaders(['user-agent'])
  const isMobileDevice = isMobileUserAgent(headers['user-agent'])
  const carouselLimit = isMobileDevice ? MOBILE_LIMITS.CAROUSEL : DESKTOP_LIMITS.CAROUSEL

  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/now', {
    key: isMobileDevice ? `${CACHE_KEYS.CURRENT_SEASON}-mobile` : CACHE_KEYS.CURRENT_SEASON,
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
  // Detect mobile via User-Agent for SSR optimization
  const headers = useRequestHeaders(['user-agent'])
  const isMobileDevice = isMobileUserAgent(headers['user-agent'])
  const carouselLimit = isMobileDevice ? MOBILE_LIMITS.CAROUSEL : DESKTOP_LIMITS.CAROUSEL

  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/upcoming', {
    key: isMobileDevice ? `${CACHE_KEYS.UPCOMING_SEASON}-mobile` : CACHE_KEYS.UPCOMING_SEASON,
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
