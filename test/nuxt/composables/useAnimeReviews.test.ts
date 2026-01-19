import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useAnimeReviews } from '~/composables/useAnimeReviews'

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
    const { reviews, isLoading, error, refresh } = useAnimeReviews(id)
    return { reviews, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'reviews-count' }, String(this.reviews.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeReviews (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return reviews as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.reviews).toBeDefined()
      expect(Array.isArray(wrapper.vm.reviews)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have error ref', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      // Error can be null or an error object
      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.refresh).toBe('function')
    })

    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(() => wrapper.vm.refresh()).not.toThrow()
    })
  })

  describe('empty state handling', () => {
    it('should handle empty reviews gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      // Should always be an array
      expect(Array.isArray(wrapper.vm.reviews)).toBe(true)
    })
  })

  describe('different anime IDs', () => {
    it('should accept different anime IDs', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '12345' },
      })
      await nextTick()

      expect(wrapper.vm.reviews).toBeDefined()
    })
  })
})
