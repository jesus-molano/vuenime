import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Desktop from '~/components/anime/card/Desktop.vue'
import { createMockAnime, mockAiringAnime } from '../../../../fixtures/anime'

describe('AnimeCardDesktop', () => {
  const mockAnime = createMockAnime({ mal_id: 1, title: 'Test Anime', score: 8.5 })
  const defaultProps = {
    anime: mockAnime,
    animeLink: '/anime/1',
    isFavorite: false,
    isAnimating: false,
    posterStyle: {},
    glareStyle: {},
  }

  describe('rendering', () => {
    it('should render NuxtLink with correct to prop', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.exists()).toBe(true)
      expect(link.props('to')).toBe('/anime/1')
    })

    it('should render NuxtImg with correct src', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.props('src')).toBe(mockAnime.images.webp.large_image_url)
    })

    it('should display anime title in h3', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      expect(wrapper.find('h3').text()).toBe('Test Anime')
    })
  })

  describe('conditional rendering', () => {
    it('should show UiScoreBadge when anime has score', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      const scoreBadge = wrapper.findComponent({ name: 'UiScoreBadge' })
      expect(scoreBadge.exists()).toBe(true)
      expect(scoreBadge.props('score')).toBe(8.5)
    })

    it('should not show UiScoreBadge when anime has no score', async () => {
      const animeNoScore = createMockAnime({ mal_id: 2, score: null })
      const wrapper = await mountSuspended(Desktop, {
        props: { ...defaultProps, anime: animeNoScore },
      })

      expect(wrapper.findComponent({ name: 'UiScoreBadge' }).exists()).toBe(false)
    })

    it('should show UiAiringBadge when anime is airing', async () => {
      const wrapper = await mountSuspended(Desktop, {
        props: { ...defaultProps, anime: mockAiringAnime },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(true)
    })

    it('should not show UiAiringBadge when anime is not airing', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(false)
    })
  })

  describe('favorite button', () => {
    it('should pass isFavorite and isAnimating props correctly', async () => {
      const wrapper = await mountSuspended(Desktop, {
        props: { ...defaultProps, isFavorite: true, isAnimating: true },
      })

      const favoriteBtn = wrapper.findComponent({ name: 'AnimeCardFavoriteButton' })
      expect(favoriteBtn.props('isFavorite')).toBe(true)
      expect(favoriteBtn.props('isAnimating')).toBe(true)
    })

    it('should emit toggle-favorite event when favorite button emits toggle', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      const favoriteBtn = wrapper.findComponent({ name: 'AnimeCardFavoriteButton' })
      await favoriteBtn.vm.$emit('toggle')

      expect(wrapper.emitted('toggle-favorite')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('should have aria-labelledby on link pointing to title id', async () => {
      const wrapper = await mountSuspended(Desktop, { props: defaultProps })

      const link = wrapper.findComponent({ name: 'NuxtLink' })
      expect(link.attributes('aria-labelledby')).toBe('anime-title-desktop-1')
      expect(wrapper.find('h3').attributes('id')).toBe('anime-title-desktop-1')
    })
  })
})
