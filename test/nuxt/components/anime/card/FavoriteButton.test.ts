import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FavoriteButton from '~/components/anime/card/FavoriteButton.vue'

describe('FavoriteButton', () => {
  describe('rendering', () => {
    it('should render as a button with type="button"', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: { isFavorite: false },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
    })
  })

  describe('events', () => {
    it('should emit toggle event on click', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: { isFavorite: false },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('should have aria-pressed="false" when not favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: { isFavorite: false },
      })

      expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
    })

    it('should have aria-pressed="true" when favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: { isFavorite: true },
      })

      expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
    })

    it('should have aria-label attribute', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: { isFavorite: false },
      })

      expect(wrapper.find('button').attributes('aria-label')).toBeDefined()
    })
  })
})
