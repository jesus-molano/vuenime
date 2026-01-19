import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Controls from '~/components/favorites/Controls.vue'

// Stub UTooltip to avoid TooltipProvider requirement
const UTooltipStub = {
  name: 'UTooltip',
  props: ['text', 'delayDuration'],
  setup(_: unknown, { slots }: { slots: { default?: () => unknown } }) {
    return () => slots.default?.()
  },
}

describe('Controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountControls = () =>
    mountSuspended(Controls, {
      global: {
        stubs: {
          UTooltip: UTooltipStub,
        },
      },
    })

  describe('rendering', () => {
    it('should render controls container', async () => {
      const wrapper = await mountControls()

      expect(wrapper.find('.flex.flex-wrap').exists()).toBe(true)
    })

    it('should render clear all button', async () => {
      const wrapper = await mountControls()

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons.at(0)!.attributes('type')).toBe('button')
    })

    it('should have sort container', async () => {
      const wrapper = await mountControls()

      const sortContainer = wrapper.find('[role="group"]')
      expect(sortContainer.exists()).toBe(true)
    })
  })

  describe('clear button', () => {
    it('should emit clear event on click', async () => {
      const wrapper = await mountControls()

      const clearButton = wrapper.findAll('button').at(0)!
      await clearButton.trigger('click')

      expect(wrapper.emitted('clear')).toBeTruthy()
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('should have love background styling', async () => {
      const wrapper = await mountControls()

      const clearButton = wrapper.findAll('button').at(0)!
      expect(clearButton.classes().join(' ')).toContain('bg-rp-love')
    })
  })

  describe('sort buttons', () => {
    it('should render sort buttons', async () => {
      const wrapper = await mountControls()

      const sortButtons = wrapper.findAll('[data-sort]')
      expect(sortButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('should have aria-pressed attribute on sort buttons', async () => {
      const wrapper = await mountControls()

      const sortButtons = wrapper.findAll('[data-sort]')
      sortButtons.forEach((button) => {
        expect(button.attributes('aria-pressed')).toBeDefined()
      })
    })

    it('should have aria-label on sort buttons', async () => {
      const wrapper = await mountControls()

      const sortButtons = wrapper.findAll('[data-sort]')
      sortButtons.forEach((button) => {
        expect(button.attributes('aria-label')).toBeDefined()
      })
    })
  })

  describe('sort indicator', () => {
    it('should have animated indicator element', async () => {
      const wrapper = await mountControls()

      const indicator = wrapper.find('.sort-indicator')
      expect(indicator.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on sort group', async () => {
      const wrapper = await mountControls()

      const sortGroup = wrapper.find('[role="group"]')
      expect(sortGroup.attributes('aria-label')).toBeDefined()
    })

    it('should have type="button" on all buttons', async () => {
      const wrapper = await mountControls()

      const buttons = wrapper.findAll('button')
      buttons.forEach((button) => {
        expect(button.attributes('type')).toBe('button')
      })
    })
  })
})
