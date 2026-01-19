import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref, nextTick } from 'vue'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  elements: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter((el) => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  trigger(isIntersecting: boolean) {
    const entries = this.elements.map((element) => ({
      isIntersecting,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }))
    this.callback(entries, this as unknown as IntersectionObserver)
  }
}

let mockObserver: MockIntersectionObserver | null = null

const TestComponent = defineComponent({
  props: {
    hasMore: { type: Boolean, default: true },
    isLoading: { type: Boolean, default: false },
    hasError: { type: Boolean, default: false },
  },
  setup(props) {
    const hasMore = ref(props.hasMore)
    const isLoading = ref(props.isLoading)
    const hasError = ref(props.hasError)
    const loadMoreCalled = ref(0)

    const onLoadMore = () => {
      loadMoreCalled.value++
    }

    const { triggerRef } = useInfiniteScroll({
      hasMore,
      isLoading,
      hasError,
      onLoadMore,
    })

    return { triggerRef, loadMoreCalled, hasMore, isLoading, hasError }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('div', { ref: (el: HTMLElement | null) => { this.triggerRef = el }, class: 'trigger' }, 'Trigger'),
      h('span', { id: 'load-more-count' }, String(this.loadMoreCalled)),
    ])
  },
})

describe('useInfiniteScroll (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockObserver = null
    vi.stubGlobal('IntersectionObserver', function (callback: IntersectionObserverCallback) {
      mockObserver = new MockIntersectionObserver(callback)
      return mockObserver
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('composable structure', () => {
    it('should return triggerRef', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.triggerRef).toBeDefined()
    })

    it('should create IntersectionObserver on mount', async () => {
      await mountSuspended(TestComponent)
      await nextTick()
      expect(mockObserver).not.toBeNull()
    })
  })

  describe('load more behavior', () => {
    it('should call onLoadMore when intersecting and hasMore is true', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { hasMore: true, isLoading: false, hasError: false },
      })
      await nextTick()

      mockObserver?.trigger(true)
      await nextTick()

      expect(wrapper.vm.loadMoreCalled).toBe(1)
    })

    it('should not call onLoadMore when hasMore is false', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { hasMore: false, isLoading: false, hasError: false },
      })
      await nextTick()

      mockObserver?.trigger(true)
      await nextTick()

      expect(wrapper.vm.loadMoreCalled).toBe(0)
    })

    it('should not call onLoadMore when isLoading is true', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { hasMore: true, isLoading: true, hasError: false },
      })
      await nextTick()

      mockObserver?.trigger(true)
      await nextTick()

      expect(wrapper.vm.loadMoreCalled).toBe(0)
    })

    it('should not call onLoadMore when not intersecting', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { hasMore: true, isLoading: false, hasError: false },
      })
      await nextTick()

      mockObserver?.trigger(false)
      await nextTick()

      expect(wrapper.vm.loadMoreCalled).toBe(0)
    })
  })
})
