import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CarouselCard from '~/components/anime/CarouselCard.vue'
import { mockAnime, mockAiringAnime, createMockAnime } from '../../../fixtures/anime'

describe('CarouselCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should render as a NuxtLink', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.find('a').exists()).toBe(true)
    })

    it('should render anime title', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.text()).toContain(mockAnime.title)
    })

    it('should render anime poster image', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
    })
  })

  describe('conditional rendering', () => {
    it('should render score badge when anime has score', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      // UiScoreBadge should be rendered
      const scoreBadge = wrapper.findComponent({ name: 'UiScoreBadge' })
      expect(scoreBadge.exists()).toBe(true)
    })

    it('should not render score badge when anime has no score', async () => {
      const animeNoScore = createMockAnime({ score: null })
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: animeNoScore },
      })

      const scoreBadge = wrapper.findComponent({ name: 'UiScoreBadge' })
      expect(scoreBadge.exists()).toBe(false)
    })

    it('should render airing badge when anime is airing', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAiringAnime },
      })

      const airingBadge = wrapper.findComponent({ name: 'UiAiringBadge' })
      expect(airingBadge.exists()).toBe(true)
    })

    it('should not render airing badge when anime is not airing', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      const airingBadge = wrapper.findComponent({ name: 'UiAiringBadge' })
      expect(airingBadge.exists()).toBe(false)
    })

    it('should render year when available', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.text()).toContain(String(mockAnime.year))
    })

    it('should render episodes when available', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.text()).toContain(String(mockAnime.episodes))
    })
  })

  describe('props', () => {
    it('should accept anime prop', async () => {
      const wrapper = await mountSuspended(CarouselCard, {
        props: { anime: mockAnime },
      })

      expect(wrapper.props('anime')).toEqual(mockAnime)
    })
  })
})
