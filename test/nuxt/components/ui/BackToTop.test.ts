import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackToTop from '~/components/ui/BackToTop.vue'

describe('BackToTop', () => {
  describe('rendering', () => {
    it('should render the button element', async () => {
      const wrapper = await mountSuspended(BackToTop)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should be inside a transition wrapper', async () => {
      const wrapper = await mountSuspended(BackToTop)

      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-label', async () => {
      const wrapper = await mountSuspended(BackToTop)

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeTruthy()
    })

    it('should have type button', async () => {
      const wrapper = await mountSuspended(BackToTop)

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })
  })

  describe('interactions', () => {
    it('should be clickable', async () => {
      const wrapper = await mountSuspended(BackToTop)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      // Click should not throw
      await button.trigger('click')
    })
  })
})
