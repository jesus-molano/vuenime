import { defineStore } from 'pinia'
import type { WatchedEpisode, MarkWatchedInput } from '~/types/watched'
import type { Database } from '~~/shared/types/database'
import {
  fetchUserWatchedEpisodes,
  fetchExistingWatchedIds,
  insertWatchedEpisode,
  insertManyWatchedEpisodes,
  deleteWatchedEpisode,
  deleteAllWatchedForAnime,
  deleteAllWatched,
} from '~/services/supabase/watched'

export type { WatchedEpisode, MarkWatchedInput } from '~/types/watched'

export const useWatchedStore = defineStore(
  'watched',
  () => {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    const watchedEpisodes = ref<WatchedEpisode[]>([])
    const isLoading = ref(false)
    const hasSynced = ref(false)

    // Cached user ID - updated on auth state changes
    const cachedUserId = ref<string | null>(null)

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
    // Helper Functions
    // ============================================

    async function getCurrentUserId(): Promise<string | null> {
      if (cachedUserId.value) return cachedUserId.value

      if (user.value?.id) {
        cachedUserId.value = user.value.id
        return cachedUserId.value
      }

      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser()
      cachedUserId.value = sessionUser?.id ?? null
      return cachedUserId.value
    }

    // ============================================
    // Supabase Sync Operations
    // ============================================

    async function fetchFromSupabase() {
      const userId = await getCurrentUserId()
      if (!userId) return

      isLoading.value = true
      try {
        watchedEpisodes.value = await fetchUserWatchedEpisodes(supabase, userId)
        hasSynced.value = true
      } finally {
        isLoading.value = false
      }
    }

    async function syncLocalToSupabase() {
      const userId = await getCurrentUserId()
      if (!userId || watchedEpisodes.value.length === 0) return

      const existingIds = await fetchExistingWatchedIds(supabase, userId)
      const newEpisodes = watchedEpisodes.value.filter((ep) => !existingIds.has(`${ep.mal_id}-${ep.episode_number}`))

      if (newEpisodes.length > 0) {
        await insertManyWatchedEpisodes(supabase, userId, newEpisodes)
      }

      await fetchFromSupabase()
    }

    // ============================================
    // Public Actions
    // ============================================

    async function markAsWatched(input: MarkWatchedInput) {
      if (isWatched(input.mal_id, input.episode_number)) return

      const episode: WatchedEpisode = {
        mal_id: input.mal_id,
        episode_number: input.episode_number,
        watched_at: Date.now(),
      }

      // Optimistic update
      watchedEpisodes.value.push(episode)

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await insertWatchedEpisode(supabase, userId, episode)
        if (!success) {
          // Rollback on error
          const index = watchedEpisodes.value.findIndex(
            (ep) => ep.mal_id === input.mal_id && ep.episode_number === input.episode_number
          )
          if (index !== -1) watchedEpisodes.value.splice(index, 1)
        }
      }
    }

    async function markAsUnwatched(malId: number, episodeNumber: number) {
      const index = watchedEpisodes.value.findIndex((ep) => ep.mal_id === malId && ep.episode_number === episodeNumber)
      if (index === -1) return

      const removed = watchedEpisodes.value[index]!
      watchedEpisodes.value.splice(index, 1)

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await deleteWatchedEpisode(supabase, userId, malId, episodeNumber)
        if (!success) {
          // Rollback on error
          watchedEpisodes.value.splice(index, 0, removed)
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

    async function markAllAsWatched(malId: number, totalEpisodes: number) {
      const currentWatched = new Set(getWatchedForAnime(malId))
      const episodesToAdd: WatchedEpisode[] = []

      for (let i = 1; i <= totalEpisodes; i++) {
        if (!currentWatched.has(i)) {
          episodesToAdd.push({
            mal_id: malId,
            episode_number: i,
            watched_at: Date.now(),
          })
        }
      }

      if (episodesToAdd.length === 0) return

      // Optimistic update
      watchedEpisodes.value.push(...episodesToAdd)

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await insertManyWatchedEpisodes(supabase, userId, episodesToAdd)
        if (!success) {
          // Rollback on error
          watchedEpisodes.value = watchedEpisodes.value.filter(
            (ep) => ep.mal_id !== malId || currentWatched.has(ep.episode_number)
          )
        }
      }
    }

    async function clearWatchedForAnime(malId: number) {
      const backup = watchedEpisodes.value.filter((ep) => ep.mal_id === malId)
      watchedEpisodes.value = watchedEpisodes.value.filter((ep) => ep.mal_id !== malId)

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await deleteAllWatchedForAnime(supabase, userId, malId)
        if (!success) {
          watchedEpisodes.value.push(...backup)
        }
      }
    }

    async function clearAllWatched() {
      const backup = [...watchedEpisodes.value]
      watchedEpisodes.value = []

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await deleteAllWatched(supabase, userId)
        if (!success) {
          watchedEpisodes.value = backup
        }
      }
    }

    // ============================================
    // Auth State Watcher
    // ============================================

    watch(
      user,
      async (newUser, oldUser) => {
        // Update cached user ID on auth state change
        cachedUserId.value = newUser?.id ?? null

        if (newUser?.id && !oldUser?.id) {
          await syncLocalToSupabase()
        } else if (!newUser && oldUser) {
          watchedEpisodes.value = []
          hasSynced.value = false
        }
      },
      { immediate: false }
    )

    async function initialize() {
      const userId = await getCurrentUserId()
      if (userId && !hasSynced.value) {
        await fetchFromSupabase()
      }
    }

    return {
      // State
      watchedEpisodes,
      watchedCount,
      isLoading,
      watchedAnimeIds,

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

      // Sync
      fetchFromSupabase,
      initialize,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['watchedEpisodes'],
    },
  }
)
