import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref, computed } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesList } from '~/composables/useFavoritesList'
import type { FavoriteAnime } from '~/types/favorites'

// Create reactive state for mock stores
const mockFavorites = ref<FavoriteAnime[]>([])
const mockIsLoading = ref(false)
const mockSortBy = ref<'recent' | 'score' | 'title'>('recent')

// Computed values that match Pinia store behavior
const mockFavoritesCount = computed(() => mockFavorites.value.length)

// Sorting functions
const getSortedByRecent = () => [...mockFavorites.value].sort((a, b) => b.addedAt - a.addedAt)
const getSortedByScore = () => [...mockFavorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
const getSortedByTitle = () => [...mockFavorites.value].sort((a, b) => a.title.localeCompare(b.title))

// Mock clearFavorites function
const mockClearFavorites = vi.fn(() => {
  mockFavorites.value = []
})

// Mock the stores
vi.mock('~/stores/favorites', () => ({
  useFavoritesStore: () => ({
    favorites: mockFavorites,
    isLoading: mockIsLoading,
    clearFavorites: mockClearFavorites,
    get sortedByRecent() {
      return getSortedByRecent()
    },
    get sortedByScore() {
      return getSortedByScore()
    },
    get sortedByTitle() {
      return getSortedByTitle()
    },
  }),
}))

vi.mock('~/stores/preferences', () => ({
  usePreferencesStore: () => ({
    favoritesSortBy: mockSortBy,
  }),
}))

// Mock storeToRefs to return our refs directly
vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => {
      // Return refs based on which store is being accessed
      if ('favorites' in store) {
        return {
          favoritesCount: mockFavoritesCount,
          isLoading: mockIsLoading,
        }
      }
      if ('favoritesSortBy' in store) {
        return {
          favoritesSortBy: mockSortBy,
        }
      }
      return {}
    },
  }
})

// Helper to create mock favorite
const createMockFavorite = (overrides: Partial<FavoriteAnime> = {}): FavoriteAnime => ({
  mal_id: Math.floor(Math.random() * 10000),
  title: 'Test Anime',
  images: {
    jpg: { image_url: '', small_image_url: '', large_image_url: '' },
    webp: { image_url: '', small_image_url: '', large_image_url: '' },
  },
  score: 8.0,
  year: 2024,
  episodes: 12,
  genres: [],
  airing: false,
  addedAt: Date.now(),
  ...overrides,
})

// Test component that uses the actual composable
const TestComponent = defineComponent({
  setup() {
    return useFavoritesList()
  },
  render() {
    return h('div', { 'data-testid': 'favorites-list' }, [
      h('span', { id: 'current-page' }, String(this.currentPage)),
      h('span', { id: 'total-pages' }, String(this.totalPages)),
      h('span', { id: 'is-empty' }, String(this.isEmpty)),
      h('span', { id: 'is-loading' }, String(this.isLoading)),
      h('span', { id: 'favorites-count' }, String(this.favoritesCount)),
      h('span', { id: 'displayed-count' }, String(this.displayedFavorites.length)),
    ])
  },
})

