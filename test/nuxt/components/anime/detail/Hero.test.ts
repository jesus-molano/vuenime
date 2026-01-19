import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Hero from '~/components/anime/detail/Hero.vue'
import { mockAnime, createMockAnime } from '../../../../fixtures/anime'

describe('Hero', () => {
  it('should render section element', async () => {
    const wrapper = await mountSuspended(Hero, {
      props: { anime: mockAnime },
    })

    expect(wrapper.find('section').exists()).toBe(true)
  })

  it('should accept anime prop', async () => {
    const wrapper = await mountSuspended(Hero, {
      props: { anime: mockAnime },
    })

    expect(wrapper.props('anime')).toEqual(mockAnime)
  })

  it('should render with custom anime data', async () => {
    const customAnime = createMockAnime({
      mal_id: 999,
      title: 'Custom Anime Title',
    })

    const wrapper = await mountSuspended(Hero, {
      props: { anime: customAnime },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should render airing anime', async () => {
    const airingAnime = createMockAnime({
      airing: true,
      status: 'Currently Airing',
    })

    const wrapper = await mountSuspended(Hero, {
      props: { anime: airingAnime },
    })

    expect(wrapper.html()).toBeTruthy()
  })

  it('should render anime without score', async () => {
    const noScoreAnime = createMockAnime({ score: null })

    const wrapper = await mountSuspended(Hero, {
      props: { anime: noScoreAnime },
    })

    expect(wrapper.html()).toBeTruthy()
  })
})
