import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Content from '~/components/anime/card/Content.vue'
import { mockGenres } from '../../../../fixtures/anime'

describe('AnimeCardContent', () => {
  describe('rendering', () => {
    it('should render the title in an h3 element', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime Title' },
      })

      expect(wrapper.find('h3').text()).toBe('Test Anime Title')
    })

    it('should set titleId attribute on h3 when provided', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', titleId: 'anime-title-123' },
      })

      expect(wrapper.find('h3').attributes('id')).toBe('anime-title-123')
    })
  })

  describe('conditional rendering', () => {
    it('should show AnimeCardInfo when showInfo is true (default)', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', year: 2024, episodes: 12 },
      })

      const info = wrapper.findComponent({ name: 'AnimeCardInfo' })
      expect(info.exists()).toBe(true)
      expect(info.props('year')).toBe(2024)
      expect(info.props('episodes')).toBe(12)
    })

    it('should not show AnimeCardInfo when showInfo is false', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', showInfo: false },
      })

      expect(wrapper.findComponent({ name: 'AnimeCardInfo' }).exists()).toBe(false)
    })

    it('should show AnimeCardGenres when genres array is not empty', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', genres: mockGenres },
      })

      const genres = wrapper.findComponent({ name: 'AnimeCardGenres' })
      expect(genres.exists()).toBe(true)
      expect(genres.props('genres')).toEqual(mockGenres)
    })

    it('should not show AnimeCardGenres when genres is empty or null', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', genres: [] },
      })

      expect(wrapper.findComponent({ name: 'AnimeCardGenres' }).exists()).toBe(false)
    })

    it('should show UiAiringBadge only when airing and showAiringInline are true', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', airing: true, showAiringInline: true },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(true)
    })

    it('should not show UiAiringBadge when showAiringInline is false', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime', airing: true },
      })

      expect(wrapper.findComponent({ name: 'UiAiringBadge' }).exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('should render default slot content', async () => {
      const wrapper = await mountSuspended(Content, {
        props: { title: 'Test Anime' },
        slots: { default: '<div class="custom-slot">Custom Content</div>' },
      })

      expect(wrapper.find('.custom-slot').text()).toBe('Custom Content')
    })
  })
})
