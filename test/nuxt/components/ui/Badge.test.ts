import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Badge from '~/components/ui/Badge.vue'

describe('Badge', () => {
  describe('rendering', () => {
    it('should render slot content', async () => {
      const wrapper = await mountSuspended(Badge, {
        slots: { default: 'Test Badge' },
      })

      expect(wrapper.text()).toBe('Test Badge')
    })

    it('should render as span when no "to" prop', async () => {
      const wrapper = await mountSuspended(Badge, {
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render as NuxtLink when "to" prop is provided', async () => {
      const wrapper = await mountSuspended(Badge, {
        props: { to: '/test' },
        slots: { default: 'Link Badge' },
      })

      expect(wrapper.find('a').exists()).toBe(true)
    })
  })

  describe('variant prop', () => {
    it('should render with default variant (base)', async () => {
      const wrapper = await mountSuspended(Badge, {
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept iris variant', async () => {
      const wrapper = await mountSuspended(Badge, {
        props: { variant: 'iris' },
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept glass variant', async () => {
      const wrapper = await mountSuspended(Badge, {
        props: { variant: 'glass' },
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('size prop', () => {
    it('should render with default size (sm)', async () => {
      const wrapper = await mountSuspended(Badge, {
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept xs size', async () => {
      const wrapper = await mountSuspended(Badge, {
        props: { size: 'xs' },
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should accept md size', async () => {
      const wrapper = await mountSuspended(Badge, {
        props: { size: 'md' },
        slots: { default: 'Badge' },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })
})
