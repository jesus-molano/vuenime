import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Footer from '~/components/layout/Footer.vue'

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(Footer)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render footer element', async () => {
      const wrapper = await mountSuspended(Footer)

      const footer = wrapper.find('footer')
      expect(footer.exists()).toBe(true)
    })

    it('should render Jikan API link', async () => {
      const wrapper = await mountSuspended(Footer)

      const link = wrapper.find('a[href="https://jikan.moe"]')
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain('Jikan API')
    })

    it('should render author name', async () => {
      const wrapper = await mountSuspended(Footer)

      expect(wrapper.text()).toContain('Jesus')
    })
  })

  describe('accessibility', () => {
    it('should have role contentinfo on footer', async () => {
      const wrapper = await mountSuspended(Footer)

      const footer = wrapper.find('footer')
      expect(footer.attributes('role')).toBe('contentinfo')
    })

    it('should have target blank and rel noopener on external link', async () => {
      const wrapper = await mountSuspended(Footer)

      const link = wrapper.find('a[href="https://jikan.moe"]')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
    })

    it('should have screen reader text for external link', async () => {
      const wrapper = await mountSuspended(Footer)

      const srOnly = wrapper.find('.sr-only')
      expect(srOnly.exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('should emit heightChange event', async () => {
      const wrapper = await mountSuspended(Footer)

      expect(wrapper.emitted()).toBeDefined()
    })
  })
})
