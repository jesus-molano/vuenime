import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, computed } from 'vue'
import { useSearchResults } from '~/composables/useSearchResults'

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    query: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    genres: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const params = computed(() => {
      if (!props.query && !props.type && !props.year && !props.genres) {
        return null
      }
      return {
        q: props.query || undefined,
        type: props.type || undefined,
        year: props.year || undefined,
        genres: props.genres || undefined,
      }
    })

    const {
      searchResults,
      isLoading,
      isLoadingMore,
      hasNextPage,
      totalItems,
      hasResults,
      loadMoreError,
      loadMore,
      refresh,
    } = useSearchResults(params)

    return {
      searchResults,
      isLoading,
      isLoadingMore,
      hasNextPage,
      totalItems,
      hasResults,
      loadMoreError,
      loadMore,
      refresh,
    }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'results-count' }, String(this.searchResults.length)),
      h('span', { id: 'total-items' }, String(this.totalItems)),
      h('span', { id: 'has-results' }, this.hasResults ? 'true' : 'false'),
      h('span', { id: 'has-next-page' }, this.hasNextPage ? 'true' : 'false'),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'is-loading-more' }, this.isLoadingMore ? 'true' : 'false'),
      h('button', { id: 'load-more-btn', onClick: () => this.loadMore() }, 'Load More'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useSearchResults (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('with search query', () => {
    it('should have searchResults array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toBeDefined()
      expect(Array.isArray(wrapper.vm.searchResults)).toBe(true)
    })

    it('should have hasResults computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })
      await nextTick()

      expect(typeof wrapper.vm.hasResults).toBe('boolean')
    })
  })

  describe('with null params', () => {
    it('should return empty results when params are null', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: {}, // No params
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toHaveLength(0)
    })

    it('should have hasResults false', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: {},
      })
      await nextTick()

      expect(wrapper.find('#has-results').text()).toBe('false')
    })
  })

  describe('with type filter', () => {
    it('should accept type parameter', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'test', type: 'tv' },
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toBeDefined()
    })
  })

  describe('with year filter', () => {
    it('should accept year parameter', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'test', year: '2024' },
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toBeDefined()
    })
  })

  describe('with genres filter', () => {
    it('should accept genres parameter', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'test', genres: '1' },
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toBeDefined()
    })
  })

  describe('pagination', () => {
    it('should have hasNextPage computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })
      await nextTick()

      expect(typeof wrapper.vm.hasNextPage).toBe('boolean')
    })

    it('should have totalItems computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })
      await nextTick()

      expect(typeof wrapper.vm.totalItems).toBe('number')
    })
  })

  describe('loading states', () => {
    it('should have isLoading computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have isLoadingMore as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })
      await nextTick()

      expect(wrapper.find('#is-loading-more').text()).toBe('false')
    })
  })

  describe('loadMore functionality', () => {
    it('should have loadMore function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })

      expect(typeof wrapper.vm.loadMore).toBe('function')
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { query: 'naruto' },
      })

      expect(typeof wrapper.vm.refresh).toBe('function')
    })
  })

  describe('empty response handling', () => {
    it('should have empty results with no query', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: {},
      })
      await nextTick()

      expect(wrapper.vm.searchResults).toHaveLength(0)
      expect(wrapper.find('#has-results').text()).toBe('false')
    })
  })
})
