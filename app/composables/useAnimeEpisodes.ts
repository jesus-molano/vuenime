import type { AnimeEpisodesResponse, Episode } from '~~/shared/types'

export const useAnimeEpisodes = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const allEpisodes = ref<Episode[]>([])
  const currentPage = ref(1)
  const hasNextPage = ref(false)
  const isLoadingMore = ref(false)

  const { data, status, error } = useFetch<AnimeEpisodesResponse>(
    () => `/api/jikan/anime/${animeId.value}/episodes?page=${currentPage.value}`,
    {
      key: () => `anime-episodes-${animeId.value}-page-${currentPage.value}`,
      watch: [currentPage],
    }
  )

  // Update episodes when data changes
  watch(
    data,
    (newData) => {
      if (newData?.data) {
        if (currentPage.value === 1) {
          allEpisodes.value = newData.data
        } else {
          // Append new episodes, avoiding duplicates
          const existingIds = new Set(allEpisodes.value.map((e) => e.mal_id))
          const newEpisodes = newData.data.filter((e) => !existingIds.has(e.mal_id))
          allEpisodes.value = [...allEpisodes.value, ...newEpisodes]
        }
        hasNextPage.value = newData.pagination?.has_next_page ?? false
        isLoadingMore.value = false
      }
    },
    { immediate: true }
  )

  const pagination = computed(() => data.value?.pagination)
  const isLoading = computed(() => status.value === 'pending' && currentPage.value === 1)
  const hasEpisodes = computed(() => allEpisodes.value.length > 0)
  const totalEpisodes = computed(() => pagination.value?.items?.total ?? allEpisodes.value.length)

  const loadMore = async () => {
    if (hasNextPage.value && !isLoadingMore.value) {
      isLoadingMore.value = true
      currentPage.value++
    }
  }

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
  }
}
