import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CarouselSkeleton from '~/components/home/CarouselSkeleton.vue'

describe('CarouselSkeleton', () => {
  describe('rendering', () => {
    it('should render a container div', async () => {
      const wrapper = await mountSuspended(CarouselSkeleton)

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render the skeleton placeholder', async () => {
      const wrapper = await mountSuspended(CarouselSkeleton)

      // Should have two nested divs: container and placeholder
      const divs = wrapper.findAll('div')
      expect(divs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('accessibility', () => {
    it('should have proper DOM structure', async () => {
      const wrapper = await mountSuspended(CarouselSkeleton)

      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('animation', () => {
    it('should have animate-pulse class for loading indication', async () => {
      const wrapper = await mountSuspended(CarouselSkeleton)

      expect(wrapper.html()).toContain('animate-pulse')
    })
  })
})
