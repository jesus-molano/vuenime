import { defineStore } from 'pinia'
import { z } from 'zod'
import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'
import type { Database } from '~~/shared/types/database'
import { addFavoriteInputSchema } from '~~/shared/schemas'
import {
  fetchUserFavorites,
  insertFavorite,
  insertManyFavorites,
  deleteFavorite,
  deleteAllFavorites,
} from '~/services/supabase/favorites'
import { logger } from '~/services/logger'
import { getFriendlyError } from '~/utils/error-handling'

export type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

// Schema for removeFavorite input
const removeFavoriteInputSchema = z.object({
  malId: z.number().int().positive(),
})

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const supabase = useSupabaseClient<Database>()
    const notify = useNotifications()

    const favorites = ref<FavoriteAnime[]>([])
    const isLoading = ref(true)
    const hasSynced = ref(false)
    const syncedForUserId = ref<string | null>(null)
    const isSyncing = ref(false)

    const favoritesCount = computed(() => favorites.value.length)

    const isFavorite = (malId: number) => {
      return favorites.value.some((fav) => fav.mal_id === malId)
    }

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
        const remoteData = await fetchUserFavorites(supabase, userId)
        const remoteIds = new Set(remoteData.map((f) => f.mal_id))

        // Find local items that don't exist remotely
        const localOnly = favorites.value.filter((f) => !remoteIds.has(f.mal_id))

        // Upload local-only items to Supabase
        if (localOnly.length > 0) {
          await insertManyFavorites(supabase, userId, localOnly)
        }

        // Merge: remote + local-only (remote is source of truth for existing items)
        favorites.value = [...remoteData, ...localOnly]

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

    async function addFavorite(anime: AddFavoriteInput) {
      // Validate input
      const validation = addFavoriteInputSchema.safeParse(anime)
      if (!validation.success) {
        logger.error('[FavoritesStore] Invalid addFavorite input', validation.error.flatten())
        notify.favoriteError()
        return
      }

      // Use original anime object after validation passes
      // This preserves full type information (e.g., genres include type/url)
      if (isFavorite(anime.mal_id)) return

      const favorite: FavoriteAnime = {
        mal_id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        images: anime.images,
        score: anime.score,
        year: anime.year,
        episodes: anime.episodes,
        genres: anime.genres,
        airing: anime.airing,
        addedAt: Date.now(),
      }

      // Optimistic update
      favorites.value.push(favorite)

      // Sync to Supabase if user is authenticated
      if (syncedForUserId.value) {
        const { success, error } = await insertFavorite(supabase, syncedForUserId.value, favorite)
        if (!success) {
          // Rollback on error
          const index = favorites.value.findIndex((f) => f.mal_id === anime.mal_id)
          if (index !== -1) favorites.value.splice(index, 1)

          const friendlyError = getFriendlyError(error, 'addFavorite')
          notify.error(friendlyError.message)
          return
        }
      }
      notify.favoriteAdded(anime.title)
    }

    async function removeFavorite(malId: number) {
      // Validate input
      const validation = removeFavoriteInputSchema.safeParse({ malId })
      if (!validation.success) {
        logger.error('[FavoritesStore] Invalid removeFavorite input', validation.error.flatten())
        return
      }

      const index = favorites.value.findIndex((fav) => fav.mal_id === malId)
      if (index === -1) return

      const removed = favorites.value[index]!
      favorites.value.splice(index, 1)

      if (syncedForUserId.value) {
        const { success, error } = await deleteFavorite(supabase, syncedForUserId.value, malId)
        if (!success) {
          // Rollback on error
          favorites.value.splice(index, 0, removed)
          const friendlyError = getFriendlyError(error, 'removeFavorite')
          notify.error(friendlyError.message)
          return
        }
      }
      notify.favoriteRemoved(removed.title)
    }

    async function toggleFavorite(anime: AddFavoriteInput) {
      if (isFavorite(anime.mal_id)) {
        await removeFavorite(anime.mal_id)
      } else {
        await addFavorite(anime)
      }
    }

    async function clearFavorites() {
      const backup = [...favorites.value]
      favorites.value = []

      if (syncedForUserId.value) {
        const { success, error } = await deleteAllFavorites(supabase, syncedForUserId.value)
        if (!success) {
          favorites.value = backup
          const friendlyError = getFriendlyError(error, 'clearFavorites')
          notify.error(friendlyError.message)
          return
        }
      }
      notify.clearFavoritesSuccess()
    }

    // ============================================
    // Computed Sorts
    // ============================================

    const sortedByRecent = computed(() => [...favorites.value].sort((a, b) => b.addedAt - a.addedAt))

    const sortedByScore = computed(() => [...favorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)))

    const sortedByTitle = computed(() => [...favorites.value].sort((a, b) => a.title.localeCompare(b.title)))

    const sortedFavorites = sortedByRecent

    // ============================================
    // Lifecycle (called by plugin)
    // ============================================

    /**
     * Initialize store - called once on app start
     * @param userId - User ID from plugin (null for guest)
     */
    async function initialize(userId: string | null) {
      // Check if sync needed: user exists AND (not synced OR different user)
      const needsSync = userId && (!hasSynced.value || syncedForUserId.value !== userId)

      if (needsSync) {
        // Clear data if switching users
        if (syncedForUserId.value && syncedForUserId.value !== userId) {
          favorites.value = []
        }
        await syncWithSupabase(userId)
      } else if (userId && hasSynced.value) {
        // Already synced for this user - use cached localStorage data
        isLoading.value = false
      } else {
        // Guest mode - use localStorage data
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
      favorites.value = []
      hasSynced.value = false
      isLoading.value = false
    }

    return {
      // State
      favorites,
      favoritesCount,
      isLoading,

      // Sync state (for persistence - required for pick to work)
      hasSynced,
      syncedForUserId,

      // Sorted views
      sortedFavorites,
      sortedByRecent,
      sortedByScore,
      sortedByTitle,

      // Actions
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,

      // Lifecycle (plugin only)
      initialize,
      handleSignIn,
      handleSignOut,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['favorites', 'hasSynced', 'syncedForUserId'],
    },
  }
)
