import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CharactersTab from '~/components/anime/detail/CharactersTab.vue'

const mockMainCharacter = {
  character: {
    mal_id: 1,
    name: 'Main Character',
    images: {
      jpg: { image_url: 'https://example.com/main.jpg' },
      webp: { image_url: 'https://example.com/main.webp' },
    },
  },
  role: 'Main' as const,
  voice_actors: [],
}

const mockSupportingCharacter = {
  character: {
    mal_id: 2,
    name: 'Supporting Character',
    images: {
      jpg: { image_url: 'https://example.com/support.jpg' },
      webp: { image_url: 'https://example.com/support.webp' },
    },
  },
  role: 'Supporting' as const,
  voice_actors: [],
}

vi.mock('~/composables/useAnimeCharacters', () => ({
  useAnimeCharacters: () => ({
    characters: ref([mockMainCharacter, mockSupportingCharacter]),
    mainCharacters: ref([mockMainCharacter]),
    supportingCharacters: ref([mockSupportingCharacter]),
    isLoading: ref(false),
  }),
}))

vi.mock('~/composables/useShowMore', () => ({
  useShowMore: () => ({
    displayedItems: ref([mockSupportingCharacter]),
    hasMore: ref(false),
    remainingCount: ref(0),
    loadMore: vi.fn(),
  }),
}))

describe('CharactersTab', () => {
  it('should render tabpanel with correct ARIA attributes', async () => {
    const wrapper = await mountSuspended(CharactersTab, {
      props: { animeId: 1 },
    })

    const tabpanel = wrapper.find('#tabpanel-characters')
    expect(tabpanel.exists()).toBe(true)
    expect(tabpanel.attributes('role')).toBe('tabpanel')
    expect(tabpanel.attributes('aria-labelledby')).toBe('tab-characters')
  })

  it('should accept animeId as number or string', async () => {
    const wrapperNum = await mountSuspended(CharactersTab, {
      props: { animeId: 123 },
    })
    expect(wrapperNum.props('animeId')).toBe(123)

    const wrapperStr = await mountSuspended(CharactersTab, {
      props: { animeId: '456' },
    })
    expect(wrapperStr.props('animeId')).toBe('456')
  })

  it('should render character grid and section headings', async () => {
    const wrapper = await mountSuspended(CharactersTab, {
      props: { animeId: 1 },
    })

    expect(wrapper.find('.grid').exists()).toBe(true)
    expect(wrapper.findAll('h3').length).toBeGreaterThan(0)
  })
})
