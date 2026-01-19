import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useLazyAnimeData } from '~/composables/useLazyAnimeData'

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    animeId: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = ref(props.animeId)
    const { data, rawData, isLoading, error, refresh } = useLazyAnimeData(id, props.endpoint)
    return { data, rawData, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'data-count' }, String(this.data.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

// Test component with transform
const TestComponentWithTransform = defineComponent({
  props: {
    animeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = ref(props.animeId)
    const { data, rawData, isLoading } = useLazyAnimeData<{ id: number; name: string }, number>(id, 'items', {
      transform: (items) => items.length,
    })
    return { data, rawData, isLoading }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'transformed-data' }, String(this.data)),
      h('span', { id: 'raw-data-count' }, String(this.rawData.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
    ])
  },
})

describe('useLazyAnimeData (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return data as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })
      await nextTick()

      expect(wrapper.vm.data).toBeDefined()
      expect(Array.isArray(wrapper.vm.data)).toBe(true)
    })

    it('should return rawData as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })
      await nextTick()

      expect(wrapper.vm.rawData).toBeDefined()
      expect(Array.isArray(wrapper.vm.rawData)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have error ref', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })

      // Error can be null or an error object
      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })

      expect(typeof wrapper.vm.refresh).toBe('function')
    })

    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })
      await nextTick()

      expect(() => wrapper.vm.refresh()).not.toThrow()
    })
  })

  describe('transform option', () => {
    it('should return data with transform applied', async () => {
      const wrapper = await mountSuspended(TestComponentWithTransform, {
        props: { animeId: '1' },
      })
      await nextTick()

      // data should be a number (result of transform)
      expect(typeof wrapper.vm.data).toBe('number')
    })

    it('should keep rawData as array', async () => {
      const wrapper = await mountSuspended(TestComponentWithTransform, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(Array.isArray(wrapper.vm.rawData)).toBe(true)
    })
  })

  describe('empty state handling', () => {
    it('should handle empty data gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'items' },
      })
      await nextTick()

      expect(Array.isArray(wrapper.vm.data)).toBe(true)
    })
  })

  describe('different endpoints', () => {
    it('should work with different endpoint names', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'characters' },
      })
      await nextTick()

      expect(wrapper.vm.data).toBeDefined()
    })

    it('should work with another endpoint', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1', endpoint: 'episodes' },
      })
      await nextTick()

      expect(wrapper.vm.data).toBeDefined()
    })
  })
})
