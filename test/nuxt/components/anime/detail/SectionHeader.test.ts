import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SectionHeader from '~/components/anime/detail/SectionHeader.vue'

describe('SectionHeader', () => {
  describe('rendering', () => {
    it('should render title as h2', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
        },
      })

      const title = wrapper.find('h2')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Test Section')
    })

    it('should render icon', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
        },
      })

      expect(wrapper.html()).toContain('heroicons')
    })
  })

  describe('subtitle', () => {
    it('should render subtitle when provided', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
          subtitle: 'This is a subtitle',
        },
      })

      const subtitle = wrapper.find('p')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('This is a subtitle')
    })

    it('should not render subtitle when not provided', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
        },
      })

      expect(wrapper.find('p').exists()).toBe(false)
    })
  })

  describe('color prop', () => {
    it('should apply iris color by default', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
        },
      })

      expect(wrapper.html()).toContain('bg-rp-iris/20')
    })

    it('should apply specified color', async () => {
      const wrapper = await mountSuspended(SectionHeader, {
        props: {
          icon: 'i-heroicons-star',
          title: 'Test Section',
          color: 'rose',
        },
      })

      expect(wrapper.html()).toContain('bg-rp-rose/20')
    })
  })
})
