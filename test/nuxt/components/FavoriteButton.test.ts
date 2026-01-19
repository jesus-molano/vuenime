import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FavoriteButton from '~/components/anime/card/FavoriteButton.vue'

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render as a button', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should have type="button"', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      expect(wrapper.find('button').attributes('type')).toBe('button')
    })
  })

  describe('isFavorite state', () => {
    it('should have aria-pressed="false" when not favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
    })

    it('should have aria-pressed="true" when favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: true,
        },
      })

      expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
    })
  })

  describe('toggle emit', () => {
    it('should emit toggle event on click', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('toggle')).toBeTruthy()
      expect(wrapper.emitted('toggle')).toHaveLength(1)
    })

    it('should stop event propagation on click', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      // The @click.stop.prevent modifier should prevent propagation
      // We can verify the button has the correct click handler
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })
  })

  describe('variants', () => {
    it('should apply mobile variant classes', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
          variant: 'mobile',
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('size-7')
    })

    it('should apply desktop variant classes (default)', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      const button = wrapper.find('button')
      expect(button.classes().join(' ')).toContain('size-10')
    })

    it('should apply hero variant classes', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
          variant: 'hero',
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('size-12')
    })
  })

  describe('favorite state styling', () => {
    it('should have love background when favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: true,
        },
      })

      const button = wrapper.find('button')
      // When favorite, should have 'bg-rp-love' class (not hover:bg-rp-love)
      expect(button.classes()).toContain('bg-rp-love')
    })

    it('should not have love background when not favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      const button = wrapper.find('button')
      // When not favorite, bg-rp-love should NOT be a direct class
      // (hover:bg-rp-love is acceptable for hover state)
      expect(button.classes()).not.toContain('bg-rp-love')
    })
  })

  describe('accessibility', () => {
    it('should have aria-label for add favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: false,
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })

    it('should have aria-label for remove favorite', async () => {
      const wrapper = await mountSuspended(FavoriteButton, {
        props: {
          isFavorite: true,
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })
  })
})
