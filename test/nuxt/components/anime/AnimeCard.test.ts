import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnimeCard from '~/components/anime/AnimeCard.vue'
import { mockAnime } from '../../../fixtures/anime'

describe('AnimeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render card wrapper', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.find('.card-perspective').exists()).toBe(true)
    })

    it('should render 3D card container', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.find('.card-3d').exists()).toBe(true)
    })

    it('should render card inner', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.find('.card-inner').exists()).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept anime prop', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.props('anime')).toEqual(mockAnime)
    })

    it('should have default animateOnRemove as false', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.props('animateOnRemove')).toBe(false)
    })

    it('should accept animateOnRemove prop', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
          animateOnRemove: true,
        },
      })

      expect(wrapper.props('animateOnRemove')).toBe(true)
    })
  })

  describe('mouse interactions', () => {
    it('should handle mouseenter event', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const cardWrapper = wrapper.find('.card-perspective')
      await cardWrapper.trigger('mouseenter')

      // Should not throw
      expect(wrapper.html()).toBeTruthy()
    })

    it('should handle mousemove event', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const cardWrapper = wrapper.find('.card-perspective')
      await cardWrapper.trigger('mousemove', { clientX: 100, clientY: 100 })

      expect(wrapper.html()).toBeTruthy()
    })

    it('should handle mouseleave event', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const cardWrapper = wrapper.find('.card-perspective')
      await cardWrapper.trigger('mouseleave')

      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('glow border', () => {
    it('should have glow border element', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      expect(wrapper.find('.card-border').exists()).toBe(true)
    })

    it('should be hidden on mobile (max-sm:hidden)', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const border = wrapper.find('.card-border')
      expect(border.classes()).toContain('max-sm:hidden')
    })
  })

  describe('mobile and desktop variants', () => {
    it('should render mobile card component', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      // Mobile variant is visible on mobile (sm:hidden on desktop)
      const mobileLink = wrapper.find('a.sm\\:hidden')
      expect(mobileLink.exists()).toBe(true)
    })

    it('should render desktop card component', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      // Desktop variant is hidden on mobile (hidden sm:block)
      const desktopContainer = wrapper.find('.sm\\:block')
      expect(desktopContainer.exists()).toBe(true)
    })
  })

  describe('styling', () => {
    it('should have rounded corners', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const card3d = wrapper.find('.card-3d')
      expect(card3d.classes()).toContain('rounded-2xl')
    })

    it('should have group class for hover effects', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const cardWrapper = wrapper.find('.card-perspective')
      expect(cardWrapper.classes()).toContain('group')
    })

    it('should have relative positioning', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      const cardWrapper = wrapper.find('.card-perspective')
      expect(cardWrapper.classes()).toContain('relative')
    })
  })

  describe('accessibility', () => {
    it('should have proper DOM structure', async () => {
      const wrapper = await mountSuspended(AnimeCard, {
        props: {
          anime: mockAnime,
        },
      })

      // Card should be properly structured
      expect(wrapper.element.tagName).toBe('DIV')
    })
  })
})
