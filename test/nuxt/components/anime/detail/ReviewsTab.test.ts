import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'
import ReviewsTab from '~/components/anime/detail/ReviewsTab.vue'

import { useAnimeReviews } from '~/composables/useAnimeReviews'
import { useShowMore } from '~/composables/useShowMore'

vi.mock('~/composables/useAnimeReviews', () => ({
  useAnimeReviews: vi.fn(),
}))

vi.mock('~/composables/useShowMore', () => ({
  useShowMore: vi.fn(),
}))

const mockReviews = [
  {
    mal_id: 1,
    user: { username: 'reviewer1', images: { jpg: { image_url: '' } } },
    score: 9,
    review: 'Great anime!',
    date: '2024-01-15T10:30:00+00:00',
    tags: ['Recommended'],
    reactions: { overall: 42 },
  },
]

describe('ReviewsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAnimeReviews).mockReturnValue({
      reviews: computed(() => []),
      isLoading: computed(() => false),
    } as unknown as ReturnType<typeof useAnimeReviews>)

    vi.mocked(useShowMore).mockReturnValue({
      displayedItems: computed(() => []),
      hasMore: computed(() => false),
      remainingCount: computed(() => 0),
      loadMore: vi.fn(),
      reset: vi.fn(),
    })
  })

  describe('accessibility', () => {
    it('should render tabpanel with correct aria attributes', async () => {
      const wrapper = await mountSuspended(ReviewsTab, {
        props: { animeId: 1 },
      })

      const tabpanel = wrapper.find('[role="tabpanel"]')
      expect(tabpanel.exists()).toBe(true)
      expect(tabpanel.attributes('id')).toBe('tabpanel-reviews')
      expect(tabpanel.attributes('aria-labelledby')).toBe('tab-reviews')
    })
  })

  describe('loading state', () => {
    it('should show loading skeleton when isLoading is true', async () => {
      vi.mocked(useAnimeReviews).mockReturnValue({
        reviews: computed(() => []),
        isLoading: computed(() => true),
      } as unknown as ReturnType<typeof useAnimeReviews>)

      const wrapper = await mountSuspended(ReviewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.findAll('.animate-pulse').length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    it('should show empty state when no reviews', async () => {
      const wrapper = await mountSuspended(ReviewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.html()).toContain('i-heroicons:chat-bubble-left-right')
    })
  })

  describe('reviews list', () => {
    it('should render review cards when available', async () => {
      vi.mocked(useAnimeReviews).mockReturnValue({
        reviews: computed(() => mockReviews),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeReviews>)

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mockReviews),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: vi.fn(),
        reset: vi.fn(),
      })

      const wrapper = await mountSuspended(ReviewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.text()).toContain('reviewer1')
      expect(wrapper.text()).toContain('Great anime!')
    })
  })

  describe('props', () => {
    it('should accept animeId and call composable', async () => {
      await mountSuspended(ReviewsTab, {
        props: { animeId: 789 },
      })

      expect(useAnimeReviews).toHaveBeenCalled()
    })
  })
})
