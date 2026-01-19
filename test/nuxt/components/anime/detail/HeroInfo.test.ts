import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroInfo from '~/components/anime/detail/HeroInfo.vue'
import { mockAnime, createMockAnime } from '../../../../fixtures/anime'

describe('HeroInfo', () => {
  it('should render main title', async () => {
    const wrapper = await mountSuspended(HeroInfo, {
      props: { anime: mockAnime },
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
      props: { anime: animeWithJapanese },
    })

    expect(wrapper.text()).toContain('Hagane no Renkinjutsushi')
  })

  it('should show meta info badges', async () => {
    const wrapper = await mountSuspended(HeroInfo, {
      props: {
        anime: createMockAnime({
          type: 'TV',
          year: 2023,
          rating: 'PG-13',
          duration: '24 min',
          episodes: 12,
          rank: 5,
          popularity: 10,
        }),
      },
    })

    expect(wrapper.text()).toContain('TV')
    expect(wrapper.text()).toContain('2023')
    expect(wrapper.text()).toContain('PG-13')
    expect(wrapper.text()).toContain('24 min')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('#5')
    expect(wrapper.text()).toContain('#10')
  })

  it('should render genres when available', async () => {
    const wrapper = await mountSuspended(HeroInfo, {
      props: { anime: mockAnime },
    })

    expect(wrapper.text()).toContain('Action')
  })

  it('should render studios when available', async () => {
    const animeWithStudios = createMockAnime({
      studios: [{ mal_id: 1, type: 'anime', name: 'Bones', url: '' }],
    })

    const wrapper = await mountSuspended(HeroInfo, {
      props: { anime: animeWithStudios },
    })

    expect(wrapper.text()).toContain('Bones')
  })

  it('should have MAL link with security attributes', async () => {
    const wrapper = await mountSuspended(HeroInfo, {
      props: { anime: mockAnime },
    })

    const malLink = wrapper.find('a[target="_blank"]')
    expect(malLink.exists()).toBe(true)
    expect(malLink.attributes('href')).toBe(mockAnime.url)
    expect(malLink.attributes('rel')).toContain('noopener')
    expect(malLink.attributes('rel')).toContain('noreferrer')
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
      props: { anime: animeWithTrailer },
    })

    const trailerLink = wrapper.find('a[href*="youtube.com/watch"]')
    expect(trailerLink.exists()).toBe(true)
  })

  it('should not show trailer button when no trailer', async () => {
    // Test edge case where trailer might be undefined at runtime
    const animeWithoutTrailer = createMockAnime({
      trailer: {
        youtube_id: null,
        url: null,
        embed_url: null,
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
      props: { anime: animeWithoutTrailer },
    })

    const trailerLink = wrapper.find('a[href*="youtube.com/watch"]')
    expect(trailerLink.exists()).toBe(false)
  })
})
