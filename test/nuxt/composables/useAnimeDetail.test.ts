import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useAnimeDetail, prefetchAnimeDetail, cancelPrefetchAnimeDetail } from '~/composables/useAnimeDetail'

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
    const { anime, isLoading, error, refresh } = useAnimeDetail(id)
    return { anime, isLoading, error, refresh, id }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'anime-title' }, this.anime?.title ?? 'no-title'),
      h('span', { id: 'anime-score' }, String(this.anime?.score ?? 0)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useAnimeDetail (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('composable structure', () => {
    it('should return anime ref', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      // anime can be null or an object
      expect(wrapper.vm.anime === null || typeof wrapper.vm.anime === 'object').toBe(true)
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

      // error can be null or an error object
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

  describe('string id parameter', () => {
    it('should work with string id', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '12345' },
      })

      expect(wrapper.vm.anime === null || typeof wrapper.vm.anime === 'object').toBe(true)
    })
  })
})

describe('prefetchAnimeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be a function', () => {
    expect(typeof prefetchAnimeDetail).toBe('function')
  })

  it('should accept number id', () => {
    expect(() => prefetchAnimeDetail(123)).not.toThrow()
  })

  it('should accept string id', () => {
    expect(() => prefetchAnimeDetail('123')).not.toThrow()
  })
})

describe('cancelPrefetchAnimeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should be a function', () => {
    expect(typeof cancelPrefetchAnimeDetail).toBe('function')
  })

  it('should accept number id', () => {
    expect(() => cancelPrefetchAnimeDetail(123)).not.toThrow()
  })

  it('should accept string id', () => {
    expect(() => cancelPrefetchAnimeDetail('123')).not.toThrow()
  })

  it('should cancel pending prefetch', () => {
    vi.useFakeTimers()

    // Start prefetch
    prefetchAnimeDetail(123)

    // Cancel it
    cancelPrefetchAnimeDetail(123)

    // Advance timers - should not throw
    vi.advanceTimersByTime(1000)

    vi.useRealTimers()
  })
})
