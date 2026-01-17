/**
 * Composable for watched episode functionality
 * @param malId - The anime's MyAnimeList ID
 */
export function useWatchedToggle(malId: Ref<number> | ComputedRef<number> | number) {
  const watchedStore = useWatchedStore()

  // Track if component is mounted to avoid hydration mismatch
  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })

  const malIdValue = computed(() => (typeof malId === 'number' ? malId : malId.value))

  /**
   * Check if a specific episode is watched
   */
  const isEpisodeWatched = (episodeNumber: number) => {
    if (!isMounted.value) return false
    return watchedStore.isWatched(malIdValue.value, episodeNumber)
  }

  /**
   * Get all watched episode numbers for this anime
   */
  const watchedEpisodes = computed(() => {
    if (!isMounted.value) return []
    return watchedStore.getWatchedForAnime(malIdValue.value)
  })

  /**
   * Get watched count for this anime
   */
  const watchedCount = computed(() => {
    if (!isMounted.value) return 0
    return watchedStore.getWatchedCountForAnime(malIdValue.value)
  })

  /**
   * Toggle watched status for a specific episode
   */
  const toggleWatched = async (episodeNumber: number) => {
    await watchedStore.toggleWatched({
      mal_id: malIdValue.value,
      episode_number: episodeNumber,
    })
  }

  /**
   * Mark a specific episode as watched
   */
  const markAsWatched = async (episodeNumber: number) => {
    await watchedStore.markAsWatched({
      mal_id: malIdValue.value,
      episode_number: episodeNumber,
    })
  }

  /**
   * Mark a specific episode as unwatched
   */
  const markAsUnwatched = async (episodeNumber: number) => {
    await watchedStore.markAsUnwatched(malIdValue.value, episodeNumber)
  }

  /**
   * Mark all episodes as watched (up to totalEpisodes)
   */
  const markAllAsWatched = async (totalEpisodes: number) => {
    await watchedStore.markAllAsWatched(malIdValue.value, totalEpisodes)
  }

  /**
   * Clear all watched episodes for this anime
   */
  const clearAllWatched = async () => {
    await watchedStore.clearWatchedForAnime(malIdValue.value)
  }

  return {
    isEpisodeWatched,
    watchedEpisodes,
    watchedCount,
    toggleWatched,
    markAsWatched,
    markAsUnwatched,
    markAllAsWatched,
    clearAllWatched,
  }
}
