import { defineStore } from 'pinia'
import type { WatchedEpisode, MarkWatchedInput } from '~/types/watched'
import type { Database } from '~~/shared/types/database'
import { markWatchedInputSchema, markAllWatchedInputSchema, markUnwatchedInputSchema } from '~~/shared/schemas'
import {
  fetchUserWatchedEpisodes,
  insertWatchedEpisode,
  insertManyWatchedEpisodes,
  deleteWatchedEpisode,
  deleteAllWatchedForAnime,
  deleteAllWatched,
} from '~/services/supabase/watched'

export const useWatchedStore = defineStore(
  'watched',
  () => {
    const supabase = useSupabaseClient<Database>()
    const notify = useNotifications()

    const watchedEpisodes = ref<WatchedEpisode[]>([])
    const isLoading = ref(false)
    const hasSynced = ref(false)
    const syncedForUserId = ref<string | null>(null)
    const isSyncing = ref(false)

    // ============================================
    // Computed Properties
    // ============================================

    const watchedCount = computed(() => watchedEpisodes.value.length)

    /**
     * Check if a specific episode is watched
     */
    const isWatched = (malId: number, episodeNumber: number) => {
      return watchedEpisodes.value.some((ep) => ep.mal_id === malId && ep.episode_number === episodeNumber)
    }

    /**
     * Get all watched episode numbers for an anime
     */
    const getWatchedForAnime = (malId: number): number[] => {
      return watchedEpisodes.value.filter((ep) => ep.mal_id === malId).map((ep) => ep.episode_number)
    }

    /**
     * Get watched count for an anime
     */
    const getWatchedCountForAnime = (malId: number): number => {
      return watchedEpisodes.value.filter((ep) => ep.mal_id === malId).length
    }

    /**
     * Get unique anime IDs that have watched episodes
     */
    const watchedAnimeIds = computed(() => {
      return [...new Set(watchedEpisodes.value.map((ep) => ep.mal_id))]
    })

    // ============================================
    // Supabase Sync Operations
    // ============================================

    /**
     * Sync local data with Supabase (single API call)
     * - Fetches remote data once
     * - Uploads local items that don't exist remotely
     * - Merges: remote is source of truth
     */
    async function syncWithSupabase(userId: string) {
      if (isSyncing.value) return

      isSyncing.value = true
      isLoading.value = true
      try {
        // Single API call - fetch all remote data
        const remoteData = await fetchUserWatchedEpisodes(supabase, userId)
        const remoteIds = new Set(remoteData.map((ep) => `${ep.mal_id}-${ep.episode_number}`))

        // Find local items that don't exist remotely
        const localOnly = watchedEpisodes.value.filter((ep) => !remoteIds.has(`${ep.mal_id}-${ep.episode_number}`))

        // Upload local-only items to Supabase
        if (localOnly.length > 0) {
          await insertManyWatchedEpisodes(supabase, userId, localOnly)
        }

        // Merge: remote + local-only (remote is source of truth for existing items)
        watchedEpisodes.value = [...remoteData, ...localOnly]

        hasSynced.value = true
        syncedForUserId.value = userId
      } finally {
        isLoading.value = false
        isSyncing.value = false
      }
    }

    // ============================================
    // Public Actions
    // ============================================

    async function markAsWatched(input: MarkWatchedInput) {
      // Validate input
      const validation = markWatchedInputSchema.safeParse(input)
      if (!validation.success) {
        console.error('[WatchedStore] Invalid markAsWatched input:', validation.error.flatten())
        return
      }

      const { mal_id, episode_number } = validation.data
      if (isWatched(mal_id, episode_number)) return

      const episode: WatchedEpisode = {
        mal_id,
        episode_number,
        watched_at: Date.now(),
      }

      // Optimistic update
      watchedEpisodes.value.push(episode)

      if (syncedForUserId.value) {
        const { success } = await insertWatchedEpisode(supabase, syncedForUserId.value, episode)
        if (!success) {
          // Rollback on error
          const index = watchedEpisodes.value.findIndex(
            (ep) => ep.mal_id === mal_id && ep.episode_number === episode_number
          )
          if (index !== -1) watchedEpisodes.value.splice(index, 1)
          notify.watchedError()
        }
      }
    }

    async function markAsUnwatched(malId: number, episodeNumber: number) {
      // Validate input
      const validation = markUnwatchedInputSchema.safeParse({ malId, episodeNumber })
      if (!validation.success) {
        console.error('[WatchedStore] Invalid markAsUnwatched input:', validation.error.flatten())
        return
      }

      const index = watchedEpisodes.value.findIndex((ep) => ep.mal_id === malId && ep.episode_number === episodeNumber)
      if (index === -1) return

      const removed = watchedEpisodes.value[index]!
      watchedEpisodes.value.splice(index, 1)

      if (syncedForUserId.value) {
        const { success } = await deleteWatchedEpisode(supabase, syncedForUserId.value, malId, episodeNumber)
        if (!success) {
          // Rollback on error
          watchedEpisodes.value.splice(index, 0, removed)
          notify.watchedError()
        }
      }
    }

    async function toggleWatched(input: MarkWatchedInput) {
      if (isWatched(input.mal_id, input.episode_number)) {
        await markAsUnwatched(input.mal_id, input.episode_number)
      } else {
        await markAsWatched(input)
      }
    }

    async function markAllAsWatched(malId: number, totalEpisodes: number, animeTitle?: string) {
      // Validate input - CRITICAL: prevents abuse with large totalEpisodes
      const validation = markAllWatchedInputSchema.safeParse({ malId, totalEpisodes, animeTitle })
      if (!validation.success) {
        console.error('[WatchedStore] Invalid markAllAsWatched input:', validation.error.flatten())
        notify.watchedError()
        return
      }

      const { malId: validMalId, totalEpisodes: validTotalEpisodes } = validation.data
      const currentWatched = new Set(getWatchedForAnime(validMalId))
      const episodesToAdd: WatchedEpisode[] = []

      for (let i = 1; i <= validTotalEpisodes; i++) {
        if (!currentWatched.has(i)) {
          episodesToAdd.push({
            mal_id: validMalId,
            episode_number: i,
            watched_at: Date.now(),
          })
        }
      }

      if (episodesToAdd.length === 0) return

      // Optimistic update
      watchedEpisodes.value.push(...episodesToAdd)

      if (syncedForUserId.value) {
        const { success } = await insertManyWatchedEpisodes(supabase, syncedForUserId.value, episodesToAdd)
        if (!success) {
          // Rollback on error
          watchedEpisodes.value = watchedEpisodes.value.filter(
            (ep) => ep.mal_id !== validMalId || currentWatched.has(ep.episode_number)
          )
          notify.watchedError()
          return
        }
      }

      if (animeTitle) {
        notify.allEpisodesMarkedWatched(animeTitle)
      }
    }

    async function clearWatchedForAnime(malId: number, animeTitle?: string) {
      const backup = watchedEpisodes.value.filter((ep) => ep.mal_id === malId)
      watchedEpisodes.value = watchedEpisodes.value.filter((ep) => ep.mal_id !== malId)

      if (syncedForUserId.value) {
        const { success } = await deleteAllWatchedForAnime(supabase, syncedForUserId.value, malId)
        if (!success) {
          watchedEpisodes.value.push(...backup)
          notify.watchedError()
          return
        }
      }

      if (animeTitle) {
        notify.watchedCleared(animeTitle)
      }
    }

    async function clearAllWatched() {
      const backup = [...watchedEpisodes.value]
      watchedEpisodes.value = []

      if (syncedForUserId.value) {
        const { success } = await deleteAllWatched(supabase, syncedForUserId.value)
        if (!success) {
          watchedEpisodes.value = backup
          notify.watchedError()
        }
      }
    }

    // ============================================
    // Lifecycle (called by plugin)
    // ============================================

    /**
     * Initialize store - called once on app start
     */
    async function initialize(userId: string | null) {
      const needsSync = userId && (!hasSynced.value || syncedForUserId.value !== userId)

      if (needsSync) {
        // Clear data if switching users
        if (syncedForUserId.value && syncedForUserId.value !== userId) {
          watchedEpisodes.value = []
        }
        await syncWithSupabase(userId)
      } else if (userId && hasSynced.value) {
        // Already synced for this user - use cached data
        isLoading.value = false
      } else if (!userId) {
        // No user - guest mode with localStorage data
        isLoading.value = false
        hasSynced.value = true
      }
    }

    /**
     * Handle new sign in - sync local guest data to user account
     */
    async function handleSignIn(userId: string) {
      await syncWithSupabase(userId)
    }

    /**
     * Handle sign out - clear user data
     */
    function handleSignOut() {
      syncedForUserId.value = null
      watchedEpisodes.value = []
      hasSynced.value = false
      isLoading.value = false
    }

    return {
      // State
      watchedEpisodes,
      watchedCount,
      isLoading,
      watchedAnimeIds,

      // Sync state (for persistence - required for pick to work)
      hasSynced,
      syncedForUserId,

      // Checkers
      isWatched,
      getWatchedForAnime,
      getWatchedCountForAnime,

      // Actions
      markAsWatched,
      markAsUnwatched,
      toggleWatched,
      markAllAsWatched,
      clearWatchedForAnime,
      clearAllWatched,

      // Lifecycle (plugin only)
      initialize,
      handleSignIn,
      handleSignOut,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['watchedEpisodes', 'hasSynced', 'syncedForUserId'],
    },
  }
)
