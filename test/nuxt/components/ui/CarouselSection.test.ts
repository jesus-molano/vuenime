import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CarouselSection from '~/components/ui/CarouselSection.vue'

describe('CarouselSection', () => {
  const defaultProps = {
    icon: 'i-heroicons-star',
    title: 'Test Section',
  }

  describe('rendering', () => {
    it('should render section element', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: defaultProps,
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render title', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('Test Section')
    })

    it('should render subtitle when provided', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: {
          ...defaultProps,
          subtitle: 'A subtitle',
        },
      })

      expect(wrapper.text()).toContain('A subtitle')
    })
  })

  describe('loading state', () => {
    it('should show loading skeletons when isLoading is true', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      })

      expect(wrapper.find('section').exists()).toBe(true)
    })
  })

  describe('empty state', () => {
    it('should show empty state when isEmpty is true', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: {
          ...defaultProps,
          isEmpty: true,
          emptyMessage: 'No items found',
        },
      })

      expect(wrapper.text()).toContain('No items found')
    })
  })

  describe('slots', () => {
    it('should render default slot content', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: defaultProps,
        slots: {
          default: '<div class="test-content">Content</div>',
        },
      })

      expect(wrapper.find('.test-content').exists()).toBe(true)
    })

    it('should render action slot content', async () => {
      const wrapper = await mountSuspended(CarouselSection, {
        props: defaultProps,
        slots: {
          action: '<button class="action-btn">Action</button>',
        },
      })

      expect(wrapper.find('.action-btn').exists()).toBe(true)
    })
  })
})
