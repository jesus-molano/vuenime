// Global search state composable
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
