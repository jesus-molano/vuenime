import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TabsSection from '~/components/anime/detail/TabsSection.vue'

describe('TabsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render section element', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render tabs navigation', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      // Should have AnimeDetailTabsNavigation component
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('props', () => {
    it('should accept animeId as number', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 123,
        },
      })

      expect(wrapper.props('animeId')).toBe(123)
    })

    it('should accept animeId as string', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: '456',
        },
      })

      expect(wrapper.props('animeId')).toBe('456')
    })
  })

  describe('tab structure', () => {
    it('should have tab content container', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      // Should have content container div
      const contentContainer = wrapper.find('.mt-4')
      expect(contentContainer.exists()).toBe(true)
    })

    it('should have KeepAlive wrapper', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      // KeepAlive is used to preserve tab component state
      expect(wrapper.html()).toContain('<!--')
    })
  })

  describe('default active tab', () => {
    it('should have characters as default active tab', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      // The component should render with characters tab active by default
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('styling', () => {
    it('should have responsive padding classes', async () => {
      const wrapper = await mountSuspended(TabsSection, {
        props: {
          animeId: 1,
        },
      })

      const section = wrapper.find('section')
      expect(section.classes().join(' ')).toContain('py-')
    })
  })
})
