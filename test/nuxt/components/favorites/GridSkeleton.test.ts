import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GridSkeleton from '~/components/favorites/GridSkeleton.vue'

describe('GridSkeleton', () => {
  const mountSkeleton = () => mountSuspended(GridSkeleton)

  describe('rendering', () => {
    it('should render the component', async () => {
      const wrapper = await mountSkeleton()

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render controls skeleton section', async () => {
      const wrapper = await mountSkeleton()

      // Controls skeleton has flex-wrap class
      const controlsSkeleton = wrapper.find('.flex.flex-wrap')
      expect(controlsSkeleton.exists()).toBe(true)
    })

    it('should render grid skeleton section', async () => {
      const wrapper = await mountSkeleton()

      const grid = wrapper.find('.grid')
      expect(grid.exists()).toBe(true)
    })

    it('should render 10 skeleton items in grid', async () => {
      const wrapper = await mountSkeleton()

      const grid = wrapper.find('.grid')
      const skeletonItems = grid.findAll('div')
      expect(skeletonItems).toHaveLength(10)
    })
  })

  describe('structure', () => {
    it('should have controls skeleton with multiple placeholder elements', async () => {
      const wrapper = await mountSkeleton()

      const controlsSection = wrapper.find('.flex.flex-wrap')
      const placeholders = controlsSection.findAll('.animate-pulse')
      expect(placeholders.length).toBeGreaterThan(0)
    })

    it('should have grid items with animate-pulse', async () => {
      const wrapper = await mountSkeleton()

      const grid = wrapper.find('.grid')
      const animatedItems = grid.findAll('.animate-pulse')
      expect(animatedItems).toHaveLength(10)
    })
  })
})
