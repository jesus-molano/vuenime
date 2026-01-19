import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Trailer from '~/components/anime/detail/Trailer.vue'
import { mockAnime, createMockAnime } from '../../fixtures/anime'

describe('Trailer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(true)
    })

    it('should have correct iframe src', async () => {
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

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('src')).toContain('abc123')
      expect(iframe.attributes('src')).toContain('youtube.com/embed')
    })

    it('should extract youtube ID from embed_url if youtube_id not available', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: {
            youtube_id: '',
            url: '',
            embed_url: 'https://www.youtube.com/embed/xyz789',
          },
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(true)
      expect(iframe.attributes('src')).toContain('xyz789')
    })

    it('should have allowfullscreen attribute', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: {
            youtube_id: 'abc123',
            url: '',
            embed_url: '',
          },
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('allowfullscreen')).toBeDefined()
    })

    it('should have lazy loading', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: {
            youtube_id: 'abc123',
            url: '',
            embed_url: '',
          },
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.attributes('loading')).toBe('lazy')
    })
  })

  describe('without trailer', () => {
    it('should show no trailer state when trailer is null', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: null,
        },
      })

      const iframe = wrapper.find('iframe')
      expect(iframe.exists()).toBe(false)
    })

    it('should show no trailer message', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: null,
        },
      })

      // Should show no trailer icon and message
      const noTrailerSection = wrapper.find('.flex.aspect-video.flex-col.items-center')
      expect(noTrailerSection.exists()).toBe(true)
    })
  })

  describe('stats sidebar', () => {
    it('should show score when available', async () => {
      const animeWithScore = createMockAnime({ score: 8.5 })
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: animeWithScore,
          trailer: null,
        },
      })

      expect(wrapper.text()).toContain('8.50')
    })

    it('should show rank when available', async () => {
      const animeWithRank = createMockAnime({ rank: 100 })
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: animeWithRank,
          trailer: null,
        },
      })

      expect(wrapper.text()).toContain('100')
    })

    it('should show popularity when available', async () => {
      const animeWithPopularity = createMockAnime({ popularity: 50 })
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: animeWithPopularity,
          trailer: null,
        },
      })

      expect(wrapper.text()).toContain('50')
    })
  })

  describe('additional info', () => {
    it('should show status when available', async () => {
      const animeWithStatus = createMockAnime({ status: 'Finished Airing' })
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: animeWithStatus,
          trailer: null,
        },
      })

      expect(wrapper.text()).toContain('Finished Airing')
    })

    it('should show source when available', async () => {
      const animeWithSource = createMockAnime({ source: 'Manga' })
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: animeWithSource,
          trailer: null,
        },
      })

      expect(wrapper.text()).toContain('Manga')
    })
  })

  describe('section structure', () => {
    it('should have section element', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: null,
        },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should have h2 headings', async () => {
      const wrapper = await mountSuspended(Trailer, {
        props: {
          anime: mockAnime,
          trailer: null,
        },
      })

      const headings = wrapper.findAll('h2')
      expect(headings.length).toBeGreaterThanOrEqual(2)
    })
  })
})
