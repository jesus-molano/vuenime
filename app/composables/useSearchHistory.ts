const SEARCH_HISTORY_KEY = 'vuenime_search_history'
const MAX_HISTORY = 5

export function useSearchHistory() {
  const history = useState<string[]>('searchHistory', () => [])

  // Load history from localStorage on mount
  const loadHistory = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
        if (stored) {
          history.value = JSON.parse(stored)
        }
      } catch {
        history.value = []
      }
    }
  }

  // Save to localStorage
  const saveHistory = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.value))
      } catch {
        // localStorage might be full or disabled
      }
    }
  }

  // Add a search term to history
  const addToHistory = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    // Remove if already exists (to move it to front)
    const filtered = history.value.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())

    // Add to front and limit to MAX_HISTORY
    history.value = [trimmed, ...filtered].slice(0, MAX_HISTORY)
    saveHistory()
  }

  // Remove a single item from history
  const removeFromHistory = (query: string) => {
    history.value = history.value.filter((item) => item.toLowerCase() !== query.toLowerCase())
    saveHistory()
  }

  // Clear all history
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  // Initialize on client
  onMounted(loadHistory)

  return {
    history: readonly(history),
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
