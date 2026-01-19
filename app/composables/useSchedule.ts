import type { ScheduleDay, ScheduleResponse } from '~~/shared/types'
import { createCachedData, CACHE_TTL } from '~/utils/cache'
import { CACHE_KEYS } from '~/utils/cache-keys'

const DAYS: ScheduleDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const useSchedule = () => {
  const today = computed<ScheduleDay>(() => {
    const dayIndex = new Date().getDay()
    // getDay() returns 0-6, which are valid indices for DAYS array
    return DAYS[dayIndex]!
  })

  const { data, status, error, refresh } = useFetch<ScheduleResponse>('/api/jikan/schedules', {
    key: CACHE_KEYS.SCHEDULE_TODAY,
    query: computed(() => ({
      filter: today.value,
      limit: 15,
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
