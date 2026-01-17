import type { Anime, AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'

export const useAnimeListStore = defineStore('animeList', () => {
  // State
  const items = ref<Anime[]>([])
  const currentPage = ref<number>(PAGINATION.DEFAULT_PAGE)
  const hasNextPage = ref(true)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const totalItems = ref(0)
  const error = ref<string | null>(null)
  const lastScrollPosition = ref(0)

  // Getters
  const itemsCount = computed(() => items.value.length)
  const isEmpty = computed(() => items.value.length === 0 && !isLoading.value)

  // Actions
  const fetchInitialData = async (targetPage: number = PAGINATION.DEFAULT_PAGE) => {
    if (items.value.length > 0) return // Already have data

    isLoading.value = true
    error.value = null

    try {
      // If target page > 1, we need to load all pages up to that point
      const pagesToLoad = Math.max(1, targetPage)
      const allItems: Anime[] = []

      for (let page = 1; page <= pagesToLoad; page++) {
        const response = await $fetch<AnimeListResponse>('/api/jikan/anime', {
          query: { page, limit: PAGINATION.DEFAULT_LIMIT },
        })

        if (response?.data) {
          allItems.push(...response.data)
          hasNextPage.value = response.pagination?.has_next_page ?? false
          totalItems.value = response.pagination?.items?.total ?? 0
          currentPage.value = page
        }

        // Small delay between requests to avoid rate limiting
        if (page < pagesToLoad) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      // Deduplicate by mal_id
      const seen = new Set<number>()
      items.value = allItems.filter((anime) => {
        if (seen.has(anime.mal_id)) return false
        seen.add(anime.mal_id)
        return true
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load anime'
      console.error('Failed to fetch anime:', e)
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value || isLoading.value) return

    isLoadingMore.value = true
    error.value = null

    try {
      const nextPage = currentPage.value + 1
      const response = await $fetch<AnimeListResponse>('/api/jikan/anime', {
        query: { page: nextPage, limit: PAGINATION.DEFAULT_LIMIT },
      })

      if (response?.data) {
        // Filter duplicates by mal_id
        const existingIds = new Set(items.value.map((a) => a.mal_id))
        const newAnime = response.data.filter((a) => !existingIds.has(a.mal_id))
        items.value = [...items.value, ...newAnime]
        currentPage.value = nextPage
        hasNextPage.value = response.pagination?.has_next_page ?? false
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load more anime'
      console.error('Failed to load more anime:', e)
    } finally {
      isLoadingMore.value = false
    }
  }

  const refresh = async () => {
    currentPage.value = PAGINATION.DEFAULT_PAGE
    items.value = []
    hasNextPage.value = true
    error.value = null
    await fetchInitialData()
  }

  const saveScrollPosition = (position: number) => {
    lastScrollPosition.value = position
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    items,
    currentPage,
    hasNextPage,
    isLoading,
    isLoadingMore,
    totalItems,
    error,
    lastScrollPosition,
    // Getters
    itemsCount,
    isEmpty,
    // Actions
    fetchInitialData,
    loadMore,
    refresh,
    saveScrollPosition,
    clearError,
  }
})
