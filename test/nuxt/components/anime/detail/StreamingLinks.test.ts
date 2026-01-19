import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { computed } from 'vue'
import StreamingLinks from '~/components/anime/detail/StreamingLinks.vue'

import { useAnimeStreaming } from '~/composables/useAnimeStreaming'

vi.mock('~/composables/useAnimeStreaming', () => ({
  useAnimeStreaming: vi.fn(),
}))

vi.mock('~~/shared/constants/streaming', () => ({
  getStreamingPlatformConfig: vi.fn((name: string) => {
    const configs: Record<string, { icon: string; classes: string }> = {
      Crunchyroll: { icon: 'i-simple-icons-crunchyroll', classes: 'bg-orange-500 text-white' },
      Netflix: { icon: 'i-simple-icons-netflix', classes: 'bg-red-600 text-white' },
      default: { icon: 'i-heroicons-play', classes: 'bg-gray-500 text-white' },
    }
    return configs[name] || configs.default
  }),
}))

const mockStreamingLinks = [
  { name: 'Crunchyroll', url: 'https://crunchyroll.com/anime/123' },
  { name: 'Netflix', url: 'https://netflix.com/title/456' },
]

describe('StreamingLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useAnimeStreaming).mockReturnValue({
      streamingLinks: computed(() => []),
      isLoading: computed(() => false),
    } as unknown as ReturnType<typeof useAnimeStreaming>)
  })

  describe('conditional rendering', () => {
    it('should render nothing when no streaming links', async () => {
      const wrapper = await mountSuspended(StreamingLinks, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.flex.flex-wrap').exists()).toBe(false)
    })

    it('should render links when available', async () => {
      vi.mocked(useAnimeStreaming).mockReturnValue({
        streamingLinks: computed(() => mockStreamingLinks),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeStreaming>)

      const wrapper = await mountSuspended(StreamingLinks, {
        props: { animeId: 1 },
      })

      expect(wrapper.findAll('a').length).toBe(2)
    })
  })

  describe('link attributes', () => {
    it('should have correct href and security attributes', async () => {
      vi.mocked(useAnimeStreaming).mockReturnValue({
        streamingLinks: computed(() => mockStreamingLinks),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeStreaming>)

      const wrapper = await mountSuspended(StreamingLinks, {
        props: { animeId: 1 },
      })

      const links = wrapper.findAll('a')
      expect(links.at(0)!.attributes('href')).toBe('https://crunchyroll.com/anime/123')
      expect(links.at(0)!.attributes('target')).toBe('_blank')
      expect(links.at(0)!.attributes('rel')).toContain('noopener')
    })
  })

  describe('platform names', () => {
    it('should display platform names', async () => {
      vi.mocked(useAnimeStreaming).mockReturnValue({
        streamingLinks: computed(() => mockStreamingLinks),
        isLoading: computed(() => false),
      } as unknown as ReturnType<typeof useAnimeStreaming>)

      const wrapper = await mountSuspended(StreamingLinks, {
        props: { animeId: 1 },
      })

      expect(wrapper.text()).toContain('Crunchyroll')
      expect(wrapper.text()).toContain('Netflix')
    })
  })

  describe('props', () => {
    it('should accept animeId and call composable', async () => {
      await mountSuspended(StreamingLinks, {
        props: { animeId: 789 },
      })

      expect(useAnimeStreaming).toHaveBeenCalled()
    })
  })
})
