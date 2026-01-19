import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RecommendationsTab from '~/components/anime/detail/RecommendationsTab.vue'

import { useAnimeRecommendations } from '~/composables/useAnimeRecommendations'
import { useShowMore } from '~/composables/useShowMore'

vi.mock('~/composables/useAnimeRecommendations', () => ({
  useAnimeRecommendations: vi.fn(),
}))

vi.mock('~/composables/useShowMore', () => ({
  useShowMore: vi.fn(),
}))

const mockRecommendations = [
  {
    entry: {
      mal_id: 100,
      title: 'Recommended Anime 1',
      images: {
        jpg: { image_url: 'https://example.com/1.jpg', small_image_url: '', large_image_url: '' },
        webp: { image_url: '', small_image_url: '', large_image_url: '' },
      },
    },
    votes: 150,
  },
]

describe('RecommendationsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAnimeRecommendations).mockReturnValue({
      recommendations: ref([]),
      isLoading: ref(false),
    })

    vi.mocked(useShowMore).mockReturnValue({
      displayedItems: ref([]),
      hasMore: ref(false),
      remainingCount: ref(0),
      loadMore: vi.fn(),
      reset: vi.fn(),
    })
  })

  describe('accessibility', () => {
    it('should render tabpanel with correct aria attributes', async () => {
      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const tabpanel = wrapper.find('[role="tabpanel"]')
      expect(tabpanel.exists()).toBe(true)
      expect(tabpanel.attributes('id')).toBe('tabpanel-recommendations')
      expect(tabpanel.attributes('aria-labelledby')).toBe('tab-recommendations')
    })
  })

  describe('loading state', () => {
    it('should show skeleton grid when loading', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: ref([]),
        isLoading: ref(true),
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })
  })

  describe('empty state', () => {
    it('should show empty state when no recommendations', async () => {
      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.html()).toContain('i-heroicons:hand-thumb-up')
    })
  })

  describe('recommendations grid', () => {
    it('should render grid when data is available', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: ref(mockRecommendations),
        isLoading: ref(false),
      })

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: ref(mappedAnime),
        hasMore: ref(false),
        remainingCount: ref(0),
        loadMore: vi.fn(),
        reset: vi.fn(),
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept animeId and call composable', async () => {
      await mountSuspended(RecommendationsTab, {
        props: { animeId: 789 },
      })

      expect(useAnimeRecommendations).toHaveBeenCalled()
    })
  })
})