describe('useFavoritesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    // Reset mock state
    mockFavorites.value = []
    mockIsLoading.value = false
    mockSortBy.value = 'recent'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initial state', () => {
    it('should start with currentPage at 1', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('should return isEmpty true when no favorites', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isEmpty).toBe(true)
    })

    it('should return isEmpty false when favorites exist', async () => {
      mockFavorites.value = [createMockFavorite()]
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isEmpty).toBe(false)
    })

    it('should return correct favoritesCount', async () => {
      mockFavorites.value = [createMockFavorite(), createMockFavorite()]
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.favoritesCount).toBe(2)
    })

    it('should reflect isLoading from store', async () => {
      mockIsLoading.value = true
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isLoading).toBe(true)
    })

    it('should not be loading when store is not loading', async () => {
      mockIsLoading.value = false
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })

  describe('pagination', () => {
    it('should return 0 totalPages when empty', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.totalPages).toBe(0)
    })

    it('should return 1 totalPage for items less than limit (24)', async () => {
      mockFavorites.value = Array.from({ length: 10 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.totalPages).toBe(1)
    })

    it('should return 1 totalPage for exactly 24 items', async () => {
      mockFavorites.value = Array.from({ length: 24 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.totalPages).toBe(1)
    })

    it('should calculate totalPages correctly for 25 items (2 pages)', async () => {
      mockFavorites.value = Array.from({ length: 25 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.totalPages).toBe(2)
    })

    it('should calculate totalPages correctly for many items', async () => {
      mockFavorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)
      // 50 items / 24 per page = 3 pages (ceil)
      expect(wrapper.vm.totalPages).toBe(3)
    })

    it('should display correct items for first page', async () => {
      mockFavorites.value = Array.from({ length: 30 }, (_, i) =>
        createMockFavorite({ mal_id: i + 1, addedAt: Date.now() - i })
      )
      const wrapper = await mountSuspended(TestComponent)

      // Page 1: first 24 items
      expect(wrapper.vm.displayedFavorites.length).toBe(24)
    })

    it('should display correct items for second page', async () => {
      mockFavorites.value = Array.from({ length: 30 }, (_, i) =>
        createMockFavorite({ mal_id: i + 1, addedAt: Date.now() - i })
      )
      const wrapper = await mountSuspended(TestComponent)

      // Page 2: remaining 6 items
      wrapper.vm.currentPage = 2
      await nextTick()
      expect(wrapper.vm.displayedFavorites.length).toBe(6)
    })

    it('should return empty array if page exceeds total', async () => {
      mockFavorites.value = Array.from({ length: 10 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.currentPage = 5
      await nextTick()
      expect(wrapper.vm.displayedFavorites.length).toBe(0)
    })
  })

  describe('sorting', () => {
    const setupSortingData = () => {
      mockFavorites.value = [
        createMockFavorite({ mal_id: 1, title: 'Zebra Anime', score: 5, addedAt: 1000 }),
        createMockFavorite({ mal_id: 2, title: 'Alpha Anime', score: 9, addedAt: 3000 }),
        createMockFavorite({ mal_id: 3, title: 'Beta Anime', score: 7, addedAt: 2000 }),
      ]
    }

    it('should sort by recent (addedAt desc) by default', async () => {
      setupSortingData()
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.displayedFavorites[0]?.mal_id).toBe(2) // addedAt: 3000
      expect(wrapper.vm.displayedFavorites[1]?.mal_id).toBe(3) // addedAt: 2000
      expect(wrapper.vm.displayedFavorites[2]?.mal_id).toBe(1) // addedAt: 1000
    })

    it('should sort by score (desc) when sortBy is score', async () => {
      setupSortingData()
      mockSortBy.value = 'score'
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.displayedFavorites[0]?.score).toBe(9)
      expect(wrapper.vm.displayedFavorites[1]?.score).toBe(7)
      expect(wrapper.vm.displayedFavorites[2]?.score).toBe(5)
    })

    it('should sort by title (asc) when sortBy is title', async () => {
      setupSortingData()
      mockSortBy.value = 'title'
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.displayedFavorites[0]?.title).toBe('Alpha Anime')
      expect(wrapper.vm.displayedFavorites[1]?.title).toBe('Beta Anime')
      expect(wrapper.vm.displayedFavorites[2]?.title).toBe('Zebra Anime')
    })

    it('should handle null scores in score sorting', async () => {
      mockFavorites.value = [
        createMockFavorite({ mal_id: 1, title: 'A', score: null, addedAt: 1000 }),
        createMockFavorite({ mal_id: 2, title: 'B', score: 8, addedAt: 2000 }),
        createMockFavorite({ mal_id: 3, title: 'C', score: undefined, addedAt: 3000 }),
      ]
      mockSortBy.value = 'score'
      const wrapper = await mountSuspended(TestComponent)

      // Items with score should come first, null/undefined treated as 0
      expect(wrapper.vm.displayedFavorites[0]?.score).toBe(8)
    })
  })

  describe('page management', () => {
    it('should allow setting currentPage directly', async () => {
      mockFavorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.currentPage = 2
      await nextTick()

      expect(wrapper.vm.currentPage).toBe(2)
    })

    it('should handle zero page by returning items from negative slice', async () => {
      mockFavorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(TestComponent)

      // Page 0: start = (0-1)*24 = -24, end = 0
      // slice(-24, 0) returns empty array
      wrapper.vm.currentPage = 0
      await nextTick()

      expect(wrapper.vm.displayedFavorites.length).toBe(0)
    })
  })

  describe('actions', () => {
    it('should call window.scrollTo with smooth behavior', async () => {
      const scrollToMock = vi.fn()
      vi.stubGlobal('scrollTo', scrollToMock)

      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.scrollToTop()

      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    it('should call clearFavorites on clearAll', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.clearAll()

      expect(mockClearFavorites).toHaveBeenCalledOnce()
    })

    it('should be able to call scrollToTop multiple times', async () => {
      const scrollToMock = vi.fn()
      vi.stubGlobal('scrollTo', scrollToMock)

      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.scrollToTop()
      wrapper.vm.scrollToTop()

      expect(scrollToMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('displayedFavorites slicing', () => {
    it('should slice correctly for first page', async () => {
      mockFavorites.value = Array.from({ length: 50 }, (_, i) => createMockFavorite({ mal_id: i + 1, addedAt: 50 - i }))
      mockSortBy.value = 'recent'
      const wrapper = await mountSuspended(TestComponent)

      // First page should have items sorted by recent (highest addedAt first)
      expect(wrapper.vm.displayedFavorites.length).toBe(24)
      expect(wrapper.vm.displayedFavorites[0]?.mal_id).toBe(1) // addedAt: 50
    })

    it('should slice correctly for middle page', async () => {
      mockFavorites.value = Array.from({ length: 72 }, (_, i) => createMockFavorite({ mal_id: i + 1, addedAt: 72 - i }))
      mockSortBy.value = 'recent'
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.currentPage = 2
      await nextTick()

      // Page 2: items 25-48 (indices 24-47)
      expect(wrapper.vm.displayedFavorites.length).toBe(24)
      expect(wrapper.vm.displayedFavorites[0]?.mal_id).toBe(25)
    })

    it('should slice correctly for last page', async () => {
      mockFavorites.value = Array.from({ length: 50 }, (_, i) => createMockFavorite({ mal_id: i + 1, addedAt: 50 - i }))
      mockSortBy.value = 'recent'
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.currentPage = 3
      await nextTick()

      // Page 3: items 49-50 (indices 48-49)
      expect(wrapper.vm.displayedFavorites.length).toBe(2)
      expect(wrapper.vm.displayedFavorites[0]?.mal_id).toBe(49)
    })
  })
})
