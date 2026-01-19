import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchedStore } from '~/stores/watched'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock notification composable
const mockNotify = {
  watchedError: vi.fn(),
  allEpisodesMarkedWatched: vi.fn(),
  watchedCleared: vi.fn(),
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
}
mockNuxtImport('useNotifications', () => {
  return () => mockNotify
})

// Mock Supabase client (used in store but we mock the services that use it)
mockNuxtImport('useSupabaseClient', () => {
  return () => ({})
})

// Mock services using vi.hoisted to avoid initialization errors
const mockWatchedServices = vi.hoisted(() => ({
  fetchUserWatchedEpisodes: vi.fn(),
  insertWatchedEpisode: vi.fn(),
  insertManyWatchedEpisodes: vi.fn(),
  deleteWatchedEpisode: vi.fn(),
  deleteAllWatchedForAnime: vi.fn(),
  deleteAllWatched: vi.fn(),
}))

vi.mock('~/services/supabase/watched', () => mockWatchedServices)

describe('Watched Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    // Default mock implementations
    mockWatchedServices.fetchUserWatchedEpisodes.mockResolvedValue([])
    mockWatchedServices.insertWatchedEpisode.mockResolvedValue({ success: true })
    mockWatchedServices.insertManyWatchedEpisodes.mockResolvedValue({ success: true })
    mockWatchedServices.deleteWatchedEpisode.mockResolvedValue({ success: true })
    mockWatchedServices.deleteAllWatchedForAnime.mockResolvedValue({ success: true })
    mockWatchedServices.deleteAllWatched.mockResolvedValue({ success: true })
  })
  
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const store = useWatchedStore()
      expect(store.watchedEpisodes).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.hasSynced).toBe(false)
    })
  })

  describe('Getters', () => {
    it('isWatched returns correct status', () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      
      expect(store.isWatched(1, 1)).toBe(true)
      expect(store.isWatched(1, 2)).toBe(false)
      expect(store.isWatched(2, 1)).toBe(false)
    })

    it('getWatchedForAnime returns correct episodes', () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() },
        { mal_id: 1, episode_number: 2, watched_at: Date.now() },
        { mal_id: 2, episode_number: 1, watched_at: Date.now() },
      ]
      
      expect(store.getWatchedForAnime(1)).toEqual([1, 2])
      expect(store.getWatchedForAnime(2)).toEqual([1])
      expect(store.getWatchedForAnime(3)).toEqual([])
    })
    
    it('getWatchedCountForAnime returns correct count', () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() },
        { mal_id: 1, episode_number: 2, watched_at: Date.now() },
      ]
      
      expect(store.getWatchedCountForAnime(1)).toBe(2)
      expect(store.getWatchedCountForAnime(2)).toBe(0)
    })
    
    it('watchedAnimeIds returns unique IDs', () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() },
        { mal_id: 1, episode_number: 2, watched_at: Date.now() },
        { mal_id: 2, episode_number: 1, watched_at: Date.now() },
      ]
      
      expect(store.watchedAnimeIds).toEqual([1, 2])
    })
  })

  describe('Actions - Mark as Watched', () => {
    it('optimistically adds episode', async () => {
      const store = useWatchedStore()
      await store.markAsWatched({ mal_id: 1, episode_number: 1 })
      
      expect(store.watchedEpisodes).toHaveLength(1)
      expect(store.watchedEpisodes[0]).toMatchObject({
        mal_id: 1,
        episode_number: 1
      })
    })

    it('prevents duplicate watched episodes', async () => {
      const store = useWatchedStore()
      await store.markAsWatched({ mal_id: 1, episode_number: 1 })
      await store.markAsWatched({ mal_id: 1, episode_number: 1 })
      
      expect(store.watchedEpisodes).toHaveLength(1)
    })

    it('calls sync service when user is logged in', async () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      
      await store.markAsWatched({ mal_id: 1, episode_number: 1 })
      
      expect(mockWatchedServices.insertWatchedEpisode).toHaveBeenCalled()
    })

    it('rolls back on sync failure', async () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      mockWatchedServices.insertWatchedEpisode.mockResolvedValueOnce({ success: false })
      
      await store.markAsWatched({ mal_id: 1, episode_number: 1 })
      
      expect(store.watchedEpisodes).toHaveLength(0)
      expect(mockNotify.error).toHaveBeenCalled()
    })
  })

  describe('Actions - Mark as Unwatched', () => {
    it('optimistically removes episode', async () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      
      await store.markAsUnwatched(1, 1)
      
      expect(store.watchedEpisodes).toHaveLength(0)
    })

    it('calls delete service when user is logged in', async () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      
      await store.markAsUnwatched(1, 1)
      
      expect(mockWatchedServices.deleteWatchedEpisode).toHaveBeenCalled()
    })

    it('rolls back on sync failure', async () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      mockWatchedServices.deleteWatchedEpisode.mockResolvedValueOnce({ success: false })
      
      await store.markAsUnwatched(1, 1)
      
      expect(store.watchedEpisodes).toHaveLength(1)
      expect(mockNotify.error).toHaveBeenCalled()
    })
  })
  
  describe('Actions - Mark All as Watched', () => {
    it('marks all unwatched episodes', async () => {
      const store = useWatchedStore()
      // Already watched ep 1
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      
      // Mark 1-3
      await store.markAllAsWatched(1, 3, 'Anime Title')
      
      expect(store.watchedEpisodes).toHaveLength(3)
      expect(mockNotify.allEpisodesMarkedWatched).toHaveBeenCalled()
    })
    
    it('calls insertMany service when logged in', async () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      
      await store.markAllAsWatched(1, 3) // 3 episodes
      
      expect(mockWatchedServices.insertManyWatchedEpisodes).toHaveBeenCalled()
      // Should add 3 episodes
      const args = mockWatchedServices.insertManyWatchedEpisodes.mock.calls[0]
      expect(args).toBeDefined()
      expect(args![2]).toHaveLength(3) 
    })
  })

  describe('Sync', () => {
    it('syncWithSupabase merges remote data', async () => {
      const store = useWatchedStore()
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() } // Local only
      ]
      
      // Remote has ep 2
      mockWatchedServices.fetchUserWatchedEpisodes.mockResolvedValue([
        { mal_id: 1, episode_number: 2, watched_at: Date.now() }
      ])
      
      await store.handleSignIn('user-123')
      
      // Should have both
      expect(store.watchedEpisodes).toHaveLength(2)
      expect(mockWatchedServices.insertManyWatchedEpisodes).toHaveBeenCalled() // Should upload local ep 1
      expect(store.hasSynced).toBe(true)
    })
  })
  describe('Lifecycle', () => {
    it('handleSignOut should clear all data', () => {
      const store = useWatchedStore()
      store.syncedForUserId = 'user-123'
      store.watchedEpisodes = [
        { mal_id: 1, episode_number: 1, watched_at: Date.now() }
      ]
      store.hasSynced = true
      
      store.handleSignOut()
      
      expect(store.syncedForUserId).toBeNull()
      expect(store.watchedEpisodes).toEqual([])
      expect(store.hasSynced).toBe(false)
      expect(store.isLoading).toBe(false)
    })
  })
})
