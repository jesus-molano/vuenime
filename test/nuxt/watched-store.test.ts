import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { MarkWatchedInput } from '~/types/watched'

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
  },
}

// Mock Supabase composables
mockNuxtImport('useSupabaseClient', () => () => mockSupabaseClient)
mockNuxtImport('useSupabaseUser', () => () => ref(null))

// Mock notifications
const mockNotify = {
  episodeMarkedWatched: vi.fn(),
  episodeMarkedUnwatched: vi.fn(),
  allEpisodesMarkedWatched: vi.fn(),
  watchedCleared: vi.fn(),
  watchedError: vi.fn(),
}
mockNuxtImport('useNotifications', () => () => mockNotify)

// Mock watched episode data for testing
const mockWatchedInput: MarkWatchedInput = {
  mal_id: 1,
  episode_number: 1,
}

const mockWatchedInput2: MarkWatchedInput = {
  mal_id: 1,
  episode_number: 2,
}

const mockWatchedInput3: MarkWatchedInput = {
  mal_id: 2,
  episode_number: 1,
}

describe('useWatchedStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should start with empty watched episodes', () => {
      const store = useWatchedStore()
      expect(store.watchedEpisodes).toEqual([])
      expect(store.watchedCount).toBe(0)
    })
  })

  describe('markAsWatched (guest mode)', () => {
    it('should mark an episode as watched', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)

      expect(store.watchedEpisodes).toHaveLength(1)
      expect(store.watchedEpisodes[0]!.mal_id).toBe(mockWatchedInput.mal_id)
      expect(store.watchedEpisodes[0]!.episode_number).toBe(mockWatchedInput.episode_number)
      expect(store.watchedEpisodes[0]!.watched_at).toBeDefined()
    })

    it('should not add duplicate watched episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.markAsWatched(mockWatchedInput)

      expect(store.watchedEpisodes).toHaveLength(1)
    })

    it('should add multiple different episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.markAsWatched(mockWatchedInput2)

      expect(store.watchedEpisodes).toHaveLength(2)
      expect(store.watchedCount).toBe(2)
    })
  })

  describe('markAsUnwatched (guest mode)', () => {
    it('should remove a watched episode', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.markAsWatched(mockWatchedInput2)

      await store.markAsUnwatched(mockWatchedInput.mal_id, mockWatchedInput.episode_number)

      expect(store.watchedEpisodes).toHaveLength(1)
      expect(store.watchedEpisodes[0]!.episode_number).toBe(mockWatchedInput2.episode_number)
    })

    it('should do nothing when removing non-existent episode', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)

      await store.markAsUnwatched(999, 999)

      expect(store.watchedEpisodes).toHaveLength(1)
    })
  })

  describe('isWatched', () => {
    it('should return true for watched episode', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)

      expect(store.isWatched(mockWatchedInput.mal_id, mockWatchedInput.episode_number)).toBe(true)
    })

    it('should return false for non-watched episode', () => {
      const store = useWatchedStore()

      expect(store.isWatched(mockWatchedInput.mal_id, mockWatchedInput.episode_number)).toBe(false)
    })
  })

  describe('toggleWatched', () => {
    it('should add episode when not watched', async () => {
      const store = useWatchedStore()
      await store.toggleWatched(mockWatchedInput)

      expect(store.isWatched(mockWatchedInput.mal_id, mockWatchedInput.episode_number)).toBe(true)
    })

    it('should remove episode when already watched', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.toggleWatched(mockWatchedInput)

      expect(store.isWatched(mockWatchedInput.mal_id, mockWatchedInput.episode_number)).toBe(false)
    })
  })

  describe('getWatchedForAnime', () => {
    it('should return all watched episode numbers for an anime', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput) // anime 1, ep 1
      await store.markAsWatched(mockWatchedInput2) // anime 1, ep 2
      await store.markAsWatched(mockWatchedInput3) // anime 2, ep 1

      const watchedForAnime1 = store.getWatchedForAnime(1)

      expect(watchedForAnime1).toHaveLength(2)
      expect(watchedForAnime1).toContain(1)
      expect(watchedForAnime1).toContain(2)
    })

    it('should return empty array for anime with no watched episodes', () => {
      const store = useWatchedStore()

      const watched = store.getWatchedForAnime(999)

      expect(watched).toEqual([])
    })
  })

  describe('getWatchedCountForAnime', () => {
    it('should return count of watched episodes for an anime', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput) // anime 1, ep 1
      await store.markAsWatched(mockWatchedInput2) // anime 1, ep 2
      await store.markAsWatched(mockWatchedInput3) // anime 2, ep 1

      expect(store.getWatchedCountForAnime(1)).toBe(2)
      expect(store.getWatchedCountForAnime(2)).toBe(1)
      expect(store.getWatchedCountForAnime(999)).toBe(0)
    })
  })

  describe('watchedAnimeIds', () => {
    it('should return unique anime IDs with watched episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput) // anime 1
      await store.markAsWatched(mockWatchedInput2) // anime 1 (duplicate)
      await store.markAsWatched(mockWatchedInput3) // anime 2

      expect(store.watchedAnimeIds).toHaveLength(2)
      expect(store.watchedAnimeIds).toContain(1)
      expect(store.watchedAnimeIds).toContain(2)
    })
  })

  describe('markAllAsWatched (guest mode)', () => {
    it('should mark all episodes as watched', async () => {
      const store = useWatchedStore()
      await store.markAllAsWatched(1, 5)

      expect(store.watchedEpisodes).toHaveLength(5)
      expect(store.getWatchedForAnime(1)).toEqual([1, 2, 3, 4, 5])
    })

    it('should skip already watched episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput) // ep 1
      await store.markAsWatched(mockWatchedInput2) // ep 2

      await store.markAllAsWatched(1, 5)

      expect(store.watchedEpisodes).toHaveLength(5)
    })

    it('should do nothing if all episodes already watched', async () => {
      const store = useWatchedStore()
      await store.markAllAsWatched(1, 3)

      const countBefore = store.watchedCount
      await store.markAllAsWatched(1, 3)

      expect(store.watchedCount).toBe(countBefore)
    })

    it('should show notification with anime title', async () => {
      const store = useWatchedStore()
      await store.markAllAsWatched(1, 3, 'Test Anime')

      expect(mockNotify.allEpisodesMarkedWatched).toHaveBeenCalledWith('Test Anime')
    })
  })

  describe('clearWatchedForAnime (guest mode)', () => {
    it('should clear all watched episodes for an anime', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput) // anime 1, ep 1
      await store.markAsWatched(mockWatchedInput2) // anime 1, ep 2
      await store.markAsWatched(mockWatchedInput3) // anime 2, ep 1

      await store.clearWatchedForAnime(1)

      expect(store.watchedEpisodes).toHaveLength(1)
      expect(store.watchedEpisodes[0]!.mal_id).toBe(2)
    })

    it('should show notification with anime title', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      vi.clearAllMocks()

      await store.clearWatchedForAnime(1, 'Test Anime')

      expect(mockNotify.watchedCleared).toHaveBeenCalledWith('Test Anime')
    })
  })

  describe('clearAllWatched (guest mode)', () => {
    it('should remove all watched episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.markAsWatched(mockWatchedInput2)
      await store.markAsWatched(mockWatchedInput3)

      await store.clearAllWatched()

      expect(store.watchedEpisodes).toEqual([])
      expect(store.watchedCount).toBe(0)
    })
  })

  describe('lifecycle methods', () => {
    it('handleSignOut should clear all data', async () => {
      const store = useWatchedStore()
      await store.markAsWatched(mockWatchedInput)
      await store.markAsWatched(mockWatchedInput2)

      store.handleSignOut()

      expect(store.watchedEpisodes).toEqual([])
      expect(store.isLoading).toBe(false)
    })
  })
})
