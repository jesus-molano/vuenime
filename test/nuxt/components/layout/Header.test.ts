import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Header from '~/components/layout/Header.vue'

// Stub child components
const stubs = {
  LayoutHeaderLogo: {
    template: '<div data-testid="logo">Logo</div>',
    props: ['isScrolled'],
  },
  LayoutHeaderNav: {
    template: '<div data-testid="nav-links">Nav</div>',
  },
  LayoutHeaderActions: {
    template: '<div data-testid="actions">Actions</div>',
  },
  LayoutSearchPill: {
    template: '<button data-testid="search-pill" @click="$emit(\'click\')">Search</button>',
    emits: ['click'],
  },
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should render header element', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
    })

    it('should render nav element', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept isScrolled prop as false', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.props('isScrolled')).toBe(false)
    })

    it('should accept isScrolled prop as true', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: true,
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.props('isScrolled')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have role navigation on nav', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('role')).toBe('navigation')
    })

    it('should have aria-label on nav', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
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
    it('should emit search event when SearchPill is clicked', async () => {
      const wrapper = await mountSuspended(Header, {
        props: {
          isScrolled: false,
        },
        global: {
          stubs,
        },
      })

      const searchPill = wrapper.find('[data-testid="search-pill"]')
      await searchPill.trigger('click')

      expect(wrapper.emitted('search')).toBeTruthy()
    })
  })
})
