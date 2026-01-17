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

    const favorites = ref<FavoriteAnime[]>([])
    const isLoading = ref(false)
    const hasSynced = ref(false)

    const favoritesCount = computed(() => favorites.value.length)

    const isFavorite = (malId: number) => {
      return favorites.value.some((fav) => fav.mal_id === malId)
    }

    // ============================================
    // Supabase Sync Operations
    // ============================================

    async function fetchFromSupabase() {
      if (!user.value) return

      isLoading.value = true
      try {
        favorites.value = await fetchUserFavorites(supabase, user.value.id)
        hasSynced.value = true
      } finally {
        isLoading.value = false
      }
    }

    async function syncLocalToSupabase() {
      if (!user.value || favorites.value.length === 0) return

      const existingIds = await fetchExistingIds(supabase, user.value.id)
      const newFavorites = favorites.value.filter((f) => !existingIds.has(f.mal_id))

      if (newFavorites.length > 0) {
        await insertManyFavorites(supabase, user.value.id, newFavorites)
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

      if (user.value) {
        const { success } = await insertFavorite(supabase, user.value.id, favorite)
        if (!success) {
          // Rollback on error
          const index = favorites.value.findIndex((f) => f.mal_id === anime.mal_id)
          if (index !== -1) favorites.value.splice(index, 1)
        }
      }
    }

    async function removeFavorite(malId: number) {
      const index = favorites.value.findIndex((fav) => fav.mal_id === malId)
      if (index === -1) return

      const removed = favorites.value[index]!
      favorites.value.splice(index, 1)

      if (user.value) {
        const { success } = await deleteFavorite(supabase, user.value.id, malId)
        if (!success) {
          // Rollback on error
          favorites.value.splice(index, 0, removed)
        }
      }
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

      if (user.value) {
        const { success } = await deleteAllFavorites(supabase, user.value.id)
        if (!success) {
          favorites.value = backup
        }
      }
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
        if (newUser && !oldUser) {
          await syncLocalToSupabase()
        } else if (!newUser && oldUser) {
          favorites.value = []
          hasSynced.value = false
        }
      },
      { immediate: false }
    )

    async function initialize() {
      if (user.value && !hasSynced.value) {
        await fetchFromSupabase()
      }
    }

    return {
      favorites,
      favoritesCount,
      isLoading,
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
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['favorites'], // Only persist favorites, not isLoading or hasSynced
    },
  }
)
