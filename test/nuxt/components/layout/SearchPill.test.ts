import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SearchPill from '~/components/layout/SearchPill.vue'

describe('SearchPill', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(SearchPill)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render button element', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should render keyboard shortcut', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const kbd = wrapper.find('kbd')
      expect(kbd.exists()).toBe(true)
    })

    it('should display keyboard shortcut text', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const kbd = wrapper.find('kbd')
      expect(kbd.text()).toContain('K')
    })

    it('should render search icon', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on button', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })

    it('should have type button', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })

    it('should have aria-hidden on icon', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.attributes('aria-hidden')).toBe('true')
    })

    it('should have aria-hidden on kbd', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const kbd = wrapper.find('kbd')
      expect(kbd.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('events', () => {
    it('should emit click event on button click', async () => {
      const wrapper = await mountSuspended(SearchPill)

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })
})
