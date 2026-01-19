import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useBackToTop } from '~/composables/useBackToTop'

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
  let mockScrollTo: ReturnType<typeof vi.fn>
  let scrollListeners: Array<() => void> = []

  beforeEach(() => {
    vi.clearAllMocks()
    scrollListeners = []

    // Mock scrollTo
    mockScrollTo = vi.fn()
    vi.stubGlobal('scrollTo', mockScrollTo)

    // Mock addEventListener to capture scroll handlers
    const originalAddEventListener = window.addEventListener.bind(window)
    vi.stubGlobal('addEventListener', (event: string, handler: EventListener, options?: boolean | AddEventListenerOptions) => {
      if (event === 'scroll') {
        scrollListeners.push(handler as () => void)
      }
      return originalAddEventListener(event, handler, options)
    })

    // Reset scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('with default threshold (500)', () => {
    it('should register scroll event listener on mount', async () => {
      await mountSuspended(TestComponent)
      expect(scrollListeners.length).toBeGreaterThan(0)
    })

    it('should show button when scrolled past threshold', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Simulate scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()

      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should hide button when scrolled back above threshold', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Scroll back
      Object.defineProperty(window, 'scrollY', { value: 400, configurable: true })
      scrollListeners.forEach((handler) => handler())
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
      Object.defineProperty(window, 'scrollY', { value: 150, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Above custom threshold
      Object.defineProperty(window, 'scrollY', { value: 250, configurable: true })
      scrollListeners.forEach((handler) => handler())
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
      Object.defineProperty(window, 'scrollY', { value: 500, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Just past threshold
      Object.defineProperty(window, 'scrollY', { value: 501, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should handle zero threshold', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { threshold: 0 },
      })

      // Any scroll should show button
      Object.defineProperty(window, 'scrollY', { value: 1, configurable: true })
      scrollListeners.forEach((handler) => handler())
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })
})
