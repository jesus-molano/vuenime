import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useSchedule } from '~/composables/useSchedule'

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const { today, animeList, isLoading, error, refresh } = useSchedule()
    return { today, animeList, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'today' }, this.today),
      h('span', { id: 'anime-count' }, String(this.animeList.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
      h('button', { id: 'refresh-btn', onClick: () => this.refresh() }, 'Refresh'),
    ])
  },
})

describe('useSchedule (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('today computed', () => {
    it('should return current day of the week', async () => {
      const wrapper = await mountSuspended(TestComponent)

      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const expectedDay = days[new Date().getDay()]

      expect(wrapper.find('#today').text()).toBe(expectedDay)
    })

    it('should return a valid day string', async () => {
      const wrapper = await mountSuspended(TestComponent)

      const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      expect(validDays).toContain(wrapper.vm.today)
    })
  })

  describe('composable structure', () => {
    it('should return animeList as array', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(wrapper.vm.animeList).toBeDefined()
      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have error ref', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Error can be null or an error object
      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })

    it('should have today as string', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.today).toBe('string')
    })
  })

  describe('loading state', () => {
    it('should have loading state computed', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })
  })

  describe('refresh functionality', () => {
    it('should have refresh function', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.refresh).toBe('function')
    })

    it('should be callable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(() => wrapper.vm.refresh()).not.toThrow()
    })
  })

  describe('empty state handling', () => {
    it('should handle empty anime list gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })
  })
})
