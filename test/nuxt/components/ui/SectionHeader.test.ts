import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SectionHeader from '~/components/ui/SectionHeader.vue'

describe('SectionHeader', () => {
  const defaultProps = {
    icon: 'i-heroicons-star',
    title: 'Test Title',
  }

  describe('rendering', () => {
    it('should render the component', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: defaultProps,
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should display the title', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: defaultProps,
      })

      expect(wrapper.find('h2').text()).toBe('Test Title')
    })

    it('should render subtitle when provided', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          ...defaultProps,
          subtitle: 'A subtitle',
        },
      })

      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.text()).toContain('A subtitle')
    })

    it('should not render subtitle when not provided', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: defaultProps,
      })

      expect(wrapper.find('p').exists()).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should have aria-hidden on icon', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: defaultProps,
      })

      const icon = wrapper.find('[aria-hidden="true"]')
      expect(icon.exists()).toBe(true)
    })
  })

  describe('slots', () => {
    it('should render action slot content', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: defaultProps,
        slots: {
          action: '<button class="action-btn">View All</button>',
        },
      })

      expect(wrapper.find('.action-btn').exists()).toBe(true)
      expect(wrapper.text()).toContain('View All')
    })
  })
})
