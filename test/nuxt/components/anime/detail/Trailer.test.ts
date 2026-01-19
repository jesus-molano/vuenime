import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Trailer from '~/components/anime/detail/Trailer.vue'
import { mockAnime, createMockAnime } from '../../../../fixtures/anime'

describe('Trailer', () => {
  describe('with trailer', () => {
    it('should render iframe when trailer is available', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: {
            youtube_id: 'abc123',
            url: 'https://www.youtube.com/watch?v=abc123',
            embed_url: 'https://www.youtube.com/embed/abc123',
          },
        },
      })

      expect(wrapper.find('iframe').exists()).toBe(true)
    })

    it('should have correct iframe src', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: {
            youtube_id: 'abc123',
            url: '',
            embed_url: 'https://www.youtube.com/embed/abc123',
          },
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('abc123')
      expect(iframe.attributes('src')).toContain('youtube.com/embed')
    })

    it('should have allowfullscreen and lazy loading', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: { youtube_id: 'abc123', url: '', embed_url: '' },
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('allowfullscreen')).toBeDefined()
      expect(iframe.attributes('loading')).toBe('lazy')
    })
  })

  describe('without trailer', () => {
    it('should not render iframe when trailer is null', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: { anime: mockAnime, trailer: null },
      })

      expect(wrapper.find('iframe').exists()).toBe(false)
    })

    it('should show no trailer message', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: { anime: mockAnime, trailer: null },
      })

      expect(wrapper.find('.flex.aspect-video.flex-col.items-center').exists()).toBe(true)
    })
  })

  describe('stats sidebar', () => {
    it('should show score when available', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: { anime: createMockAnime({ score: 8.5 }), trailer: null },
      })

      expect(wrapper.text()).toContain('8.50')
    })

    it('should show rank when available', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: { anime: createMockAnime({ rank: 100 }), trailer: null },
      })

      expect(wrapper.text()).toContain('100')
    })
  })

  describe('structure', () => {
    it('should have section element with headings', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: { anime: mockAnime, trailer: null },
      })

      expect(wrapper.find('section').exists()).toBe(true)
      expect(wrapper.findAll('h2').length).toBeGreaterThanOrEqual(2)
    })
  })
})
