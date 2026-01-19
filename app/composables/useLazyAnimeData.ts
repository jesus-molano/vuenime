/**
 * Generic composable for lazy loading anime-related data from Jikan API
 * Eliminates code duplication across useAnimeNews, useAnimeReviews, etc.
 */
export function useLazyAnimeData<T, R = T[]>(
  animeId: Ref<string | number> | ComputedRef<string | number>,
  endpoint: string,
  options: {
    transform?: (data: T[]) => R
  } = {}
) {
  const { transform } = options

  const { data, status, error, refresh } = useFetch<{ data: T[] }>(
    () => `/api/jikan/anime/${unref(animeId)}/${endpoint}`,
    {
      key: computed(() => `anime-${endpoint}-${unref(animeId)}`),
      watch: false,
      lazy: true,
      // Use cached data on client navigation to avoid refetching
      getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
    }
  )

  const rawData = computed(() => data.value?.data ?? [])
  const result = computed<R>(() => (transform ? transform(rawData.value) : (rawData.value as unknown as R)))
  const isLoading = computed(() => status.value === 'pending')

  return {
    data: result,
    rawData,
    isLoading,
    error,
    refresh,
  }
}
