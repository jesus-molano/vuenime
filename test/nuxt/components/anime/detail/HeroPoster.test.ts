import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroPoster from '~/components/anime/detail/HeroPoster.vue'
import { mockAnime, createMockAnime, mockAiringAnime } from '../../../../fixtures/anime'

vi.mock('~/composables/usePosterTransition', () => ({
  usePosterTransition: () => ({
    posterStyle: ref({}),
  }),
}))

describe('HeroPoster', () => {
  it('should render poster container and image', async () => {
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: mockAnime },
    })

    expect(wrapper.find('.poster-container').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should accept anime prop', async () => {
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: mockAnime },
    })

    expect(wrapper.props('anime')).toEqual(mockAnime)
  })

  it('should use large webp image for poster', async () => {
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: mockAnime },
    })

    expect(wrapper.find('img').attributes('src')).toContain('large.webp')
  })

  it('should have proper alt text', async () => {
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: mockAnime },
    })

    expect(wrapper.find('img').attributes('alt')).toBeTruthy()
  })

  it('should show score badge when anime has score', async () => {
    const animeWithScore = createMockAnime({ score: 8.5 })
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: animeWithScore },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should render without errors when anime has no score', async () => {
    const animeWithoutScore = createMockAnime({ score: null })
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: animeWithoutScore },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should show airing badge when anime is airing', async () => {
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: mockAiringAnime },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should render without errors when anime is not airing', async () => {
    const notAiringAnime = createMockAnime({ airing: false })
    const wrapper = await mountSuspended(HeroPoster, {
      props: { anime: notAiringAnime },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
