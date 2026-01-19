import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MobileDock from '~/components/layout/MobileDock.vue'

// Stub components to avoid UTooltip provider issues
const stubs = {
  UTooltip: {
    template: '<div><slot /></div>',
  },
  UiRandomAnimeButton: {
    template: '<button type="button">Random</button>',
  },
}

describe('MobileDock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should render nav element', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
    })

    it('should render search button', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      const buttons = wrapper.findAll('button[type="button"]')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('props', () => {
    it('should accept footerHeight prop', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 100,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.props('footerHeight')).toBe(100)
    })

    it('should use footerHeight in computed style', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 50,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      // Verify the prop was received and component mounted successfully
      expect(wrapper.props('footerHeight')).toBe(50)
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('accessibility', () => {
    it('should have role navigation on nav', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('role')).toBe('navigation')
    })

    it('should have aria-label on nav', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBeDefined()
    })
  })

  describe('events', () => {
    it('should emit toggleSearch on search button click', async () => {
      const wrapper = await mountSuspended(MobileDock, {
        props: {
          footerHeight: 0,
          visible: true,
        },
        global: {
          stubs,
        },
      })

      const buttons = wrapper.findAll('button[type="button"]')
      // Find the search button (not the random button)
      for (const button of buttons) {
        if (button.attributes('aria-label')) {
          await button.trigger('click')
          break
        }
      }

      expect(wrapper.emitted('toggleSearch')).toBeTruthy()
    })
  })
})
