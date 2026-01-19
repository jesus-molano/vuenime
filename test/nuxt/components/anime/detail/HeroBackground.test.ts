import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroBackground from '~/components/anime/detail/HeroBackground.vue'

describe('HeroBackground', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/anime.webp',
    title: 'Test Anime',
  }

  it('should render container and background image', async () => {
    const wrapper = await mountSuspended(HeroBackground, { props: defaultProps })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should accept imageUrl and title props', async () => {
    const wrapper = await mountSuspended(HeroBackground, {
      props: {
        imageUrl: 'https://example.com/custom-image.webp',
        title: 'My Custom Anime Title',
      },
    })

    expect(wrapper.props('imageUrl')).toBe('https://example.com/custom-image.webp')
    expect(wrapper.props('title')).toBe('My Custom Anime Title')
  })

  it('should set image src and alt attributes correctly', async () => {
    const wrapper = await mountSuspended(HeroBackground, {
      props: {
        imageUrl: 'https://example.com/background.webp',
        title: 'Awesome Anime',
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/background.webp')
    expect(img.attributes('alt')).toBe('Awesome Anime')
  })

  it('should have lazy loading attribute', async () => {
    const wrapper = await mountSuspended(HeroBackground, { props: defaultProps })

    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })
})
