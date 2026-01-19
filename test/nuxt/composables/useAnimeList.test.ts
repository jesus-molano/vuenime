import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useAnimeList } from '~/composables/useAnimeList'

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const { animeList, isLoading, isLoadingMore, hasNextPage, totalItems, error, loadMoreError, loadMore, refresh } =
      useAnimeList()

    return {
      animeList,
      isLoading,
      isLoadingMore,
      hasNextPage,
      totalItems,
      error,
      loadMoreError,
      loadMore,
      refresh,
    }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'anime-count' }, String(this.animeList.length)),
      h('span', { id: 'total-items' }, String(this.totalItems)),
      h('span', { id: 'has-next-page' }, this.hasNextPage ? 'true' : 'false'),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'is-loading-more' }, this.isLoadingMore ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'load-more-btn', onClick: () => this.loadMore() }, 'Load More'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeList (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return animeList as array', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(wrapper.vm.animeList).toBeDefined()
      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })

    it('should return hasNextPage as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(typeof wrapper.vm.hasNextPage).toBe('boolean')
    })

    it('should return totalItems as number', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(typeof wrapper.vm.totalItems).toBe('number')
    })
  })

  describe('loading states', () => {
    it('should have isLoading computed', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have isLoadingMore as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(typeof wrapper.vm.isLoadingMore).toBe('boolean')
    })
  })

  describe('loadMore functionality', () => {
    it('should have loadMore function', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.loadMore).toBe('function')
    })

    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      // Should not throw when called
      expect(() => wrapper.vm.loadMore()).not.toThrow()
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.refresh).toBe('function')
    })

    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(() => wrapper.vm.refresh()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should have error ref', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Error should be null or an error object
      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })

    it('should have loadMoreError ref', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.loadMoreError).toBeNull()
    })
  })

  describe('empty state handling', () => {
    it('should handle empty anime list gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      // Should always be an array (empty or with data)
      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })
  })
})
