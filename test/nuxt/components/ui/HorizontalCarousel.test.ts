import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import HorizontalCarousel from '~/components/ui/HorizontalCarousel.vue'

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

describe('HorizontalCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render with slot content', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', { class: 'test-item' }, 'Test Item'),
        },
      })

      expect(wrapper.find('.test-item').exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Item')
    })

    it('should have scrollable container', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')
      expect(scrollContainer.exists()).toBe(true)
      expect(scrollContainer.classes()).toContain('overflow-x-auto')
    })
  })

  describe('navigation buttons', () => {
    it('should have left navigation button', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('should have right navigation button', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('should have aria-labels on navigation buttons', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach((button) => {
        expect(button.attributes('aria-label')).toBeDefined()
      })
    })
  })

  describe('scroll behavior', () => {
    it('should have snap-x class for scroll snapping', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')
      expect(scrollContainer.classes()).toContain('snap-x')
      expect(scrollContainer.classes()).toContain('snap-mandatory')
    })

    it('should have gap classes for spacing', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')
      expect(scrollContainer.classes().join(' ')).toContain('gap-')
    })
  })

  describe('drag functionality', () => {
    it('should have cursor-grab class', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')
      expect(scrollContainer.classes()).toContain('cursor-grab')
    })

    it('should handle mousedown event', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')

      // Should not throw
      await scrollContainer.trigger('mousedown', { pageX: 100 })
    })

    it('should handle mousemove event', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')

      // Should not throw
      await scrollContainer.trigger('mousemove', { pageX: 150 })
    })

    it('should handle mouseup event', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')

      // Should not throw
      await scrollContainer.trigger('mouseup')
    })

    it('should handle mouseleave event', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const scrollContainer = wrapper.find('.carousel-scroll')

      // Should not throw
      await scrollContainer.trigger('mouseleave')
    })
  })

  describe('styling', () => {
    it('should have relative positioning on container', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      const container = wrapper.find('.group\\/carousel')
      expect(container.classes()).toContain('relative')
    })

    it('should hide scrollbar (via CSS)', async () => {
      const wrapper = await mountSuspended(HorizontalCarousel, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      // Verify the carousel-scroll class exists (which has the CSS to hide scrollbar)
      const scrollContainer = wrapper.find('.carousel-scroll')
      expect(scrollContainer.exists()).toBe(true)
    })
  })
})
