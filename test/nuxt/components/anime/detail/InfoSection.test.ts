import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InfoSection from '~/components/anime/detail/InfoSection.vue'
import { mockAnime, createMockAnime } from '../../../../fixtures/anime'

describe('InfoSection', () => {
  describe('rendering', () => {
    it('should render section element', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: mockAnime },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })
  })

  describe('info cards', () => {
    it('should render type when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ type: 'TV' }) },
      })

      expect(wrapper.text()).toContain('TV')
    })

    it('should render episodes when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ episodes: 24 }) },
      })

      expect(wrapper.text()).toContain('24')
    })

    it('should render status when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ status: 'Finished Airing' }) },
      })

      expect(wrapper.text()).toContain('Finished Airing')
    })

    it('should render season and year when both are available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ season: 'winter', year: 2024 }) },
      })

      expect(wrapper.text()).toContain('winter')
      expect(wrapper.text()).toContain('2024')
    })
  })

  describe('stat cards', () => {
    it('should render score when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ score: 8.75 }) },
      })

      expect(wrapper.text()).toContain('8.75')
    })

    it('should render rank with prefix when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ rank: 5 }) },
      })

      expect(wrapper.text()).toContain('#5')
    })

    it('should render popularity with prefix when available', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: { anime: createMockAnime({ popularity: 10 }) },
      })

      expect(wrapper.text()).toContain('#10')
    })
  })

  describe('conditional rendering', () => {
    it('should not render null values', async () => {
      const wrapper = await mountSuspended(InfoSection, {
        props: {
          anime: createMockAnime({
            score: null,
            rank: null,
            popularity: null,
          }),
        },
      })

      expect(wrapper.text()).not.toContain('#null')
    })
  })
})
