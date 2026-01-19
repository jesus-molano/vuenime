import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref, nextTick } from 'vue'
import { useAnimeRecommendations } from '~/composables/useAnimeRecommendations'

const TestComponent = defineComponent({
  props: {
    animeId: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const id = ref(props.animeId)
    const { recommendations, isLoading, error, refresh } = useAnimeRecommendations(id)
    return { recommendations, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'data-count' }, String(this.recommendations?.length ?? 0)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeRecommendations (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return recommendations as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.recommendations).toBeDefined()
      expect(Array.isArray(wrapper.vm.recommendations)).toBe(true)
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

      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })

    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.refresh).toBe('function')
    })
  })

  describe('refresh functionality', () => {
    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(() => wrapper.vm.refresh()).not.toThrow()
    })
  })

  describe('different anime IDs', () => {
    it('should work with string ID', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '12345' },
      })
      await nextTick()

      expect(wrapper.vm.recommendations).toBeDefined()
    })

    it('should work with number ID', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: 12345 },
      })
      await nextTick()

      expect(wrapper.vm.recommendations).toBeDefined()
    })
  })
})
