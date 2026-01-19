import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroInfo from '~/components/anime/detail/HeroInfo.vue'
import { mockAnime, createMockAnime } from '../../fixtures/anime'

describe('HeroInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('title rendering', () => {
    it('should render main title', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      const title = wrapper.find('h1')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe(mockAnime.title)
    })

    it('should render japanese title when different from main', async () => {
      const animeWithJapanese = createMockAnime({
        title: 'Fullmetal Alchemist',
        title_japanese: 'Hagane no Renkinjutsushi',
      })

      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: animeWithJapanese,
        },
      })

      expect(wrapper.text()).toContain('Hagane no Renkinjutsushi')
    })

    it('should not show japanese title when same as main', async () => {
      const animeWithSameTitle = createMockAnime({
        title: 'Test Anime',
        title_japanese: 'Test Anime',
      })

      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: animeWithSameTitle,
        },
      })

      // Should only appear once
      const occurrences = wrapper.text().split('Test Anime').length - 1
      expect(occurrences).toBe(1)
    })
  })

  describe('meta info badges', () => {
    it('should show type badge when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ type: 'TV' }),
        },
      })

      expect(wrapper.text()).toContain('TV')
    })

    it('should show year badge when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ year: 2023 }),
        },
      })

      expect(wrapper.text()).toContain('2023')
    })

    it('should show rating when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ rating: 'PG-13' }),
        },
      })

      expect(wrapper.text()).toContain('PG-13')
    })

    it('should show duration when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ duration: '24 min' }),
        },
      })

      expect(wrapper.text()).toContain('24 min')
    })

    it('should show episode count when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ episodes: 12 }),
        },
      })

      expect(wrapper.text()).toContain('12')
    })

    it('should show rank when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ rank: 5 }),
        },
      })

      expect(wrapper.text()).toContain('#5')
    })

    it('should show popularity when available', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: createMockAnime({ popularity: 10 }),
        },
      })

      expect(wrapper.text()).toContain('#10')
    })
  })

  describe('genres', () => {
    it('should render genres component when genres exist', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      // mockAnime has genres: Action, Adventure, Fantasy
      // Should render at least some genre names
      expect(wrapper.text()).toContain('Action')
    })
  })

  describe('studios', () => {
    it('should render studios when available', async () => {
      const animeWithStudios = createMockAnime({
        studios: [{ mal_id: 1, type: 'anime', name: 'Bones', url: '' }],
      })

      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: animeWithStudios,
        },
      })

      expect(wrapper.text()).toContain('Bones')
    })
  })

  describe('MyAnimeList link', () => {
    it('should have MAL link', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      const malLink = wrapper.find('a[target="_blank"]')
      expect(malLink.exists()).toBe(true)
      expect(malLink.attributes('href')).toBe(mockAnime.url)
    })

    it('should have rel="noopener noreferrer" on external link', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      const malLink = wrapper.find('a[target="_blank"]')
      expect(malLink.attributes('rel')).toContain('noopener')
      expect(malLink.attributes('rel')).toContain('noreferrer')
    })
  })

  describe('action buttons', () => {
    it('should have favorite button', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      // Should render AnimeCardFavoriteButton component with a button element
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should show trailer button when trailer available', async () => {
      const animeWithTrailer = createMockAnime({
        trailer: {
          youtube_id: 'abc123',
          url: 'https://youtube.com/watch?v=abc123',
          embed_url: 'https://youtube.com/embed/abc123',
          images: {
            image_url: null,
            small_image_url: null,
            medium_image_url: null,
            large_image_url: null,
            maximum_image_url: null,
          },
        },
      })

      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: animeWithTrailer,
        },
      })

      const trailerLink = wrapper.find('a[href*="youtube.com/watch"]')
      expect(trailerLink.exists()).toBe(true)
    })

    it('should not show trailer button when no trailer', async () => {
      const animeWithoutTrailer = createMockAnime({
        trailer: null,
      })

      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: animeWithoutTrailer,
        },
      })

      const trailerLink = wrapper.find('a[href*="youtube.com/watch"]')
      expect(trailerLink.exists()).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      const wrapper = await mountSuspended(HeroInfo, {
        props: {
          anime: mockAnime,
        },
      })

      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
    })
  })
})
