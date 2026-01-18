import type { SeasonsResponse, Season } from '~~/shared/types'

export const useCurrentSeason = () => {
  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/now', {
    key: 'current-season',
    query: { limit: 15 },
    watch: false,
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
  const { data, status, error, refresh } = useFetch<SeasonsResponse>('/api/jikan/seasons/upcoming', {
    key: 'upcoming-season',
    query: { limit: 15 },
    watch: false,
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
