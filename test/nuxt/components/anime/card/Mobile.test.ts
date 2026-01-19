import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Mobile from '~/components/anime/card/Mobile.vue'
import { createMockAnime, mockAiringAnime } from '../../../../fixtures/anime'

describe('AnimeCardMobile', () => {
  const mockAnime = createMockAnime({ mal_id: 1, title: 'Test Anime', score: 8.5 })
  const defaultProps = {
    anime: mockAnime,
    animeLink: '/anime/1',
    isFavorite: false,
    isAnimating: false,
  }

  describe('rendering', () => {
    it('should render NuxtLink with correct to prop', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.exists()).toBe(true)
      expect(link.props('to')).toBe('/anime/1')
    })

    it('should render AnimeCardPoster with correct props', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      const poster = wrapper.findComponent({ name: 'AnimeCardPoster' })
      // Mobile uses medium-sized images (image_url) for better performance
      expect(poster.props('imageUrl')).toBe(mockAnime.images.webp.image_url)
      expect(poster.props('title')).toBe('Test Anime')
      expect(poster.props('score')).toBe(8.5)
    })

    it('should display anime title in h3', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      expect(wrapper.find('h3').text()).toBe('Test Anime')
    })
  })

  describe('conditional rendering', () => {
    it('should show UiAiringBadge when anime is airing', async () => {
      const wrapper = await mountSuspended(Mobile, {
        props: { ...defaultProps, anime: mockAiringAnime },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(true)
    })

    it('should not show UiAiringBadge when anime is not airing', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(false)
    })
  })

  describe('favorite button', () => {
    it('should pass isFavorite and isAnimating props correctly', async () => {
      const wrapper = await mountSuspended(Mobile, {
        props: { ...defaultProps, isFavorite: true, isAnimating: true },
      })

      const favoriteBtn = wrapper.findComponent({ name: 'AnimeCardFavoriteButton' })
      expect(favoriteBtn.props('isFavorite')).toBe(true)
      expect(favoriteBtn.props('isAnimating')).toBe(true)
    })

    it('should emit toggle-favorite event when favorite button emits toggle', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      const favoriteBtn = wrapper.findComponent({ name: 'AnimeCardFavoriteButton' })
      await favoriteBtn.vm.$emit('toggle')

      expect(wrapper.emitted('toggle-favorite')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('should have aria-labelledby on link pointing to title id', async () => {
      const wrapper = await mountSuspended(Mobile, { props: defaultProps })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.attributes('aria-labelledby')).toBe('anime-title-mobile-1')
      expect(wrapper.find('h3').attributes('id')).toBe('anime-title-mobile-1')
    })
  })
})
