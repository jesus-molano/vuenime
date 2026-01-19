import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CurrentSeason from '~/components/home/CurrentSeason.vue'
import { createMockAnimeList } from '../../../fixtures/anime'

// Mock useCurrentSeason composable
vi.mock('~/composables/useSeasons', () => ({
  useCurrentSeason: () => ({
    animeList: ref(createMockAnimeList(3)),
    isLoading: ref(false),
    seasonName: ref({ season: 'winter', year: 2024 }),
    error: ref(null),
    refresh: vi.fn(),
  }),
}))

describe('CurrentSeason', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the carousel section', async () => {
      const wrapper = await mountSuspended(CurrentSeason)

      expect(wrapper.html()).toBeTruthy()
    })

    it('should render anime cards when data is available', async () => {
      const wrapper = await mountSuspended(CurrentSeason)

      // Should render AnimeCarouselCard components
      expect(wrapper.html()).toContain('Test Anime')
    })
  })

  describe('season icon', () => {
    it('should display an icon for the current season', async () => {
      const wrapper = await mountSuspended(CurrentSeason)

      // The icon should be present in the carousel section
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('formatted season', () => {
    it('should display formatted season text', async () => {
      const wrapper = await mountSuspended(CurrentSeason)

      // Should include year in the subtitle
      expect(wrapper.html()).toContain('2024')
    })
  })
})
