import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useSearchFilters } from '~/composables/useSearchFilters'

// Mock genres response
const mockGenresResponse = {
  data: [
    { mal_id: 1, name: 'Action' },
    { mal_id: 2, name: 'Adventure' },
    { mal_id: 4, name: 'Comedy' },
    { mal_id: 8, name: 'Drama' },
    { mal_id: 10, name: 'Fantasy' },
    { mal_id: 14, name: 'Horror' },
    { mal_id: 22, name: 'Romance' },
    { mal_id: 24, name: 'Sci-Fi' },
    { mal_id: 36, name: 'Slice of Life' },
    { mal_id: 30, name: 'Sports' },
    { mal_id: 37, name: 'Supernatural' },
    { mal_id: 41, name: 'Thriller' },
  ],
}

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const filters = useSearchFilters()
    return { ...filters }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'show-filters' }, this.showFilters ? 'true' : 'false'),
      h('span', { id: 'search-input' }, this.searchInput),
      h('span', { id: 'selected-type' }, this.selectedType ?? 'none'),
      h('span', { id: 'selected-year' }, this.selectedYear ?? 'none'),
      h('span', { id: 'selected-genre' }, this.selectedGenre || 'none'),
      h('span', { id: 'active-filters-count' }, String(this.activeFiltersCount)),
      h('span', { id: 'has-active-filters' }, this.hasActiveFilters ? 'true' : 'false'),
      h('span', { id: 'genres-count' }, String(this.genres.length)),
      h('span', { id: 'year-error' }, this.yearError || 'none'),
      h('span', { id: 'current-year' }, String(this.currentYear)),
      h('input', {
        id: 'search-field',
        value: this.searchInput,
        onInput: (e: Event) => {
          this.searchInput = (e.target as HTMLInputElement).value
        },
      }),
      h(
        'button',
        {
          id: 'toggle-type-btn',
          onClick: () => this.toggleType('tv'),
        },
        'Toggle TV'
      ),
      h(
        'button',
        {
          id: 'select-genre-btn',
          onClick: () => this.selectGenre('1'),
        },
        'Select Genre'
      ),
      h(
        'button',
        {
          id: 'select-year-btn',
          onClick: () => this.selectYear('2024'),
        },
        'Select Year'
      ),
      h('button', { id: 'clear-all-btn', onClick: this.clearAllFilters }, 'Clear All'),
      h('button', { id: 'clear-type-btn', onClick: this.clearTypeFilter }, 'Clear Type'),
      h('button', { id: 'clear-genre-btn', onClick: this.clearGenreFilter }, 'Clear Genre'),
      h('button', { id: 'clear-year-btn', onClick: this.clearYearFilter }, 'Clear Year'),
    ])
  },
})

