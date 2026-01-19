import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ScoreBadge from '~/components/ui/ScoreBadge.vue'

describe('ScoreBadge', () => {
  describe('rendering', () => {
    it('should render the badge', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5 },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should display formatted score with one decimal', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.567 },
      })

      expect(wrapper.text()).toContain('8.6')
    })

    it('should display whole numbers with decimal', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 9 },
      })

      expect(wrapper.text()).toContain('9.0')
    })
  })

  describe('size prop', () => {
    it('should render with default size (sm)', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5 },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept xs size', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5, size: 'xs' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept md size', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5, size: 'md' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('position prop', () => {
    it('should render with default position (static)', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5 },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept top-right position', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5, position: 'top-right' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept top-left position', async () => {
      const wrapper = await mountSuspended(ScoreBadge, {
        props: { score: 8.5, position: 'top-left' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })
  })
})
