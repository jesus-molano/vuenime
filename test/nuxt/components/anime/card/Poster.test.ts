import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Poster from '~/components/anime/card/Poster.vue'

describe('AnimeCardPoster', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.webp',
    title: 'Test Anime',
  }

  describe('rendering', () => {
    it('should render NuxtImg with correct src and alt', async () => {
      const wrapper = await mountSuspended(Poster, { props: defaultProps })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.exists()).toBe(true)
      expect(img.props('src')).toBe('https://example.com/image.webp')
      expect(img.attributes('alt')).toBeDefined()
    })
  })

  describe('loading prop', () => {
    it('should default to lazy loading', async () => {
      const wrapper = await mountSuspended(Poster, { props: defaultProps })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.attributes('loading')).toBe('lazy')
    })

    it('should support eager loading', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, loading: 'eager' },
      })

      const img = wrapper.findComponent({ name: 'NuxtImg' })
      expect(img.attributes('loading')).toBe('eager')
    })
  })

  describe('conditional rendering', () => {
    it('should show UiScoreBadge when score is provided', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, score: 8.5 },
      })

      const scoreBadge = wrapper.findComponent({ name: 'UiScoreBadge' })
      expect(scoreBadge.exists()).toBe(true)
      expect(scoreBadge.props('score')).toBe(8.5)
    })

    it('should not show UiScoreBadge when score is null', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, score: null },
      })

      expect(wrapper.findComponent({ name: 'UiScoreBadge' }).exists()).toBe(false)
    })

    it('should show UiAiringBadge when airing is true', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, airing: true },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(true)
    })

    it('should not show UiAiringBadge when airing is false', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, airing: false },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(false)
    })
  })

  describe('badge positions', () => {
    it('should position score badge top-right by default', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, score: 8.5 },
      })

      expect(wrapper.findComponent({ name: 'UiScoreBadge' }).props('position')).toBe('top-right')
    })

    it('should support custom score badge position', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, score: 8.5, scorePosition: 'top-left' },
      })

      expect(wrapper.findComponent({ name: 'UiScoreBadge' }).props('position')).toBe('top-left')
    })

    it('should position airing badge top-left by default', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: { ...defaultProps, airing: true },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).props('position')).toBe('top-left')
    })
  })

  describe('slots', () => {
    it('should render default slot content', async () => {
      const wrapper = await mountSuspended(Poster, {
        props: defaultProps,
        slots: { default: '<div class="custom-overlay">Custom Overlay</div>' },
      })

      expect(wrapper.find('.custom-overlay').text()).toBe('Custom Overlay')
    })
  })
})
