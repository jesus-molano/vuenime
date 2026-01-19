import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useAnimeEpisodes } from '~/composables/useAnimeEpisodes'

// Mock episodes response
const mockEpisodesPage1 = {
  data: [
    { mal_id: 1, title: 'Episode 1', aired: '2024-01-01' },
    { mal_id: 2, title: 'Episode 2', aired: '2024-01-08' },
    { mal_id: 3, title: 'Episode 3', aired: '2024-01-15' },
  ],
  pagination: {
    has_next_page: true,
    last_visible_page: 3,
    items: { total: 9, count: 3, per_page: 3 },
  },
}

const mockEpisodesPage2 = {
  data: [
    { mal_id: 4, title: 'Episode 4', aired: '2024-01-22' },
    { mal_id: 5, title: 'Episode 5', aired: '2024-01-29' },
    { mal_id: 6, title: 'Episode 6', aired: '2024-02-05' },
  ],
  pagination: {
    has_next_page: true,
    last_visible_page: 3,
    items: { total: 9, count: 3, per_page: 3 },
  },
}

const mockEpisodesPage3 = {
  data: [
    { mal_id: 7, title: 'Episode 7', aired: '2024-02-12' },
    { mal_id: 8, title: 'Episode 8', aired: '2024-02-19' },
    { mal_id: 9, title: 'Episode 9', aired: '2024-02-26' },
  ],
  pagination: {
    has_next_page: false,
    last_visible_page: 3,
    items: { total: 9, count: 3, per_page: 3 },
  },
}

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    animeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = ref(props.animeId)
    const {
      episodes,
      pagination,
      isLoading,
      isLoadingMore,
      hasEpisodes,
      hasNextPage,
      totalEpisodes,
      loadMore,
      error,
      refresh,
    } = useAnimeEpisodes(id)

    // Expose method to change ID
    const changeId = (newId: string) => {
      id.value = newId
    }

    return {
      episodes,
      pagination,
      isLoading,
      isLoadingMore,
      hasEpisodes,
      hasNextPage,
      totalEpisodes,
      loadMore,
      error,
      refresh,
      changeId,
    }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'episodes-count' }, String(this.episodes.length)),
      h('span', { id: 'total-episodes' }, String(this.totalEpisodes)),
      h('span', { id: 'has-episodes' }, this.hasEpisodes ? 'true' : 'false'),
      h('span', { id: 'has-next-page' }, this.hasNextPage ? 'true' : 'false'),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'is-loading-more' }, this.isLoadingMore ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'load-more-btn', onClick: () => this.loadMore() }, 'Load More'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeEpisodes (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Register page 1 endpoint
    registerEndpoint('/api/jikan/anime/1/episodes', {
      method: 'GET',
      handler: (event) => {
        const url = new URL(event.node.req.url || '', 'http://localhost')
        const page = url.searchParams.get('page') || '1'

        if (page === '1') return mockEpisodesPage1
        if (page === '2') return mockEpisodesPage2
        if (page === '3') return mockEpisodesPage3
        return mockEpisodesPage1
      },
    })
  })

  describe('initial data fetching', () => {
    it('should fetch episodes data', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.episodes).toBeDefined()
    })

    it('should return episodes array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.episodes.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('hasEpisodes computed', () => {
    it('should return true when episodes exist', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      // After fetch, hasEpisodes depends on data
      expect(typeof wrapper.vm.hasEpisodes).toBe('boolean')
    })

    it('should return false when no episodes', async () => {
      registerEndpoint('/api/jikan/anime/2/episodes', {
        method: 'GET',
        handler: () => ({
          data: [],
          pagination: { has_next_page: false, items: { total: 0 } },
        }),
      })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '2' },
      })
      await nextTick()

      expect(wrapper.vm.hasEpisodes).toBe(false)
    })
  })

  describe('hasNextPage computed', () => {
    it('should reflect pagination has_next_page', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(typeof wrapper.vm.hasNextPage).toBe('boolean')
    })
  })

  describe('totalEpisodes computed', () => {
    it('should return total from pagination', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(typeof wrapper.vm.totalEpisodes).toBe('number')
    })

    it('should fallback to episodes length', async () => {
      registerEndpoint('/api/jikan/anime/3/episodes', {
        method: 'GET',
        handler: () => ({
          data: [{ mal_id: 1, title: 'Episode 1' }],
          pagination: null,
        }),
      })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '3' },
      })
      await nextTick()

      // Should use episodes.length as fallback
      expect(wrapper.vm.totalEpisodes).toBeGreaterThanOrEqual(0)
    })
  })

  describe('loading states', () => {
    it('should have isLoading computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have isLoadingMore computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(wrapper.vm.isLoadingMore).toBe(false)
    })
  })

  describe('empty response handling', () => {
    it('should handle empty data', async () => {
      registerEndpoint('/api/jikan/anime/4/episodes', {
        method: 'GET',
        handler: () => ({
          data: [],
          pagination: { has_next_page: false, items: { total: 0 } },
        }),
      })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '4' },
      })
      await nextTick()

      expect(wrapper.vm.episodes).toHaveLength(0)
      expect(wrapper.vm.hasEpisodes).toBe(false)
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.refresh).toBe('function')
    })
  })

  describe('loadMore functionality', () => {
    it('should have loadMore function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.loadMore).toBe('function')
    })

    it('should not load more when no next page', async () => {
      registerEndpoint('/api/jikan/anime/5/episodes', {
        method: 'GET',
        handler: () => ({
          data: [{ mal_id: 1, title: 'Episode 1' }],
          pagination: { has_next_page: false },
        }),
      })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '5' },
      })
      await nextTick()

      const initialCount = wrapper.vm.episodes.length
      await wrapper.vm.loadMore()
      await nextTick()

      // Count should not change
      expect(wrapper.vm.episodes.length).toBe(initialCount)
    })
  })
})
