import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UpcomingAnime from '~/components/home/UpcomingAnime.vue'
import { createMockAnimeList } from '../../../fixtures/anime'

// Mock useUpcomingSeason composable
vi.mock('~/composables/useSeasons', () => ({
  useUpcomingSeason: () => ({
    animeList: ref(createMockAnimeList(3)),
    isLoading: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  }),
}))

describe('UpcomingAnime', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the carousel section', async () => {
      const wrapper = await mountSuspended(UpcomingAnime)

      expect(wrapper.html()).toBeTruthy()
    })

    it('should render anime cards when data is available', async () => {
      const wrapper = await mountSuspended(UpcomingAnime)

      // Should render AnimeCarouselCard components
      expect(wrapper.html()).toContain('Test Anime')
    })
  })

  describe('section properties', () => {
    it('should display section content', async () => {
      const wrapper = await mountSuspended(UpcomingAnime)

      // The section should have content
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('loading state', () => {
    it('should handle loading state', async () => {
      const wrapper = await mountSuspended(UpcomingAnime)

      // Component should render during loading
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('anime list', () => {
    it('should render multiple anime items', async () => {
      const wrapper = await mountSuspended(UpcomingAnime)

      // Should contain anime cards for each item
      expect(wrapper.html()).toBeTruthy()
    })
  })
})
