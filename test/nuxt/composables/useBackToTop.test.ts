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

  beforeEach(() => {
    vi.clearAllMocks()
    scrollMock = createMockScrollBehavior()
  })

  afterEach(() => {
    cleanupBrowserMocks()
  })

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
      await nextTick()

      expect(wrapper.find('#visibility').text()).toBe('visible')
    })

    it('should hide button when scrolled back above threshold', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Scroll past threshold
      scrollMock.setScrollY(600)
      scrollMock.triggerScroll()
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')

      // Scroll back
      scrollMock.setScrollY(400)
      scrollMock.triggerScroll()
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
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Above custom threshold
      scrollMock.setScrollY(250)
      scrollMock.triggerScroll()
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
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('hidden')

      // Just past threshold
      scrollMock.setScrollY(501)
      scrollMock.triggerScroll()
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
      await nextTick()
      expect(wrapper.find('#visibility').text()).toBe('visible')
    })
  })
})
