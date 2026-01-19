import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EpisodeGridItem from '~/components/anime/detail/EpisodeGridItem.vue'
import type { Episode } from '~~/shared/types/anime'

const createMockEpisode = (overrides: Partial<Episode> = {}): Episode => ({
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1/episode/1',
  title: 'Episode Title',
  title_japanese: null,
  title_romanji: null,
  aired: '2024-01-01',
  score: 8.5,
  filler: false,
  recap: false,
  ...overrides,
})

describe('EpisodeGridItem', () => {
  it('should render episode number and title', async () => {
    const episode = createMockEpisode({ mal_id: 5, title: 'The Beginning' })
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('The Beginning')
  })

  it('should show fallback when title is empty', async () => {
    const episode = createMockEpisode({ mal_id: 3, title: '' })
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('3')
  })

  it('should emit toggleWatched when button is clicked', async () => {
    const episode = createMockEpisode()
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')

    await button.trigger('click')
    expect(wrapper.emitted('toggleWatched')).toBeTruthy()
  })

  it('should have link to episode URL with security attributes', async () => {
    const episode = createMockEpisode({ url: 'https://example.com/episode/1' })
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com/episode/1')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
    expect(link.attributes('rel')).toContain('noreferrer')
  })

  it('should show filler and recap badges when applicable', async () => {
    const episode = createMockEpisode({ filler: true, recap: true })
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.html()).toContain('Filler')
    expect(wrapper.html()).toContain('Recap')
  })

  it('should not show badges when not filler or recap', async () => {
    const episode = createMockEpisode({ filler: false, recap: false })
    const wrapper = await mountSuspended(EpisodeGridItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.html()).not.toContain('Filler')
    expect(wrapper.html()).not.toContain('Recap')
  })
})
