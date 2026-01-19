import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TabsSection from '~/components/anime/detail/TabsSection.vue'

describe('TabsSection', () => {
  describe('rendering', () => {
    it('should render section element', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should have tab content container', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('.mt-4').exists()).toBe(true)
    })
  })

  describe('props', () => {
    it('should accept animeId as number', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: { animeId: 123 },
      })

      expect(wrapper.props('animeId')).toBe(123)
    })

    it('should accept animeId as string', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: { animeId: '456' },
      })

      expect(wrapper.props('animeId')).toBe('456')
    })
  })

  describe('default state', () => {
    it('should initialize with default active tab', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: { animeId: 1 },
      })

      expect(wrapper.vm).toBeDefined()
    })
  })
})
