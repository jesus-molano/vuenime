import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'
import NewsTab from '~/components/anime/detail/NewsTab.vue'

import { useAnimeNews } from '~/composables/useAnimeNews'
import { useShowMore } from '~/composables/useShowMore'

vi.mock('~/composables/useAnimeNews', () => ({
  useAnimeNews: vi.fn(),
}))

vi.mock('~/composables/useShowMore', () => ({
  useShowMore: vi.fn(),
}))

const mockNews = [
  {
    mal_id: 1,
    url: 'https://myanimelist.net/news/1',
    title: 'News Item 1',
    date: '2024-01-15T10:30:00+00:00',
    author_username: 'user1',
    excerpt: 'Excerpt 1',
    images: { jpg: { image_url: 'https://example.com/1.jpg' } },
    comments: 10,
  },
]

describe('NewsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAnimeNews).mockReturnValue({
      news: computed(() => []),
      isLoading: computed(() => false),
    } as unknown as ReturnType<typeof useAnimeNews>)

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
      const wrapper = await mountSuspended(NewsTab, {
        props: { animeId: 1 },
      })

      const tabpanel = wrapper.find('[role="tabpanel"]')
      expect(tabpanel.exists()).toBe(true)
      expect(tabpanel.attributes('id')).toBe('tabpanel-news')
      expect(tabpanel.attributes('aria-labelledby')).toBe('tab-news')
    })
  })

  describe('loading state', () => {
    it('should show loading skeleton when isLoading is true', async () => {
      vi.mocked(useAnimeNews).mockReturnValue({
        news: computed(() => []),
        isLoading: computed(() => true),
      } as unknown as ReturnType<typeof useAnimeNews>)

      const wrapper = await mountSuspended(NewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.findAll('.animate-pulse').length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    it('should show empty state when no news', async () => {
      const wrapper = await mountSuspended(NewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.html()).toContain('i-heroicons:newspaper')
    })
  })

  describe('news list', () => {
    it('should render news cards when available', async () => {
      vi.mocked(useAnimeNews).mockReturnValue({
        news: computed(() => mockNews),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeNews>)

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mockNews),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: vi.fn(),
        reset: vi.fn(),
      })

      const wrapper = await mountSuspended(NewsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.text()).toContain('News Item 1')
    })
  })

  describe('props', () => {
    it('should accept animeId and call composable', async () => {
      await mountSuspended(NewsTab, {
        props: { animeId: 789 },
      })

      expect(useAnimeNews).toHaveBeenCalled()
    })
  })
})
