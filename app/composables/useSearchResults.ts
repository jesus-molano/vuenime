import type { Anime, AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'
import { animeApi, type AnimeSearchParams } from '~/services/api'

interface SearchParams {
  q?: string
  type?: string
  year?: string
  genres?: string
}

export const useSearchResults = (params: Ref<SearchParams | null> | ComputedRef<SearchParams | null>) => {
  // Build API query params
  const buildApiParams = (page: number): AnimeSearchParams | null => {
    if (!params.value) return null

    const apiParams: AnimeSearchParams = {
      page,
      limit: PAGINATION.DEFAULT_LIMIT,
    }

    if (params.value.q) apiParams.q = params.value.q
    if (params.value.type) apiParams.type = params.value.type
    if (params.value.year) {
      apiParams.start_date = `${params.value.year}-01-01`
      apiParams.end_date = `${params.value.year}-12-31`
    }
    if (params.value.genres) apiParams.genres = params.value.genres

    return apiParams
  }

  // Generate stable key from params for caching
  const paramsKey = computed(() => (params.value ? JSON.stringify(params.value) : null))

  // Use useAsyncData for better control over reactivity
  // Key changes when params change -> triggers new fetch automatically
  const {
    data: initialData,
    status,
    refresh: refetchInitial,
  } = useAsyncData<AnimeListResponse | null>(
    () => `anime-search-${paramsKey.value}`,
    async () => {
      const apiParams = buildApiParams(1)
      if (!apiParams) return null
      return await animeApi.search(apiParams)
    },
    {
      // Watch paramsKey to refetch when it changes
      watch: [paramsKey],
      // Return null when no params instead of making API call
      immediate: true,
    }
  )

  // Local state for pagination
  const additionalResults = ref<Anime[]>([])
  const currentPage = ref(1)
  const hasNextPage = ref(true)
  const isLoadingMore = ref(false)
  const loadMoreError = ref<string | null>(null)

  // Combined results: SSR data + additional loaded pages
  const searchResults = computed(() => {
    const initial = initialData.value?.data ?? []
    return [...initial, ...additionalResults.value]
  })

  // Update hasNextPage when initial data changes
  watch(
    initialData,
    (data) => {
      if (data) {
        hasNextPage.value = data.pagination?.has_next_page ?? false
      } else {
        hasNextPage.value = false
      }
    },
    { immediate: true }
  )

  // Reset pagination state when params change
  watch(paramsKey, () => {
    additionalResults.value = []
    currentPage.value = 1
  })

  // Load more (client-side only)
  const loadMore = async () => {
    if (!hasNextPage.value || isLoadingMore.value || !params.value) return

    isLoadingMore.value = true
    loadMoreError.value = null

    try {
      const nextPage = currentPage.value + 1
      const apiParams = buildApiParams(nextPage)
      if (!apiParams) return

      const response = await animeApi.search(apiParams)

      if (response?.data) {
        // Append new results, avoiding duplicates
        const existingIds = new Set(searchResults.value.map((a) => a.mal_id))
        const newAnime = response.data.filter((a) => !existingIds.has(a.mal_id))
        additionalResults.value = [...additionalResults.value, ...newAnime]
        currentPage.value = nextPage
        hasNextPage.value = response.pagination?.has_next_page ?? false
      }
    } catch (e) {
      loadMoreError.value = e instanceof Error ? e.message : 'Failed to load more'
    } finally {
      isLoadingMore.value = false
    }
  }

  // Computed states
  const isLoading = computed(() => status.value === 'pending')
  const hasResults = computed(() => !isLoading.value && searchResults.value.length > 0)
  const totalItems = computed(() => initialData.value?.pagination?.items?.total ?? 0)

  // Refresh function
  const refresh = async () => {
    additionalResults.value = []
    currentPage.value = 1
    await refetchInitial()
  }

  return {
    searchResults,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalItems,
    hasResults,
    loadMoreError,
    loadMore,
    refresh,
  }
}
