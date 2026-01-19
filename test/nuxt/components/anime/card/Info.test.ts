import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Info from '~/components/anime/card/Info.vue'

describe('AnimeCardInfo', () => {
  describe('rendering', () => {
    it('should render year when provided', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: 2024 },
      })

      expect(wrapper.text()).toContain('2024')
    })

    it('should render episodes when provided', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { episodes: 12 },
      })

      expect(wrapper.text()).toContain('12')
    })

    it('should render both year and episodes when both provided', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: 2024, episodes: 24 },
      })

      expect(wrapper.text()).toContain('2024')
      expect(wrapper.text()).toContain('24')
    })
  })

  describe('conditional rendering', () => {
    it('should not render year icon when year is null', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: null, episodes: 12 },
      })

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      expect(icons.length).toBe(1)
      expect(icons[0].props('name')).toBe('i-heroicons-play')
    })

    it('should not render episodes icon when episodes is null', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: 2024, episodes: null },
      })

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      expect(icons.length).toBe(1)
      expect(icons[0].props('name')).toBe('i-heroicons-calendar')
    })

    it('should render empty container when both are null', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: null, episodes: null },
      })

      expect(wrapper.findAllComponents({ name: 'UIcon' }).length).toBe(0)
      expect(wrapper.text().trim()).toBe('')
    })
  })

  describe('icons', () => {
    it('should render calendar icon for year and play icon for episodes', async () => {
      const wrapper = await mountSuspended(Info, {
        props: { year: 2024, episodes: 12 },
      })

      const icons = wrapper.findAllComponents({ name: 'UIcon' })
      expect(icons.length).toBe(2)
      expect(icons[0].props('name')).toBe('i-heroicons-calendar')
      expect(icons[1].props('name')).toBe('i-heroicons-play')
    })
  })
})
