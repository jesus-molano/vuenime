import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Genres from '~/components/anime/card/Genres.vue'
import { mockGenres } from '../../../../fixtures/anime'

describe('AnimeCardGenres', () => {
  describe('rendering', () => {
    it('should render genre pills', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres },
      })

      expect(wrapper.findAll('span').length).toBeGreaterThan(0)
    })

    it('should not render anything when genres is null', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: null },
      })

      expect(wrapper.findAll('span').length).toBe(0)
    })

    it('should not render anything when genres is empty array', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: [] },
      })

      expect(wrapper.findAll('span').length).toBe(0)
    })
  })

  describe('limit prop', () => {
    it('should limit displayed genres to 2 by default', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres },
      })

      expect(wrapper.findAll('span').length).toBe(2)
    })

    it('should respect custom limit prop', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres, limit: 3 },
      })

      expect(wrapper.findAll('span').length).toBe(3)
    })

    it('should handle limit greater than genres length', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres, limit: 10 },
      })

      expect(wrapper.findAll('span').length).toBe(mockGenres.length)
    })
  })

  describe('linkable prop', () => {
    it('should render spans when linkable is false (default)', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres },
      })

      expect(wrapper.findAll('span').length).toBe(2)
      expect(wrapper.findAllComponents({ name: 'NuxtLink' }).length).toBe(0)
    })

    it('should render NuxtLinks when linkable is true', async () => {
      const wrapper = await mountSuspended(Genres, {
        props: { genres: mockGenres, linkable: true },
      })

      expect(wrapper.findAllComponents({ name: 'NuxtLink' }).length).toBe(2)
    })
  })
})
