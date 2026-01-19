import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { createMockIntersectionObserver, cleanupBrowserMocks, type IntersectionObserverMock } from '../../mocks/browser-apis'

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
  let observerMock: IntersectionObserverMock

  beforeEach(() => {
    vi.clearAllMocks()
    observerMock = createMockIntersectionObserver()
  })

  afterEach(() => {
    cleanupBrowserMocks()
  })

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

      observerMock.simulateIntersection(true)
      await nextTick()

      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should stay visible after leaving viewport (once mode)', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { once: true },
      })

      // Become visible
      observerMock.simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Leave viewport - should stay visible
      observerMock.simulateIntersection(false)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should unobserve element after becoming visible in once mode', async () => {
      await mountSuspended(TestComponent, {
        props: { once: true },
      })

      observerMock.simulateIntersection(true)
      await nextTick()

      expect(observerMock.instance.unobserve).toHaveBeenCalled()
    })
  })

  describe('visibility behavior with once: false', () => {
    it('should toggle visibility based on intersection', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { once: false },
      })

      // Become visible
      observerMock.simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Leave viewport
      observerMock.simulateIntersection(false)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Re-enter viewport
      observerMock.simulateIntersection(true)
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })
})
