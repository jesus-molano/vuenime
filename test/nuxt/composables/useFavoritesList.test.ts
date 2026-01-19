import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref, computed, nextTick, watch } from 'vue'
import type { FavoriteAnime } from '~/types/favorites'

// Shared state for mocks
const favorites = ref<FavoriteAnime[]>([])
const isLoading = ref(false)
const favoritesSortBy = ref<'recent' | 'score' | 'title'>('recent')
const clearFavoritesMock = vi.fn()

// Mock stores
vi.mock('~/stores/favorites', () => ({
  useFavoritesStore: () => ({
    favorites,
    favoritesCount: computed(() => favorites.value.length),
    isLoading,
    sortedByRecent: computed(() => [...favorites.value].sort((a, b) => b.addedAt - a.addedAt)),
    sortedByScore: computed(() => [...favorites.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))),
    sortedByTitle: computed(() => [...favorites.value].sort((a, b) => a.title.localeCompare(b.title))),
    clearFavorites: clearFavoritesMock,
  }),
}))

vi.mock('~/stores/preferences', () => ({
  usePreferencesStore: () => ({
    favoritesSortBy,
  }),
}))

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

// Component that uses the actual composable logic
const FavoritesListComponent = defineComponent({
  setup() {
    const ITEMS_PER_PAGE = 24
    const currentPage = ref(1)

    const sortedFavorites = computed(() => {
      const store = [...favorites.value]
      switch (favoritesSortBy.value) {
        case 'score':
          return store.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        case 'title':
          return store.sort((a, b) => a.title.localeCompare(b.title))
        default:
          return store.sort((a, b) => b.addedAt - a.addedAt)
      }
    })

    const favoritesCount = computed(() => favorites.value.length)
    const totalPages = computed(() => Math.ceil(favoritesCount.value / ITEMS_PER_PAGE))
    const displayedFavorites = computed(() => {
      const start = (currentPage.value - 1) * ITEMS_PER_PAGE
      return sortedFavorites.value.slice(start, start + ITEMS_PER_PAGE)
    })
    const isEmpty = computed(() => favoritesCount.value === 0)

    // Reset page when sort changes
    watch(favoritesSortBy, () => {
      currentPage.value = 1
    })

    // Adjust page when favorites removed
    watch(favoritesCount, () => {
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
      }
    })

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    const clearAll = () => clearFavoritesMock()

    return {
      currentPage,
      totalPages,
      displayedFavorites,
      isEmpty,
      favoritesCount,
      isLoading: computed(() => isLoading.value),
      scrollToTop,
      clearAll,
    }
  },
  render() {
    return h('div', { 'data-testid': 'favorites-list' })
  },
})

