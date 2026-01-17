import type { Anime, AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'

export const useAnimeList = () => {
  // Persisted state (survives client navigation)
  const animeList = useState<Anime[]>('home-anime-list', () => [])
  const currentPage = useState('home-current-page', () => 1)
  const hasNextPage = useState('home-has-next', () => true)
  const totalItems = useState('home-total', () => 0)

  // Local state
  const isLoadingMore = ref(false)
  const loadMoreError = ref<string | null>(null)

  // SSR: Fetch only if no data
  const shouldFetch = animeList.value.length === 0

  const {
    data,
    status,
    error,
    refresh: refetch,
  } = useFetch<AnimeListResponse>('/api/jikan/anime', {
    key: 'anime-list-home',
    query: { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT },
    immediate: shouldFetch,
    watch: false,
  })

  // Initialize with SSR data
  if (data.value?.data && animeList.value.length === 0) {
    animeList.value = data.value.data
    hasNextPage.value = data.value.pagination?.has_next_page ?? false
    totalItems.value = data.value.pagination?.items?.total ?? 0
  }

  const isLoading = computed(() => status.value === 'pending' && animeList.value.length === 0)

  // Load more (client-side)
  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value) return

    isLoadingMore.value = true
    loadMoreError.value = null

    try {
      const nextPage = currentPage.value + 1
      const response = await $fetch<AnimeListResponse>('/api/jikan/anime', {
        query: { page: nextPage, limit: PAGINATION.DEFAULT_LIMIT },
      })

      if (response?.data) {
        const existingIds = new Set(animeList.value.map((a) => a.mal_id))
        const newAnime = response.data.filter((a) => !existingIds.has(a.mal_id))
        animeList.value = [...animeList.value, ...newAnime]
        currentPage.value = nextPage
        hasNextPage.value = response.pagination?.has_next_page ?? false
      }
    } catch (e) {
      loadMoreError.value = e instanceof Error ? e.message : 'Failed to load more'
    } finally {
      isLoadingMore.value = false
    }
  }

  // Refresh - reset everything
  const refresh = async () => {
    currentPage.value = 1
    animeList.value = []
    hasNextPage.value = true
    loadMoreError.value = null
    await refetch()
    if (data.value?.data) {
      animeList.value = data.value.data
      hasNextPage.value = data.value.pagination?.has_next_page ?? false
      totalItems.value = data.value.pagination?.items?.total ?? 0
    }
  }

  return {
    animeList,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalItems,
    error,
    loadMoreError,
    loadMore,
    refresh,
  }
}
