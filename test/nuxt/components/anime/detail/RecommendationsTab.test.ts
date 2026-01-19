import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'
import RecommendationsTab from '~/components/anime/detail/RecommendationsTab.vue'

import { useAnimeRecommendations } from '~/composables/useAnimeRecommendations'
import { useShowMore } from '~/composables/useShowMore'

vi.mock('~/composables/useAnimeRecommendations', () => ({
  useAnimeRecommendations: vi.fn(),
}))

vi.mock('~/composables/useShowMore', () => ({
  useShowMore: vi.fn(),
}))

// Mock recommendations data
const createMockRecommendation = (overrides = {}) => ({
  entry: {
    mal_id: 100,
    title: 'Recommended Anime',
    images: {
      jpg: { image_url: 'https://example.com/jpg.jpg', small_image_url: 'https://example.com/small.jpg', large_image_url: 'https://example.com/large.jpg' },
      webp: { image_url: 'https://example.com/webp.webp', small_image_url: 'https://example.com/small.webp', large_image_url: 'https://example.com/large.webp' },
    },
  },
  votes: 150,
  ...overrides,
})

const mockRecommendations = [
  createMockRecommendation({ entry: { mal_id: 100, title: 'Recommended Anime 1', images: { jpg: { image_url: 'https://example.com/1.jpg', small_image_url: '', large_image_url: '' }, webp: { image_url: '', small_image_url: '', large_image_url: '' } } }, votes: 150 }),
  createMockRecommendation({ entry: { mal_id: 101, title: 'Recommended Anime 2', images: { jpg: { image_url: 'https://example.com/2.jpg', small_image_url: '', large_image_url: '' }, webp: { image_url: '', small_image_url: '', large_image_url: '' } } }, votes: 120 }),
  createMockRecommendation({ entry: { mal_id: 102, title: 'Recommended Anime 3', images: { jpg: { image_url: 'https://example.com/3.jpg', small_image_url: '', large_image_url: '' }, webp: { image_url: '', small_image_url: '', large_image_url: '' } } }, votes: 100 }),
]