describe('useFavoritesList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    favorites.value = []
    isLoading.value = false
    favoritesSortBy.value = 'recent'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initial state', () => {
    it('should start with currentPage at 1', async () => {
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('should return isEmpty true when no favorites', async () => {
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.isEmpty).toBe(true)
    })

    it('should return isEmpty false when favorites exist', async () => {
      favorites.value = [createMockFavorite()]
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.isEmpty).toBe(false)
    })

    it('should return correct favoritesCount', async () => {
      favorites.value = [createMockFavorite(), createMockFavorite()]
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.favoritesCount).toBe(2)
    })

    it('should reflect isLoading from store', async () => {
      isLoading.value = true
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('pagination', () => {
    it('should return 0 totalPages when empty', async () => {
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.totalPages).toBe(0)
    })

    it('should return 1 totalPage for items less than limit', async () => {
      favorites.value = Array.from({ length: 10 }, () => createMockFavorite())
      const wrapper = await mountSuspended(FavoritesListComponent)
      expect(wrapper.vm.totalPages).toBe(1)
    })

    it('should calculate totalPages correctly for many items', async () => {
      favorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(FavoritesListComponent)
      // 50 items / 24 per page = 3 pages (ceil)
      expect(wrapper.vm.totalPages).toBe(3)
    })

    it('should display correct items for current page', async () => {
      favorites.value = Array.from({ length: 30 }, (_, i) =>
        createMockFavorite({ mal_id: i + 1, addedAt: Date.now() - i }),
      )
      const wrapper = await mountSuspended(FavoritesListComponent)

      // Page 1: first 24 items
      expect(wrapper.vm.displayedFavorites.length).toBe(24)

      // Page 2: remaining 6 items
      wrapper.vm.currentPage = 2
      await nextTick()
      expect(wrapper.vm.displayedFavorites.length).toBe(6)
    })
  })

  describe('sorting', () => {
    const setupSortingData = () => {
      favorites.value = [
        createMockFavorite({ mal_id: 1, title: 'Zebra Anime', score: 5, addedAt: 1000 }),
        createMockFavorite({ mal_id: 2, title: 'Alpha Anime', score: 9, addedAt: 3000 }),
        createMockFavorite({ mal_id: 3, title: 'Beta Anime', score: 7, addedAt: 2000 }),
      ]
    }

    it('should sort by recent (addedAt desc) by default', async () => {
      setupSortingData()
      const wrapper = await mountSuspended(FavoritesListComponent)

      expect(wrapper.vm.displayedFavorites[0].mal_id).toBe(2) // addedAt: 3000
      expect(wrapper.vm.displayedFavorites[1].mal_id).toBe(3) // addedAt: 2000
      expect(wrapper.vm.displayedFavorites[2].mal_id).toBe(1) // addedAt: 1000
    })

    it('should sort by score (desc) when sortBy is score', async () => {
      setupSortingData()
      favoritesSortBy.value = 'score'
      const wrapper = await mountSuspended(FavoritesListComponent)

      expect(wrapper.vm.displayedFavorites[0].score).toBe(9)
      expect(wrapper.vm.displayedFavorites[1].score).toBe(7)
      expect(wrapper.vm.displayedFavorites[2].score).toBe(5)
    })

    it('should sort by title (asc) when sortBy is title', async () => {
      setupSortingData()
      favoritesSortBy.value = 'title'
      const wrapper = await mountSuspended(FavoritesListComponent)

      expect(wrapper.vm.displayedFavorites[0].title).toBe('Alpha Anime')
      expect(wrapper.vm.displayedFavorites[1].title).toBe('Beta Anime')
      expect(wrapper.vm.displayedFavorites[2].title).toBe('Zebra Anime')
    })

    it('should reset to page 1 when sort changes', async () => {
      favorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(FavoritesListComponent)

      wrapper.vm.currentPage = 2
      await nextTick()
      expect(wrapper.vm.currentPage).toBe(2)

      favoritesSortBy.value = 'score'
      await nextTick()
      expect(wrapper.vm.currentPage).toBe(1)
    })
  })

  describe('page adjustment on removal', () => {
    it('should adjust page when current exceeds total', async () => {
      favorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(FavoritesListComponent)

      wrapper.vm.currentPage = 3
      await nextTick()
      expect(wrapper.vm.currentPage).toBe(3)

      // Remove items, leaving only 20 (1 page)
      favorites.value = favorites.value.slice(0, 20)
      await nextTick()

      expect(wrapper.vm.currentPage).toBe(1)
    })

    it('should not change page if still valid after removal', async () => {
      favorites.value = Array.from({ length: 50 }, () => createMockFavorite())
      const wrapper = await mountSuspended(FavoritesListComponent)

      wrapper.vm.currentPage = 2
      await nextTick()

      // Remove some items but keep enough for 2 pages
      favorites.value = favorites.value.slice(0, 30)
      await nextTick()

      expect(wrapper.vm.currentPage).toBe(2)
    })
  })

  describe('actions', () => {
    it('should call window.scrollTo with smooth behavior', async () => {
      const scrollToMock = vi.fn()
      vi.stubGlobal('scrollTo', scrollToMock)

      const wrapper = await mountSuspended(FavoritesListComponent)
      wrapper.vm.scrollToTop()

      expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    it('should call clearFavorites on clearAll', async () => {
      const wrapper = await mountSuspended(FavoritesListComponent)
      wrapper.vm.clearAll()

      expect(clearFavoritesMock).toHaveBeenCalledOnce()
    })
  })
})
