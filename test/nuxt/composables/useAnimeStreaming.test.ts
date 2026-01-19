import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useAnimeStreaming } from '~/composables/useAnimeStreaming'

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
    const { streamingLinks, isLoading, hasLinks, error, refresh } = useAnimeStreaming(id)
    return { streamingLinks, isLoading, hasLinks, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'links-count' }, String(this.streamingLinks.length)),
      h('span', { id: 'has-links' }, this.hasLinks ? 'true' : 'false'),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeStreaming (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return streamingLinks as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.streamingLinks).toBeDefined()
      expect(Array.isArray(wrapper.vm.streamingLinks)).toBe(true)
    })

    it('should have hasLinks as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(typeof wrapper.vm.hasLinks).toBe('boolean')
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

  describe('hasLinks computed', () => {
    it('should be consistent with streamingLinks length', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      const hasLinks = wrapper.vm.hasLinks
      const linksCount = wrapper.vm.streamingLinks.length

      if (linksCount > 0) {
        expect(hasLinks).toBe(true)
      } else {
        expect(hasLinks).toBe(false)
      }
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
    it('should handle empty streaming links gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(Array.isArray(wrapper.vm.streamingLinks)).toBe(true)
    })
  })

  describe('different anime IDs', () => {
    it('should accept different anime IDs', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '12345' },
      })
      await nextTick()

      expect(wrapper.vm.streamingLinks).toBeDefined()
    })
  })
})
