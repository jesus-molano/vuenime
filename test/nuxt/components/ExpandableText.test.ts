import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import ExpandableText from '~/components/ui/ExpandableText.vue'

describe('ExpandableText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render text content', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: 'Short text content',
        },
      })

      expect(wrapper.text()).toContain('Short text content')
    })

    it('should render fallback text when text is null', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: null,
          fallbackText: 'No description available',
        },
      })

      expect(wrapper.text()).toContain('No description available')
    })

    it('should render fallback text when text is empty', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: '',
          fallbackText: 'No content',
        },
      })

      expect(wrapper.text()).toContain('No content')
    })
  })

  describe('expand/collapse functionality', () => {
    const longText = 'A'.repeat(600) // Text longer than default maxLength (500)

    it('should show expand button for long text', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: longText,
        },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should not show expand button for short text', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: 'Short text',
        },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(false)
    })

    it('should toggle expanded state on button click', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: longText,
        },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)

      // Initially collapsed - click to expand
      await button.trigger('click')
      await nextTick()

      // Click again to collapse
      await button.trigger('click')
      await nextTick()

      // Button should still exist
      expect(button.exists()).toBe(true)
    })
  })

  describe('maxLength prop', () => {
    it('should use custom maxLength', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: 'A'.repeat(200), // 200 chars
          maxLength: 100, // Custom threshold
        },
      })

      // Should show button because text > maxLength
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should not show button when text is within maxLength', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: 'A'.repeat(50), // 50 chars
          maxLength: 100, // 100 threshold
        },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should have button with type="button"', async () => {
      const longText = 'A'.repeat(600)
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: longText,
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })
  })

  describe('gradient overlay', () => {
    it('should show gradient when collapsed and text is long', async () => {
      const longText = 'A'.repeat(600)
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: longText,
        },
      })

      // Gradient div should be visible when collapsed
      const gradient = wrapper.find('.bg-linear-to-t')
      expect(gradient.exists()).toBe(true)
    })

    it('should not show gradient when text is short', async () => {
      const wrapper = await mountSuspended(ExpandableText, {
        props: {
          text: 'Short text',
        },
      })

      const gradient = wrapper.find('.bg-linear-to-t')
      expect(gradient.exists()).toBe(false)
    })
  })
})
