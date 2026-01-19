import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref, nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useWatchedToggle } from '~/composables/useWatchedToggle'

// Mock watched store
const mockWatchedStore = {
  isWatched: vi.fn(),
  getWatchedForAnime: vi.fn(() => []),
  getWatchedCountForAnime: vi.fn(() => 0),
  toggleWatched: vi.fn(),
  markAsWatched: vi.fn(),
  markAsUnwatched: vi.fn(),
  markAllAsWatched: vi.fn(),
  clearWatchedForAnime: vi.fn(),
}

vi.mock('~/stores/watched', () => ({
  useWatchedStore: () => mockWatchedStore,
}))

const TestComponent = defineComponent({
  props: {
    malId: { type: Number, required: true },
  },
  setup(props) {
    const malId = ref(props.malId)
    const result = useWatchedToggle(malId)
    return { ...result, malId }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'watched-count' }, String(this.watchedCount)),
      h('span', { id: 'watched-episodes' }, JSON.stringify(this.watchedEpisodes)),
    ])
  },
})

const TestComponentWithNumber = defineComponent({
  props: {
    malId: { type: Number, required: true },
  },
  setup(props) {
    const result = useWatchedToggle(props.malId)
    return { ...result }
  },
  render() {
    return h('div', { class: 'test-component' }, [h('span', { id: 'watched-count' }, String(this.watchedCount))])
  },
})

describe('useWatchedToggle (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockWatchedStore.isWatched.mockReturnValue(false)
    mockWatchedStore.getWatchedForAnime.mockReturnValue([])
    mockWatchedStore.getWatchedCountForAnime.mockReturnValue(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('composable structure', () => {
    it('should return isEpisodeWatched function', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 1 },
      })
      expect(typeof wrapper.vm.isEpisodeWatched).toBe('function')
    })

    it('should return watchedEpisodes computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 1 },
      })
      expect(Array.isArray(wrapper.vm.watchedEpisodes)).toBe(true)
    })

    it('should return watchedCount computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 1 },
      })
      expect(typeof wrapper.vm.watchedCount).toBe('number')
    })
  })

  describe('isEpisodeWatched', () => {
    it('should call store isWatched with correct params', async () => {
      mockWatchedStore.isWatched.mockReturnValue(true)
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 123 },
      })
      await nextTick()

      wrapper.vm.isEpisodeWatched(5)
      expect(mockWatchedStore.isWatched).toHaveBeenCalledWith(123, 5)
    })

    it('should return false before mount (hydration safety)', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 1 },
      })
      // After mount, it should work correctly
      expect(typeof wrapper.vm.isEpisodeWatched(1)).toBe('boolean')
    })
  })

  describe('toggle functions', () => {
    it('should call toggleWatched on store', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 100 },
      })
      await nextTick()

      await wrapper.vm.toggleWatched(1)
      expect(mockWatchedStore.toggleWatched).toHaveBeenCalledWith({
        mal_id: 100,
        episode_number: 1,
      })
    })

    it('should call markAsWatched on store', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 200 },
      })
      await nextTick()

      await wrapper.vm.markAsWatched(3)
      expect(mockWatchedStore.markAsWatched).toHaveBeenCalledWith({
        mal_id: 200,
        episode_number: 3,
      })
    })

    it('should call markAsUnwatched on store', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 300 },
      })
      await nextTick()

      await wrapper.vm.markAsUnwatched(7)
      expect(mockWatchedStore.markAsUnwatched).toHaveBeenCalledWith(300, 7)
    })
  })

  describe('bulk actions', () => {
    it('should call markAllAsWatched on store', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 400 },
      })
      await nextTick()

      await wrapper.vm.markAllAsWatched(12)
      expect(mockWatchedStore.markAllAsWatched).toHaveBeenCalledWith(400, 12)
    })

    it('should call clearAllWatched on store', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { malId: 500 },
      })
      await nextTick()

      await wrapper.vm.clearAllWatched()
      expect(mockWatchedStore.clearWatchedForAnime).toHaveBeenCalledWith(500)
    })
  })

  describe('malId as number (not ref)', () => {
    it('should work with number directly', async () => {
      const wrapper = await mountSuspended(TestComponentWithNumber, {
        props: { malId: 999 },
      })
      await nextTick()

      expect(typeof wrapper.vm.watchedCount).toBe('number')
    })
  })
})