describe('RecommendationsTab', () => {
  const loadMoreMock = vi.fn()
  const resetMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAnimeRecommendations).mockReturnValue({
      recommendations: computed(() => []),
      isLoading: computed(() => false),
    } as unknown as ReturnType<typeof useAnimeRecommendations>)

    vi.mocked(useShowMore).mockReturnValue({
      displayedItems: computed(() => []),
      hasMore: computed(() => false),
      remainingCount: computed(() => 0),
      loadMore: loadMoreMock,
      reset: resetMock,
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
        recommendations: computed(() => []),
        isLoading: computed(() => true),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
      // Should render 10 skeletons
      const skeletons = wrapper.findAllComponents({ name: 'AnimeCardSkeleton' })
      expect(skeletons.length).toBe(10)
    })

    it('should not show empty state while loading', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => []),
        isLoading: computed(() => true),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const emptyState = wrapper.findComponent({ name: 'UiEmptyState' })
      expect(emptyState.exists()).toBe(false)
    })
  })

  describe('empty state', () => {
    it('should show empty state when no recommendations', async () => {
      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.html()).toContain('i-heroicons:hand-thumb-up')
    })

    it('should render UiEmptyState component', async () => {
      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const emptyState = wrapper.findComponent({ name: 'UiEmptyState' })
      expect(emptyState.exists()).toBe(true)
    })
  })

  describe('recommendations grid', () => {
    it('should render grid when data is available', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })

    it('should render AnimeCard for each displayed item', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const animeCards = wrapper.findAllComponents({ name: 'AnimeCard' })
      expect(animeCards.length).toBe(3)
    })

    it('should pass correct props to AnimeCard', async () => {
      const singleRec = [mockRecommendations[0]]
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => singleRec),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = singleRec.map((rec) => ({
        mal_id: rec?.entry?.mal_id,
        title: rec?.entry?.title,
        images: rec?.entry?.images,
        url: '',
        trailer: { youtube_id: null, url: null, embed_url: null, images: { image_url: null, small_image_url: null, medium_image_url: null, large_image_url: null, maximum_image_url: null } },
        approved: true,
        titles: [],
        title_english: null,
        title_japanese: null,
        title_synonyms: [],
        type: null,
        source: null,
        episodes: null,
        status: null,
        airing: false,
        aired: { from: null, to: null, string: '' },
        duration: null,
        rating: null,
        score: null,
        scored_by: null,
        rank: null,
        popularity: null,
        members: null,
        favorites: null,
        synopsis: null,
        background: null,
        season: null,
        year: null,
        genres: [],
        themes: [],
        demographics: [],
        studios: [],
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const animeCard = wrapper.findComponent({ name: 'AnimeCard' })
      expect(animeCard.exists()).toBe(true)
      expect(animeCard.props('anime')).toBeDefined()
    })
  })

  describe('data mapping', () => {
    it('should call useShowMore with mapped anime data', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => []),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(useShowMore).toHaveBeenCalled()
    })
  })

  describe('image fallbacks', () => {
    it('should handle missing webp images with jpg fallback', async () => {
      const recWithMissingWebp = [
        createMockRecommendation({
          entry: {
            mal_id: 200,
            title: 'No Webp',
            images: {
              jpg: { image_url: 'https://example.com/jpg.jpg', small_image_url: 'https://example.com/small.jpg', large_image_url: 'https://example.com/large.jpg' },
              webp: { image_url: '', small_image_url: '', large_image_url: '' },
            },
          },
        }),
      ]

      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => recWithMissingWebp),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = recWithMissingWebp.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: {
          jpg: rec.entry.images.jpg,
          webp: {
            image_url: rec.entry.images.webp?.image_url || '',
            small_image_url: rec.entry.images.webp?.small_image_url || '',
            large_image_url: rec.entry.images.webp?.large_image_url || rec.entry.images.jpg?.large_image_url || '',
          },
        },
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })

    it('should handle completely missing images', async () => {
      const recWithNoImages = [
        createMockRecommendation({
          entry: {
            mal_id: 300,
            title: 'No Images',
            images: {
              jpg: { image_url: '', small_image_url: '', large_image_url: '' },
              webp: { image_url: '', small_image_url: '', large_image_url: '' },
            },
          },
        }),
      ]

      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => recWithNoImages),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = recWithNoImages.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })
  })

  describe('ShowMoreButton', () => {
    it('should show ShowMoreButton when hasMore is true', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => true),
        remainingCount: computed(() => 5),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const showMoreButton = wrapper.findComponent({ name: 'UiShowMoreButton' })
      expect(showMoreButton.exists()).toBe(true)
    })

    it('should hide ShowMoreButton when hasMore is false', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const showMoreButton = wrapper.findComponent({ name: 'UiShowMoreButton' })
      // Button exists but should not be visible (show prop is false)
      expect(showMoreButton.props('show')).toBe(false)
    })

    it('should pass correct count to ShowMoreButton', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => true),
        remainingCount: computed(() => 15),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const showMoreButton = wrapper.findComponent({ name: 'UiShowMoreButton' })
      expect(showMoreButton.props('count')).toBe(15)
    })

    it('should call loadMore when ShowMoreButton is clicked', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => true),
        remainingCount: computed(() => 5),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const showMoreButton = wrapper.findComponent({ name: 'UiShowMoreButton' })
      await showMoreButton.trigger('click')

      expect(loadMoreMock).toHaveBeenCalled()
    })
  })

  describe('props', () => {
    it('should accept animeId as number and call composable', async () => {
      await mountSuspended(RecommendationsTab, {
        props: { animeId: 789 },
      })

      expect(useAnimeRecommendations).toHaveBeenCalled()
    })

    it('should accept animeId as string and call composable', async () => {
      await mountSuspended(RecommendationsTab, {
        props: { animeId: '456' },
      })

      expect(useAnimeRecommendations).toHaveBeenCalled()
    })

    it('should call useShowMore with initialCount of 10', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      expect(useShowMore).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ initialCount: 10, pageSize: 10 })
      )
    })
  })

  describe('grid layout', () => {
    it('should have responsive grid classes', async () => {
      vi.mocked(useAnimeRecommendations).mockReturnValue({
        recommendations: computed(() => mockRecommendations),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeRecommendations>)

      const mappedAnime = mockRecommendations.map((rec) => ({
        mal_id: rec.entry.mal_id,
        title: rec.entry.title,
        images: rec.entry.images,
      }))

      vi.mocked(useShowMore).mockReturnValue({
        displayedItems: computed(() => mappedAnime),
        hasMore: computed(() => false),
        remainingCount: computed(() => 0),
        loadMore: loadMoreMock,
        reset: resetMock,
      })

      const wrapper = await mountSuspended(RecommendationsTab, {
        props: { animeId: 1 },
      })

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('sm:grid-cols-2')
      expect(grid.classes()).toContain('md:grid-cols-3')
      expect(grid.classes()).toContain('lg:grid-cols-4')
      expect(grid.classes()).toContain('xl:grid-cols-5')
    })
  })
})
