import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TabsNavigation from '~/components/anime/detail/TabsNavigation.vue'
import type { Tab } from '~/components/anime/detail/TabsNavigation.vue'

const mockTabs: Tab[] = [
  { id: 'characters', label: 'Characters', icon: 'i-heroicons-users' },
  { id: 'reviews', label: 'Reviews', icon: 'i-heroicons-chat-bubble-left-right' },
  { id: 'news', label: 'News', icon: 'i-heroicons-newspaper' },
]

describe('TabsNavigation', () => {
  describe('rendering', () => {
    it('should render nav with tablist role', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('role')).toBe('tablist')
    })

    it('should render all tabs as buttons', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      expect(wrapper.findAll('button').length).toBe(3)
    })

    it('should render tab labels', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      expect(wrapper.text()).toContain('Characters')
      expect(wrapper.text()).toContain('Reviews')
      expect(wrapper.text()).toContain('News')
    })
  })

  describe('accessibility', () => {
    it('should have tab role on buttons', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      wrapper.findAll('button').forEach((button) => {
        expect(button.attributes('role')).toBe('tab')
      })
    })

    it('should have aria-selected true for active tab', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.at(0)!.attributes('aria-selected')).toBe('true')
      expect(buttons.at(1)!.attributes('aria-selected')).toBe('false')
    })

    it('should have aria-controls pointing to tabpanel', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.at(0)!.attributes('aria-controls')).toBe('tabpanel-characters')
      expect(buttons.at(1)!.attributes('aria-controls')).toBe('tabpanel-reviews')
    })

    it('should have aria-hidden on icons', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      expect(wrapper.html()).toContain('aria-hidden="true"')
    })
  })

  describe('events', () => {
    it('should emit update:modelValue when tab is clicked', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      await wrapper.findAll('button').at(1)!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['reviews'])
    })
  })

  describe('active state', () => {
    it('should show active indicator for selected tab', async () => {
      const wrapper = await mountSuspended(TabsNavigation, {
        props: { tabs: mockTabs, modelValue: 'characters' },
      })

      expect(wrapper.findAll('.bg-rp-iris').length).toBe(1)
    })
  })
})