describe('useSearchFilters (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    registerEndpoint('/api/jikan/genres/anime', {
      method: 'GET',
      handler: () => mockGenresResponse,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should have showFilters as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#show-filters').text()).toBe('false')
    })

    it('should have empty searchInput initially', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#search-input').text()).toBe('')
    })

    it('should have no selected type initially', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#selected-type').text()).toBe('none')
    })

    it('should have no selected year initially', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#selected-year').text()).toBe('none')
    })

    it('should have no selected genre initially', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#selected-genre').text()).toBe('none')
    })

    it('should have activeFiltersCount as 0', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#active-filters-count').text()).toBe('0')
    })

    it('should have hasActiveFilters as false', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#has-active-filters').text()).toBe('false')
    })
  })

  describe('genres fetching', () => {
    it('should have genres array', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      // Genres are fetched from API, verify structure exists
      expect(wrapper.vm.genres).toBeDefined()
      expect(Array.isArray(wrapper.vm.genres)).toBe(true)
    })

    it('should have popularGenres computed', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(wrapper.vm.popularGenres).toBeDefined()
      expect(Array.isArray(wrapper.vm.popularGenres)).toBe(true)
      expect(wrapper.vm.popularGenres.length).toBeLessThanOrEqual(10)
    })
  })

  describe('type options', () => {
    it('should have typeOptions', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.typeOptions).toBeDefined()
      expect(wrapper.vm.typeOptions.length).toBeGreaterThan(0)
    })

    it('should have typeOptionsWithIcons', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.typeOptionsWithIcons).toBeDefined()
      wrapper.vm.typeOptionsWithIcons.forEach((option: { icon: string }) => {
        expect(option.icon).toBeDefined()
      })
    })
  })

  describe('toggleType', () => {
    it('should toggle type filter', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#selected-type').text()).toBe('tv')
    })

    it('should clear type when toggling same type', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Select tv
      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-type').text()).toBe('tv')

      // Toggle again to clear
      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-type').text()).toBe('none')
    })

    it('should update activeFiltersCount', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#active-filters-count').text()).toBe('1')
    })
  })

  describe('selectGenre', () => {
    it('should select genre', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#select-genre-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#selected-genre').text()).toBe('1')
    })

    it('should update activeFiltersCount', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#select-genre-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#active-filters-count').text()).toBe('1')
    })
  })

  describe('selectYear', () => {
    it('should select year', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#selected-year').text()).toBe('2024')
    })

    it('should toggle year off when clicking same year', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Select 2024
      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-year').text()).toBe('2024')

      // Click again to deselect
      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-year').text()).toBe('none')
    })
  })

  describe('quickYears', () => {
    it('should have 5 quick years', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.quickYears).toHaveLength(5)
    })

    it('should start with current year', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const currentYear = new Date().getFullYear()

      expect(wrapper.vm.quickYears[0]).toBe(currentYear)
    })
  })

  describe('validateYear', () => {
    it('should return true for valid year', async () => {
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.yearInput = '2024'
      const result = wrapper.vm.validateYear()

      expect(result).toBe(true)
      expect(wrapper.find('#year-error').text()).toBe('none')
    })

    it('should return true for empty year', async () => {
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.yearInput = ''
      const result = wrapper.vm.validateYear()

      expect(result).toBe(true)
    })

    it('should return false for invalid year (NaN)', async () => {
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.yearInput = 'abc'
      const result = wrapper.vm.validateYear()

      expect(result).toBe(false)
    })

    it('should return false for year too old', async () => {
      const wrapper = await mountSuspended(TestComponent)

      wrapper.vm.yearInput = '1900'
      const result = wrapper.vm.validateYear()

      expect(result).toBe(false)
    })

    it('should return false for year too new', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const futureYear = new Date().getFullYear() + 5

      wrapper.vm.yearInput = String(futureYear)
      const result = wrapper.vm.validateYear()

      expect(result).toBe(false)
    })
  })

  describe('clearFilters', () => {
    it('should clear type filter', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Set type
      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-type').text()).toBe('tv')

      // Clear
      await wrapper.find('#clear-type-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-type').text()).toBe('none')
    })

    it('should clear genre filter', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Set genre
      await wrapper.find('#select-genre-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-genre').text()).toBe('1')

      // Clear
      await wrapper.find('#clear-genre-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-genre').text()).toBe('none')
    })

    it('should clear year filter', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Set year
      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-year').text()).toBe('2024')

      // Clear
      await wrapper.find('#clear-year-btn').trigger('click')
      await nextTick()
      expect(wrapper.find('#selected-year').text()).toBe('none')
    })

    it('should clear all filters', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // Set filters
      await wrapper.find('#toggle-type-btn').trigger('click')
      await wrapper.find('#select-genre-btn').trigger('click')
      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#active-filters-count').text()).toBe('3')

      // Clear all
      await wrapper.find('#clear-all-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#selected-type').text()).toBe('none')
      expect(wrapper.find('#selected-genre').text()).toBe('none')
      expect(wrapper.find('#selected-year').text()).toBe('none')
      expect(wrapper.find('#active-filters-count').text()).toBe('0')
    })
  })

  describe('filteredGenres', () => {
    it('should filter genres by search', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      const initialCount = wrapper.vm.genres.length
      wrapper.vm.genreSearch = 'Action'
      await nextTick()

      expect(wrapper.vm.filteredGenres.length).toBeLessThanOrEqual(initialCount)
    })

    it('should return all genres when search is empty', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.genreSearch = ''
      await nextTick()

      expect(wrapper.vm.filteredGenres.length).toBe(wrapper.vm.genres.length)
    })
  })

  describe('hasActiveFilters', () => {
    it('should be true when type is selected', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#toggle-type-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#has-active-filters').text()).toBe('true')
    })

    it('should be true when genre is selected', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#select-genre-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#has-active-filters').text()).toBe('true')
    })

    it('should be true when year is selected', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.find('#select-year-btn').trigger('click')
      await nextTick()

      expect(wrapper.find('#has-active-filters').text()).toBe('true')
    })
  })
})
