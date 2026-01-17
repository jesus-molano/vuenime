import type { Anime, AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'

export const useAnimeList = () => {
  const allAnime = ref<Anime[]>([])
  const currentPage = ref<number>(PAGINATION.DEFAULT_PAGE)
  const hasNextPage = ref(true)
  const isLoadingMore = ref(false)
  const totalItems = ref(0)

  // Initial fetch with SSR support
  const {
    data: initialData,
    status,
    error,
    refresh: refreshInitial,
  } = useFetch<AnimeListResponse>('/api/jikan/anime', {
    key: 'anime-list',
    query: { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT },
    default: () => ({
      data: [],
      pagination: {
        has_next_page: false,
        current_page: 1,
        last_visible_page: 1,
        items: { count: 0, total: 0, per_page: PAGINATION.DEFAULT_LIMIT },
      },
    }),
  })

  // Watch initial data and populate allAnime
  watch(
    initialData,
    (newData) => {
      if (newData?.data && currentPage.value === PAGINATION.DEFAULT_PAGE) {
        allAnime.value = newData.data
        hasNextPage.value = newData.pagination?.has_next_page ?? false
        totalItems.value = newData.pagination?.items?.total ?? 0
      }
    },
    { immediate: true }
  )

  const isLoading = computed(() => status.value === 'pending')

  // Load more function - client side only
  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value || isLoading.value) return

    isLoadingMore.value = true

    try {
      const nextPage = currentPage.value + 1
      const response = await $fetch<AnimeListResponse>('/api/jikan/anime', {
        query: { page: nextPage, limit: PAGINATION.DEFAULT_LIMIT },
      })

      if (response?.data) {
        // Filter duplicates by mal_id
        const existingIds = new Set(allAnime.value.map((a) => a.mal_id))
        const newAnime = response.data.filter((a) => !existingIds.has(a.mal_id))
        allAnime.value = [...allAnime.value, ...newAnime]
        currentPage.value = nextPage
        hasNextPage.value = response.pagination?.has_next_page ?? false
      }
    } catch (e) {
      console.error('Failed to load more anime:', e)
    } finally {
      isLoadingMore.value = false
    }
  }

  // Refresh - reset to page 1
  const refresh = async () => {
    currentPage.value = PAGINATION.DEFAULT_PAGE
    allAnime.value = []
    hasNextPage.value = true
    await refreshInitial()
  }

  return {
    animeList: allAnime,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalItems,
    currentPage,
    error,
    loadMore,
    refresh,
  }
}
