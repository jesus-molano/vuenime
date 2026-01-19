import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import EmptyState from '~/components/favorites/EmptyState.vue'

mockNuxtImport('useLocalePath', () => {
  return () => (path: string) => path
})

describe('EmptyState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountEmptyState = () =>
    mountSuspended(EmptyState, {
      global: {
        stubs: {
          NuxtLink: {
            name: 'NuxtLink',
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
    })

  describe('rendering', () => {
    it('should render the component', async () => {
      const wrapper = await mountEmptyState()

      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render the heart icon', async () => {
      const wrapper = await mountEmptyState()

      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('i-heroicons-heart')
    })

    it('should render title heading', async () => {
      const wrapper = await mountEmptyState()

      expect(wrapper.find('h2').exists()).toBe(true)
    })

    it('should render description paragraph', async () => {
      const wrapper = await mountEmptyState()

      expect(wrapper.find('p').exists()).toBe(true)
    })
  })

  describe('explore link', () => {
    it('should render explore link to home', async () => {
      const wrapper = await mountEmptyState()

      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('/')
    })

    it('should contain magnifying glass icon in link', async () => {
      const wrapper = await mountEmptyState()

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      const magnifyingGlass = icons.find((icon) => icon.props('name') === 'i-heroicons-magnifying-glass')
      expect(magnifyingGlass).toBeDefined()
    })
  })

  describe('accessibility', () => {
    it('should have aria-hidden on decorative icon', async () => {
      const wrapper = await mountEmptyState()

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      const heartIcon = icons.find((icon) => icon.props('name') === 'i-heroicons-heart')
      expect(heartIcon?.attributes('aria-hidden')).toBe('true')
    })
  })
})
