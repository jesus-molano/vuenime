import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Logo from '~/components/layout/header/Logo.vue'

describe('Logo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should render NuxtLink', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.exists()).toBe(true)
    })

    it('should display VueNime text', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      expect(wrapper.text()).toContain('Vue')
      expect(wrapper.text()).toContain('Nime')
    })

    it('should render straw hat image', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.exists()).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept isScrolled prop as false', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      expect(wrapper.props('isScrolled')).toBe(false)
    })

    it('should accept isScrolled prop as true', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: true,
        },
      })

      expect(wrapper.props('isScrolled')).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on link', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.attributes('aria-label')).toBeDefined()
    })

    it('should have aria-hidden on decorative image', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.attributes('aria-hidden')).toBe('true')
    })

    it('should have alt text on image', async () => {
      const wrapper = await mountSuspended(Logo, {
        props: {
          isScrolled: false,
        },
      })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.attributes('alt')).toBeDefined()
    })
  })
})
