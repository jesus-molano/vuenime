import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EpisodeListItem from '~/components/anime/detail/EpisodeListItem.vue'
import type { Episode } from '~~/shared/types/anime'

const createMockEpisode = (overrides: Partial<Episode> = {}): Episode => ({
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1/episode/1',
  title: 'Episode Title',
  title_japanese: null,
  title_romanji: null,
  aired: '2024-01-15',
  score: 8.5,
  filler: false,
  recap: false,
  ...overrides,
})

describe('EpisodeListItem', () => {
  it('should render episode number and title', async () => {
    const episode = createMockEpisode({ mal_id: 10, title: 'A New Adventure' })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('10')
    const title = wrapper.find('h4')
    expect(title.exists()).toBe(true)
    expect(title.text()).toContain('A New Adventure')
  })

  it('should show fallback when title is empty', async () => {
    const episode = createMockEpisode({ mal_id: 7, title: '' })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('7')
  })

  it('should show score when available', async () => {
    const episode = createMockEpisode({ score: 9.2 })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('9.2')
  })

  it('should emit toggleWatched when button is clicked', async () => {
    const episode = createMockEpisode()
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')

    await button.trigger('click')
    expect(wrapper.emitted('toggleWatched')).toBeTruthy()
  })

  it('should have link with security attributes', async () => {
    const episode = createMockEpisode({ url: 'https://example.com/ep/5' })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    const link = wrapper.find('a[target="_blank"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('rel')).toContain('noopener')
    expect(link.attributes('rel')).toContain('noreferrer')
  })

  it('should show filler and recap badges when applicable', async () => {
    const episode = createMockEpisode({ filler: true, recap: true })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).toContain('Filler')
    expect(wrapper.text()).toContain('Recap')
  })

  it('should not show badges when not filler or recap', async () => {
    const episode = createMockEpisode({ filler: false, recap: false })
    const wrapper = await mountSuspended(EpisodeListItem, {
      props: { episode, isWatched: false },
    })

    expect(wrapper.text()).not.toContain('Filler')
    expect(wrapper.text()).not.toContain('Recap')
  })
})
