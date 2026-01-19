import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FilterTag from '~/components/ui/FilterTag.vue'

describe('FilterTag', () => {
  describe('rendering', () => {
    it('should render slot content', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        slots: { default: 'Action' },
      })

      expect(wrapper.text()).toContain('Action')
    })

    it('should render remove button', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('variant prop', () => {
    it('should render with default variant (iris)', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept foam variant', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        props: { variant: 'foam' },
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept gold variant', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        props: { variant: 'gold' },
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept love variant', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        props: { variant: 'love' },
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('events', () => {
    it('should emit remove event when button is clicked', async () => {
      const wrapper = await mountSuspended(FilterTag, {
        slots: { default: 'Tag' },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')).toHaveLength(1)
    })
  })
})
