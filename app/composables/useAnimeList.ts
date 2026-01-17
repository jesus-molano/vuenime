import type { Anime, AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'
import { animeApi } from '~/services/api'

export const useAnimeList = () => {
  // Additional anime loaded via "load more" (client-side only)
  const additionalAnime = useState<Anime[]>('home-additional-anime', () => [])
  const currentPage = useState('home-current-page', () => 1)
  const hasNextPage = useState('home-has-next', () => true)
  const totalItems = useState('home-total', () => 0)

  // Local state
  const isLoadingMore = ref(false)
  const loadMoreError = ref<string | null>(null)

  // SSR fetch - this blocks rendering until data is available
  const {
    data,
    status,
    error,
    refresh: refetch,
  } = useFetch<AnimeListResponse>('/api/jikan/anime', {
    key: 'anime-list-home',
    query: { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT },
    watch: false,
  })

  // Computed anime list - combines SSR data with additional loaded data
  const animeList = computed(() => {
    const initialData = data.value?.data ?? []
    return [...initialData, ...additionalAnime.value]
  })

  // Update pagination info when data changes
  watch(
    data,
    (newData) => {
      if (newData?.pagination) {
        hasNextPage.value = newData.pagination.has_next_page ?? false
        totalItems.value = newData.pagination.items?.total ?? 0
      }
    },
    { immediate: true }
  )

  const isLoading = computed(() => status.value === 'pending' && animeList.value.length === 0)

  // Load more (client-side)
  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value) return

    isLoadingMore.value = true
    loadMoreError.value = null

    try {
      const nextPage = currentPage.value + 1
      const response = await animeApi.list({
        page: nextPage,
        limit: PAGINATION.DEFAULT_LIMIT,
      })

      if (response?.data) {
        const existingIds = new Set(animeList.value.map((a) => a.mal_id))
        const newAnime = response.data.filter((a) => !existingIds.has(a.mal_id))
        additionalAnime.value = [...additionalAnime.value, ...newAnime]
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
    additionalAnime.value = []
    hasNextPage.value = true
    loadMoreError.value = null
    await refetch()
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
