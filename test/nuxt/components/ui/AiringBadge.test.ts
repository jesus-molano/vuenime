import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AiringBadge from '~/components/ui/AiringBadge.vue'

describe('AiringBadge', () => {
  describe('rendering', () => {
    it('should render the badge with translated text', async () => {
      const wrapper = await mountSuspended(AiringBadge)

      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.text()).toBeTruthy()
    })
  })

  describe('size prop', () => {
    it('should render with default size (sm)', async () => {
      const wrapper = await mountSuspended(AiringBadge)

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept xs size', async () => {
      const wrapper = await mountSuspended(AiringBadge, {
        props: { size: 'xs' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept md size', async () => {
      const wrapper = await mountSuspended(AiringBadge, {
        props: { size: 'md' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('position prop', () => {
    it('should render with default position (static)', async () => {
      const wrapper = await mountSuspended(AiringBadge)

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept top-left position', async () => {
      const wrapper = await mountSuspended(AiringBadge, {
        props: { position: 'top-left' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should accept top-right position', async () => {
      const wrapper = await mountSuspended(AiringBadge, {
        props: { position: 'top-right' },
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })
  })
})
