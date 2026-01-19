/**
 * Global search state composable
 *
 * **Design Decision**: Module-level refs are intentional here.
 * This pattern creates a singleton state that is shared across all component instances,
 * ensuring the search modal state and query are consistent throughout the app.
 * Unlike Pinia, this approach is simpler for basic global state without actions/getters.
 *
 * @example
 * ```ts
 * const { isSearchOpen, openSearch, closeSearch } = useSearch()
 * ```
 */

// Module-level state - shared across all instances (intentional singleton pattern)
const isSearchOpen = ref(false)
const searchQuery = ref('')

export const useSearch = () => {
  const openSearch = () => {
    isSearchOpen.value = true
  }

  const closeSearch = () => {
    isSearchOpen.value = false
  }

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    isSearchOpen,
    searchQuery,
    openSearch,
    closeSearch,
    toggleSearch,
    clearSearch,
  }
}
