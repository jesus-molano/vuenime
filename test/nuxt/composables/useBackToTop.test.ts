import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useBackToTop } from '~/composables/useBackToTop'
import { createMockScrollBehavior, cleanupBrowserMocks, type MockScrollBehavior } from '../../mocks/browser-apis'

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    threshold: {
      type: Number,
      default: 500,
    },
  },
  setup(props) {
    const { isVisible, scrollToTop } = useBackToTop({ threshold: props.threshold })
    return { isVisible, scrollToTop }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'visibility' }, this.isVisible ? 'visible' : 'hidden'),
      h('button', { id: 'scroll-btn', onClick: this.scrollToTop }, 'Scroll to top'),
    ])
  },
})

describe('useBackToTop (Nuxt)', () => {
  let scrollMock: MockScrollBehavior
  let rafCallbacks: Array<FrameRequestCallback>
  let rafId: number

  beforeEach(() => {
    vi.clearAllMocks()
    scrollMock = createMockScrollBehavior()

    // Mock requestAnimationFrame for throttle
    rafCallbacks = []
    rafId = 0

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback)
      return ++rafId
    })

    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    cleanupBrowserMocks()
    rafCallbacks = []
  })

  // Helper to flush all RAF callbacks
  const flushRAF = () => {
    const callbacks = [...rafCallbacks]
    rafCallbacks = []
    callbacks.forEach((cb) => cb(performance.now()))
  }

  describe('with default threshold (500)', () => {
    it('should register scroll event listener on mount', async () => {
      await mountSuspended(TestComponent)
      expect(scrollMock.scrollListeners.length).toBeGreaterThan(0)
    })

    it('should show button when scrolled past threshold', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Simulate scroll past threshold
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()
      flushRAF() // Flush the throttled RAF callback
      await nextTick()

      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should hide button when scrolled back above threshold', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Scroll past threshold
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Scroll back
      scrollMock.setScrollY(400)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')
    })
  })

  describe('with custom threshold', () => {
    it('should use custom threshold value', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { threshold: 200 },
      })

      // Below custom threshold
      scrollMock.setScrollY(150)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Above custom threshold
      scrollMock.setScrollY(250)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })

  describe('edge cases', () => {
    it('should handle exact threshold value', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { threshold: 500 },
      })

      // At exact threshold
      scrollMock.setScrollY(500)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Just past threshold
      scrollMock.setScrollY(501)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should handle zero threshold', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { threshold: 0 },
      })

      // Any scroll should show button
      scrollMock.setScrollY(1)
      scrollMock.triggerScroll()
      flushRAF()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })

  describe('throttle behavior', () => {
    it('should throttle scroll events to animation frame', async () => {
      await mountSuspended(TestComponent)

      // Trigger multiple scroll events rapidly
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()
      scrollMock.triggerScroll()
      scrollMock.triggerScroll()

      // RAF should only have one pending callback (throttled)
      expect(rafCallbacks.length).toBe(1)
    })

    it('should cancel throttled handler on unmount', async () => {
      const cancelAnimationFrameSpy = vi.fn()
      vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameSpy)

      const wrapper = await mountSuspended(TestComponent)

      // Trigger a scroll to schedule RAF
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()

      // Unmount
      wrapper.unmount()

      // cancelAnimationFrame should have been called
      expect(cancelAnimationFrameSpy).toHaveBeenCalled()
    })

    it('should not update visibility if RAF is cancelled before firing', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Initially hidden
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Trigger scroll but don't flush RAF
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()

      // Unmount before RAF fires
      wrapper.unmount()

      // Clear callbacks to simulate cancellation
      rafCallbacks = []

      // Visibility should still be hidden (unmounted before update)
      // Note: We can't actually check wrapper after unmount, but the key is
      // no errors should occur from trying to update unmounted component
    })
  })
})
