import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ContentGrid from '~/components/anime/detail/ContentGrid.vue'

const mockEpisode = {
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1/episode/1',
  title: 'Episode 1',
  title_japanese: null,
  title_romanji: null,
  aired: '2024-01-01',
  score: 8.5,
  filler: false,
  recap: false,
}

vi.mock('~/composables/useAnimeEpisodes', () => ({
  useAnimeEpisodes: () => ({
    episodes: ref([mockEpisode]),
    isLoading: ref(false),
    isLoadingMore: ref(false),
    hasEpisodes: ref(true),
    hasNextPage: ref(false),
    loadMore: vi.fn(),
  }),
}))

vi.mock('~/composables/useWatchedToggle', () => ({
  useWatchedToggle: () => ({
    isEpisodeWatched: () => false,
    watchedCount: ref(0),
  }),
}))

vi.mock('~/composables/useNotifications', () => ({
  useNotifications: () => ({
    episodeMarkedWatched: vi.fn(),
    episodeMarkedUnwatched: vi.fn(),
  }),
}))

describe('ContentGrid', () => {
  const defaultProps = {
    synopsis: 'Test synopsis',
    animeId: '1',
    totalEpisodes: 12,
  }

  it('should render section with synopsis heading', async () => {
    const wrapper = await mountSuspended(ContentGrid, { props: defaultProps })

    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('h2').exists()).toBe(true)
  })

  it('should accept synopsis as string or null', async () => {
    const wrapper = await mountSuspended(ContentGrid, {
      props: { ...defaultProps, synopsis: 'This is a test synopsis' },
    })
    expect(wrapper.props('synopsis')).toBe('This is a test synopsis')

    const wrapperNull = await mountSuspended(ContentGrid, {
      props: { ...defaultProps, synopsis: null },
    })
    expect(wrapperNull.props('synopsis')).toBeNull()
  })

  it('should accept animeId and totalEpisodes props', async () => {
    const wrapper = await mountSuspended(ContentGrid, {
      props: { synopsis: 'Test', animeId: '123', totalEpisodes: 24 },
    })

    expect(wrapper.props('animeId')).toBe('123')
    expect(wrapper.props('totalEpisodes')).toBe(24)
  })

  it('should accept totalEpisodes as null', async () => {
    const wrapper = await mountSuspended(ContentGrid, {
      props: { ...defaultProps, totalEpisodes: null },
    })
    expect(wrapper.props('totalEpisodes')).toBeNull()
  })

  it('should accept optional animeTitle prop', async () => {
    const wrapper = await mountSuspended(ContentGrid, {
      props: { ...defaultProps, animeTitle: 'My Anime' },
    })
    expect(wrapper.props('animeTitle')).toBe('My Anime')
  })
})
