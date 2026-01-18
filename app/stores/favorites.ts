import { defineStore } from 'pinia'
import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'
import type { Database } from '~~/shared/types/database'
import {
  fetchUserFavorites,
  fetchExistingIds,
  insertFavorite,
  insertManyFavorites,
  deleteFavorite,
  deleteAllFavorites,
} from '~/services/supabase/favorites'

export type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    // Notifications - now works in stores via runWithContext
    const notify = useNotifications()

    const favorites = ref<FavoriteAnime[]>([])
    // Start with loading=true to show skeleton until we determine auth state
    const isLoading = ref(true)
    const hasSynced = ref(false)

    // Cached user ID - updated on auth state changes
    const cachedUserId = ref<string | null>(null)

    const favoritesCount = computed(() => favorites.value.length)

    const isFavorite = (malId: number) => {
      return favorites.value.some((fav) => fav.mal_id === malId)
    }

    // Helper to get current user ID (cached)
    async function getCurrentUserId(): Promise<string | null> {
      // Return cached value if available
      if (cachedUserId.value) return cachedUserId.value

      // Try the composable first
      if (user.value?.id) {
        cachedUserId.value = user.value.id
        return cachedUserId.value
      }

      // Fallback: get user directly from Supabase session (only once)
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
        favorites.value = await fetchUserFavorites(supabase, userId)
        hasSynced.value = true
      } finally {
        isLoading.value = false
      }
    }

    async function syncLocalToSupabase() {
      const userId = await getCurrentUserId()
      if (!userId || favorites.value.length === 0) return

      const existingIds = await fetchExistingIds(supabase, userId)
      const newFavorites = favorites.value.filter((f) => !existingIds.has(f.mal_id))

      if (newFavorites.length > 0) {
        await insertManyFavorites(supabase, userId, newFavorites)
      }

      await fetchFromSupabase()
    }

    // ============================================
    // Public Actions
    // ============================================

    async function addFavorite(anime: AddFavoriteInput) {
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

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await insertFavorite(supabase, userId, favorite)
        if (!success) {
          // Rollback on error
          const index = favorites.value.findIndex((f) => f.mal_id === anime.mal_id)
          if (index !== -1) favorites.value.splice(index, 1)
          notify.favoriteError()
          return
        }
      }
      notify.favoriteAdded(anime.title)
    }

    async function removeFavorite(malId: number) {
      const index = favorites.value.findIndex((fav) => fav.mal_id === malId)
      if (index === -1) return

      const removed = favorites.value[index]!
      favorites.value.splice(index, 1)

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await deleteFavorite(supabase, userId, malId)
        if (!success) {
          // Rollback on error
          favorites.value.splice(index, 0, removed)
          notify.favoriteError()
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

      const userId = await getCurrentUserId()
      if (userId) {
        const { success } = await deleteAllFavorites(supabase, userId)
        if (!success) {
          favorites.value = backup
          notify.favoriteError()
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
          favorites.value = []
          hasSynced.value = false
        }
      },
      { immediate: false }
    )

    async function initialize() {
      const userId = await getCurrentUserId()
      if (userId && !hasSynced.value) {
        await fetchFromSupabase()
      } else {
        // No user logged in - use local storage data, stop loading
        isLoading.value = false
        hasSynced.value = true
      }
    }

    // Called by plugin to indicate sync is about to start
    function markSyncing() {
      isLoading.value = true
    }

    return {
      favorites,
      favoritesCount,
      isLoading,
      hasSynced,
      sortedFavorites,
      sortedByRecent,
      sortedByScore,
      sortedByTitle,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
      fetchFromSupabase,
      initialize,
      markSyncing,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['favorites'],
      // Only persist for non-authenticated users (guest mode)
      // For authenticated users, Supabase is the source of truth
    },
  }
)
