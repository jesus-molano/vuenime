import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnimeCardSkeleton from '~/components/anime/AnimeCardSkeleton.vue'

describe('AnimeCardSkeleton', () => {
  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render the root container', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      expect(wrapper.element.tagName).toBe('DIV')
    })
  })

  describe('mobile layout', () => {
    it('should render mobile layout container', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      // Mobile layout is flex on mobile, hidden on sm+
      const mobileLayout = wrapper.find('.flex.sm\\:hidden')
      expect(mobileLayout.exists()).toBe(true)
    })

    it('should render image placeholder in mobile layout', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      const mobileLayout = wrapper.find('.flex.sm\\:hidden')
      const imagePlaceholder = mobileLayout.find('.shrink-0')
      expect(imagePlaceholder.exists()).toBe(true)
    })

    it('should render content placeholders in mobile layout', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      const mobileLayout = wrapper.find('.flex.sm\\:hidden')
      const contentArea = mobileLayout.find('.flex-1')
      expect(contentArea.exists()).toBe(true)
    })
  })

  describe('desktop layout', () => {
    it('should render desktop layout container', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      // Desktop layout is hidden on mobile, block on sm+
      const desktopLayout = wrapper.find('.hidden.sm\\:block')
      expect(desktopLayout.exists()).toBe(true)
    })

    it('should render image placeholder in desktop layout', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      const desktopLayout = wrapper.find('.hidden.sm\\:block')
      const imagePlaceholder = desktopLayout.find('.size-full')
      expect(imagePlaceholder.exists()).toBe(true)
    })

    it('should render score badge placeholder', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      const desktopLayout = wrapper.find('.hidden.sm\\:block')
      const scoreBadge = desktopLayout.find('.absolute.right-2.top-2')
      expect(scoreBadge.exists()).toBe(true)
    })
  })

  describe('animation', () => {
    it('should have pulse animation class on root element', async () => {
      const wrapper = await mountSuspended(AnimeCardSkeleton)

      // The root div has animate-pulse class
      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })
  })
})
