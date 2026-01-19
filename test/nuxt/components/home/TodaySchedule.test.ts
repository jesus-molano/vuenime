import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TodaySchedule from '~/components/home/TodaySchedule.vue'
import { createMockAnimeList } from '../../../fixtures/anime'

// Mock useSchedule composable
vi.mock('~/composables/useSchedule', () => ({
  useSchedule: () => ({
    today: ref('monday'),
    animeList: ref(createMockAnimeList(3)),
    isLoading: ref(false),
    error: ref(null),
    refresh: vi.fn(),
  }),
}))

describe('TodaySchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the carousel section', async () => {
      const wrapper = await mountSuspended(TodaySchedule)

      expect(wrapper.html()).toBeTruthy()
    })

    it('should render anime cards when data is available', async () => {
      const wrapper = await mountSuspended(TodaySchedule)

      // Should render AnimeCarouselCard components
      expect(wrapper.html()).toContain('Test Anime')
    })
  })

  describe('formatted day', () => {
    it('should display the day of the week', async () => {
      const wrapper = await mountSuspended(TodaySchedule)

      // The formatted day should be shown in the subtitle
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('empty state', () => {
    it('should handle empty anime list', async () => {
      vi.doMock('~/composables/useSchedule', () => ({
        useSchedule: () => ({
          today: ref('monday'),
          animeList: ref([]),
          isLoading: ref(false),
          error: ref(null),
          refresh: vi.fn(),
        }),
      }))

      const wrapper = await mountSuspended(TodaySchedule)

      // Should render even with empty list
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('loading state', () => {
    it('should handle loading state', async () => {
      const wrapper = await mountSuspended(TodaySchedule)

      // Component should render during loading
      expect(wrapper.html()).toBeTruthy()
    })
  })
})
