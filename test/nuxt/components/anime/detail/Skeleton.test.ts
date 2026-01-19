import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Skeleton from '~/components/anime/detail/Skeleton.vue'

describe('Skeleton', () => {
  describe('rendering', () => {
    it('should render section element', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '123' },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render pulse animations', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '123' },
      })

      expect(wrapper.findAll('.animate-pulse').length).toBeGreaterThan(0)
    })
  })

  describe('props', () => {
    it('should accept animeId prop', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '456' },
      })

      expect(wrapper.props('animeId')).toBe('456')
    })
  })

  describe('skeleton elements', () => {
    it('should render poster skeleton', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '123' },
      })

      expect(wrapper.find('.aspect-3\\/4').exists()).toBe(true)
    })

    it('should render favorite button skeleton', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '123' },
      })

      expect(wrapper.find('.size-12.animate-pulse.rounded-full').exists()).toBe(true)
    })

    it('should render title skeleton', async () => {
      const wrapper = await mountSuspended(Skeleton, {
        props: { animeId: '123' },
      })

      expect(wrapper.find('.h-12').exists()).toBe(true)
    })
  })
})
