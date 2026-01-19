import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StatCard from '~/components/anime/detail/StatCard.vue'

describe('StatCard', () => {
  const defaultProps = {
    icon: 'i-heroicons-star-solid',
    label: 'Score',
    value: 8.5,
    color: 'gold' as const,
  }

  describe('rendering', () => {
    it('should render icon', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: defaultProps,
      })

      expect(wrapper.html()).toContain('star-solid')
    })

    it('should render label', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('Score')
    })

    it('should render value', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('8.5')
    })
  })

  describe('value formatting', () => {
    it('should render string value', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, value: '8.75' },
      })

      expect(wrapper.text()).toContain('8.75')
    })

    it('should render prefix before value when provided', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, value: 5, prefix: '#' },
      })

      expect(wrapper.text()).toContain('#5')
    })
  })

  describe('subtitle', () => {
    it('should render subtitle when provided', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, subtitle: '100,000 votes' },
      })

      expect(wrapper.text()).toContain('100,000 votes')
    })

    it('should not render subtitle when not provided', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: defaultProps,
      })

      expect(wrapper.findAll('.text-xs.text-rp-subtle').length).toBe(0)
    })
  })

  describe('colors', () => {
    it('should apply gold color classes', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, color: 'gold' },
      })

      expect(wrapper.html()).toContain('from-rp-gold')
    })

    it('should apply iris color classes', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, color: 'iris' },
      })

      expect(wrapper.html()).toContain('from-rp-iris')
    })

    it('should apply foam color classes', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, color: 'foam' },
      })

      expect(wrapper.html()).toContain('from-rp-foam')
    })

    it('should apply rose color classes', async () => {
      const wrapper = await mountSuspended(StatCard, {
        props: { ...defaultProps, color: 'rose' },
      })

      expect(wrapper.html()).toContain('from-rp-rose')
    })
  })
})
