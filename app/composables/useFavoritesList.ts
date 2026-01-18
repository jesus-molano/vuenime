import { PAGINATION } from '~~/shared/constants/api'

export function useFavoritesList() {
  const favoritesStore = useFavoritesStore()
  const preferencesStore = usePreferencesStore()
  const { favoritesCount, isLoading } = storeToRefs(favoritesStore)
  const { favoritesSortBy: sortBy } = storeToRefs(preferencesStore)

  // Show loading if store is actively syncing with Supabase
  // isLoading is set by markSyncing() in plugin or fetchFromSupabase()
  const isSyncing = computed(() => isLoading.value)

  const currentPage = ref(1)
  const itemsPerPage = PAGINATION.DEFAULT_LIMIT

  // Get sorted favorites based on current sort option
  const sortedFavorites = computed(() => {
    switch (sortBy.value) {
      case 'score':
        return favoritesStore.sortedByScore
      case 'title':
        return favoritesStore.sortedByTitle
      default:
        return favoritesStore.sortedByRecent
    }
  })

  // Pagination
  const totalPages = computed(() => Math.ceil(favoritesCount.value / itemsPerPage))

  const displayedFavorites = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedFavorites.value.slice(start, end)
  })

  const isEmpty = computed(() => favoritesCount.value === 0)

  // Reset to page 1 when sort changes
  watch(sortBy, () => {
    currentPage.value = 1
  })

  // Ensure current page is valid when favorites are removed
  watch(favoritesCount, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAll = () => {
    favoritesStore.clearFavorites()
  }

  return {
    // State
    currentPage,
    totalPages,
    displayedFavorites,
    isEmpty,
    favoritesCount,
    isLoading: isSyncing,

    // Actions
    scrollToTop,
    clearAll,
  }
}
