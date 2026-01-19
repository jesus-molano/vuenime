import type { ScheduleDay, ScheduleResponse } from '~~/shared/types'
import { MOBILE_LIMITS, DESKTOP_LIMITS } from '~~/shared/constants/api'
import { createCachedData, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'
import { isMobileUserAgent } from '~/utils/device-detection'

const DAYS: ScheduleDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const useSchedule = () => {
  // Detect mobile via User-Agent for SSR optimization
  const headers = useRequestHeaders(['user-agent'])
  const isMobileDevice = isMobileUserAgent(headers['user-agent'])
  const carouselLimit = isMobileDevice ? MOBILE_LIMITS.CAROUSEL : DESKTOP_LIMITS.CAROUSEL

  const today = computed<ScheduleDay>(() => {
    const dayIndex = new Date().getDay()
    // getDay() returns 0-6, which are valid indices for DAYS array
    return DAYS[dayIndex]!
  })

  const { data, status, error, refresh } = useFetch<ScheduleResponse>('/api/jikan/schedules', {
    key: isMobileDevice ? `${CACHE_KEYS.SCHEDULE_TODAY}-mobile` : CACHE_KEYS.SCHEDULE_TODAY,
    query: computed(() => ({
      filter: today.value,
      limit: carouselLimit,
    })),
    watch: false,
    // Cache for 5 minutes - schedules change throughout the day
    getCachedData: createCachedData(CACHE_TTL.SHORT),
  })

  const animeList = computed(() => data.value?.data ?? [])
  const isLoading = computed(() => status.value === 'pending')

  return {
    today,
    animeList,
    isLoading,
    error,
    refresh,
  }
}
