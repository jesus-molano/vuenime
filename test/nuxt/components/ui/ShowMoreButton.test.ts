import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ShowMoreButton from '~/components/ui/ShowMoreButton.vue'

describe('ShowMoreButton', () => {
  describe('visibility', () => {
    it('should not render when show is false', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: false, count: 10 },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should render when show is true', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: true, count: 10 },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('count display', () => {
    it('should display the count', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: true, count: 25 },
      })

      expect(wrapper.text()).toContain('25')
    })

    it('should display different count values', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: true, count: 100 },
      })

      expect(wrapper.text()).toContain('100')
    })
  })

  describe('events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: true, count: 10 },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('should have type button', async () => {
      const wrapper = await mountSuspended(ShowMoreButton, {
        props: { show: true, count: 10 },
      })

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })
  })
})
