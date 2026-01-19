import type { AnimeEpisodesResponse, Episode, AnimePagination } from '~~/shared/types'

export const useAnimeEpisodes = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const allEpisodes = ref<Episode[]>([])
  const pagination = ref<AnimePagination | null>(null)
  const currentPage = ref(1)
  const isLoadingMore = ref(false)

  // Initial fetch with useFetch (page 1)
  const { status, error, refresh } = useFetch<AnimeEpisodesResponse>(
    () => `/api/jikan/anime/${animeId.value}/episodes?page=1`,
    {
      key: computed(() => `anime-episodes-${animeId.value}`),
      lazy: true,
      // Use cached data on client navigation to avoid refetching
      getCachedData(key, nuxtApp) {
        const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
        if (cached?.data) {
          allEpisodes.value = cached.data
          pagination.value = cached.pagination ?? null
        }
        return cached
      },
      onResponse({ response }) {
        if (response._data?.data) {
          allEpisodes.value = response._data.data
          pagination.value = response._data.pagination ?? null
        }
      },
    }
  )

  // Reset when anime changes
  watch(animeId, () => {
    allEpisodes.value = []
    currentPage.value = 1
    pagination.value = null
  })

  const isLoading = computed(() => status.value === 'pending')
  const hasNextPage = computed(() => pagination.value?.has_next_page ?? false)

  // loadMore uses $fetch (user-initiated action)
  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value) return

    isLoadingMore.value = true
    const nextPage = currentPage.value + 1

    try {
      const response = await $fetch<AnimeEpisodesResponse>(
        `/api/jikan/anime/${animeId.value}/episodes?page=${nextPage}`
      )

      if (response?.data) {
        const existingIds = new Set(allEpisodes.value.map((e) => e.mal_id))
        const newEpisodes = response.data.filter((e) => !existingIds.has(e.mal_id))
        allEpisodes.value = [...allEpisodes.value, ...newEpisodes]
        pagination.value = response.pagination ?? null
        currentPage.value = nextPage
      }
    } catch (e) {
      console.error('Failed to load more episodes:', e)
    } finally {
      isLoadingMore.value = false
    }
  }

  const hasEpisodes = computed(() => allEpisodes.value.length > 0)
  const totalEpisodes = computed(() => pagination.value?.items?.total ?? allEpisodes.value.length)

  return {
    episodes: allEpisodes,
    pagination,
    isLoading,
    isLoadingMore,
    hasEpisodes,
    hasNextPage,
    totalEpisodes,
    loadMore,
    error,
    refresh,
  }
}
