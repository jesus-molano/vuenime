import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroBackground from '~/components/home/HeroBackground.vue'

describe('HeroBackground', () => {
  describe('rendering', () => {
    it('should render a container div', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render blob elements', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      expect(wrapper.find('.blob-1').exists()).toBe(true)
      expect(wrapper.find('.blob-2').exists()).toBe(true)
      expect(wrapper.find('.blob-3').exists()).toBe(true)
    })

    it('should render exactly three blobs', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      const blobs = wrapper.findAll('.blob')
      expect(blobs.length).toBe(3)
    })
  })

  describe('accessibility', () => {
    it('should have aria-hidden="true" for decorative element', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('should be marked as non-interactive', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      // The container should have pointer-events-none class
      expect(wrapper.html()).toContain('pointer-events-none')
    })
  })

  describe('structure', () => {
    it('should have proper DOM structure', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should contain blob elements as children', async () => {
      const wrapper = await mountSuspended(HeroBackground)

      const children = wrapper.findAll('div > div')
      expect(children.length).toBeGreaterThanOrEqual(3)
    })
  })
})
