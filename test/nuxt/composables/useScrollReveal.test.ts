import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

// Mock IntersectionObserver callback storage
let observerCallback: IntersectionObserverCallback
let observerInstance: {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    threshold: {
      type: Number,
      default: 0.1,
    },
    rootMargin: {
      type: String,
      default: '0px 0px -50px 0px',
    },
    once: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { elementRef, isVisible } = useScrollReveal({
      threshold: props.threshold,
      rootMargin: props.rootMargin,
      once: props.once,
    })
    return { elementRef, isVisible }
  },
  render() {
    return h('div', { ref: 'elementRef', class: 'test-element' }, [
      h('span', { id: 'visibility' }, this.isVisible ? 'visible' : 'hidden'),
    ])
  },
})

describe('useScrollReveal (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Create mock observer
    observerInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    // Mock IntersectionObserver
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback, _options) => {
        observerCallback = callback
        return observerInstance
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // Helper to simulate intersection
  const simulateIntersection = (isIntersecting: boolean, target?: Element) => {
    observerCallback(
      [
        {
          isIntersecting,
          target: target || document.createElement('div'),
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ],
      observerInstance as unknown as IntersectionObserver
    )
  }

  describe('with default options', () => {
    it('should use default threshold of 0.1', async () => {
      await mountSuspended(TestComponent)

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ threshold: 0.1 }))
    })

    it('should use default rootMargin', async () => {
      await mountSuspended(TestComponent)

      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ rootMargin: '0px 0px -50px 0px' })
      )
    })
  })

  describe('with custom options', () => {
    it('should use custom threshold', async () => {
      await mountSuspended(TestComponent, {
        props: { threshold: 0.5 },
      })

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ threshold: 0.5 }))
    })

    it('should use custom rootMargin', async () => {
      await mountSuspended(TestComponent, {
        props: { rootMargin: '100px' },
      })

      expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ rootMargin: '100px' }))
    })
  })

  describe('visibility behavior with once: true (default)', () => {
    it('should set isVisible to true when element intersects', async () => {
      const wrapper = await mountSuspended(TestComponent)

      simulateIntersection(true)
      await nextTick()

      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should stay visible after leaving viewport (once mode)', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { once: true },
      })

      // Become visible
      simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Leave viewport - should stay visible
      simulateIntersection(false)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should unobserve element after becoming visible in once mode', async () => {
      await mountSuspended(TestComponent, {
        props: { once: true },
      })

      simulateIntersection(true)
      await nextTick()

      expect(observerInstance.unobserve).toHaveBeenCalled()
    })
  })

  describe('visibility behavior with once: false', () => {
    it('should toggle visibility based on intersection', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { once: false },
      })

      // Become visible
      simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Leave viewport
      simulateIntersection(false)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Re-enter viewport
      simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })
})
