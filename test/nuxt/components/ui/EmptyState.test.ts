import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EmptyState from '~/components/ui/EmptyState.vue'

describe('EmptyState', () => {
  const defaultProps = {
    icon: 'i-heroicons-inbox',
    message: 'No items found',
  }

  describe('rendering', () => {
    it('should render the component', async () => {
      const wrapper = await mountSuspended(EmptyState, {
        props: defaultProps,
      })

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should display the message', async () => {
      const wrapper = await mountSuspended(EmptyState, {
        props: defaultProps,
      })

      expect(wrapper.text()).toContain('No items found')
    })

    it('should render with different message', async () => {
      const wrapper = await mountSuspended(EmptyState, {
        props: {
          icon: 'i-heroicons-heart',
          message: 'No favorites yet',
        },
      })

      expect(wrapper.text()).toContain('No favorites yet')
    })
  })

  describe('accessibility', () => {
    it('should have aria-hidden on icon', async () => {
      const wrapper = await mountSuspended(EmptyState, {
        props: defaultProps,
      })

      const icon = wrapper.find('[aria-hidden="true"]')
      expect(icon.exists()).toBe(true)
    })
  })
})
