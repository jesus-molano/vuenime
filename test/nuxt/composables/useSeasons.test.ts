import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useCurrentSeason, useUpcomingSeason } from '~/composables/useSeasons'

// Test component for current season
const CurrentSeasonComponent = defineComponent({
  setup() {
    const { animeList, isLoading, error, refresh, seasonName } = useCurrentSeason()
    return { animeList, isLoading, error, refresh, seasonName }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'anime-count' }, String(this.animeList.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'season' }, this.seasonName.season),
      h('span', { id: 'year' }, String(this.seasonName.year)),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
    ])
  },
})

// Test component for upcoming season
const UpcomingSeasonComponent = defineComponent({
  setup() {
    const { animeList, isLoading, error, refresh } = useUpcomingSeason()
    return { animeList, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'anime-count' }, String(this.animeList.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
    ])
  },
})

describe('useCurrentSeason (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('seasonName computed', () => {
    it('should return correct season based on month', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)
      const month = new Date().getMonth()

      let expectedSeason: string
      if (month >= 0 && month <= 2) expectedSeason = 'winter'
      else if (month >= 3 && month <= 5) expectedSeason = 'spring'
      else if (month >= 6 && month <= 8) expectedSeason = 'summer'
      else expectedSeason = 'fall'

      expect(wrapper.find('#season').text()).toBe(expectedSeason)
    })

    it('should return current year', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)
      const expectedYear = new Date().getFullYear()

      expect(wrapper.find('#year').text()).toBe(String(expectedYear))
    })
  })

  describe('composable structure', () => {
    it('should return animeList as array', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)
      await nextTick()

      expect(wrapper.vm.animeList).toBeDefined()
      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have seasonName object', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)

      expect(wrapper.vm.seasonName).toBeDefined()
      expect(wrapper.vm.seasonName.season).toBeDefined()
      expect(wrapper.vm.seasonName.year).toBeDefined()
    })
  })

  describe('loading state', () => {
    it('should have loading state computed', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)
      await nextTick()

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })
  })

  describe('empty state handling', () => {
    it('should handle empty anime list gracefully', async () => {
      const wrapper = await mountSuspended(CurrentSeasonComponent)
      await nextTick()

      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })
  })
})

describe('useUpcomingSeason (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return animeList as array', async () => {
      const wrapper = await mountSuspended(UpcomingSeasonComponent)
      await nextTick()

      expect(wrapper.vm.animeList).toBeDefined()
      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(UpcomingSeasonComponent)

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })
  })

  describe('loading state', () => {
    it('should have loading state computed', async () => {
      const wrapper = await mountSuspended(UpcomingSeasonComponent)
      await nextTick()

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })
  })

  describe('empty state handling', () => {
    it('should handle empty anime list gracefully', async () => {
      const wrapper = await mountSuspended(UpcomingSeasonComponent)
      await nextTick()

      expect(Array.isArray(wrapper.vm.animeList)).toBe(true)
    })
  })
})
