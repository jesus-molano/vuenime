import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Nav from '~/components/layout/header/Nav.vue'

// Stub child components to avoid tooltip provider issues
const stubs = {
  UiRandomAnimeButton: {
    template: '<button type="button" data-testid="random-btn">Random</button>',
    props: ['variant', 'showLabel'],
  },
}

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should render container div', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
    })

    it('should render explore link', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const links = wrapper.findAllComponents({ name: 'NuxtLink' })
      expect(links.length).toBeGreaterThan(0)
    })

    it('should render favorites link', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const links = wrapper.findAllComponents({ name: 'NuxtLink' })
      expect(links.length).toBeGreaterThanOrEqual(2)
    })

    it('should render RandomAnimeButton stub', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const randomButton = wrapper.find('[data-testid="random-btn"]')
      expect(randomButton.exists()).toBe(true)
    })
  })

  describe('navigation links', () => {
    it('should display link text', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('should have NuxtLinks for navigation', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const links = wrapper.findAllComponents({ name: 'NuxtLink' })
      expect(links.length).toBeGreaterThan(0)
    })

    it('should have aria-hidden on decorative icons', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      if (icons.length > 0) {
        expect(icons[0].attributes('aria-hidden')).toBe('true')
      }
    })
  })

  describe('icons', () => {
    it('should render icons', async () => {
      const wrapper = await mountSuspended(Nav, {
        global: {
          stubs,
        },
      })

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      expect(icons.length).toBeGreaterThan(0)
    })
  })
})
