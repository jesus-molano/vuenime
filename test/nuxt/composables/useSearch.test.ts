import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useSearch } from '~/composables/useSearch'

const TestComponent = defineComponent({
  setup() {
    const { isSearchOpen, searchQuery, openSearch, closeSearch, toggleSearch, clearSearch } = useSearch()
    return { isSearchOpen, searchQuery, openSearch, closeSearch, toggleSearch, clearSearch }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'is-open' }, this.isSearchOpen ? 'true' : 'false'),
      h('span', { id: 'query' }, this.searchQuery),
      h('button', { id: 'open-btn', onClick: this.openSearch }, 'Open'),
      h('button', { id: 'close-btn', onClick: this.closeSearch }, 'Close'),
      h('button', { id: 'toggle-btn', onClick: this.toggleSearch }, 'Toggle'),
      h('button', { id: 'clear-btn', onClick: this.clearSearch }, 'Clear'),
    ])
  },
})

describe('useSearch (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global state before each test
    const { isSearchOpen, searchQuery } = useSearch()
    isSearchOpen.value = false
    searchQuery.value = ''
  })

  describe('initial state', () => {
    it('should have isSearchOpen as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isSearchOpen).toBe(false)
    })

    it('should have searchQuery as empty string initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.searchQuery).toBe('')
    })
  })

  describe('openSearch', () => {
    it('should set isSearchOpen to true', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.openSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(true)
    })
  })

  describe('closeSearch', () => {
    it('should set isSearchOpen to false', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.openSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(true)

      wrapper.vm.closeSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(false)
    })
  })

  describe('toggleSearch', () => {
    it('should toggle isSearchOpen from false to true', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isSearchOpen).toBe(false)

      wrapper.vm.toggleSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(true)
    })

    it('should toggle isSearchOpen from true to false', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.openSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(true)

      wrapper.vm.toggleSearch()
      await nextTick()
      expect(wrapper.vm.isSearchOpen).toBe(false)
    })
  })

  describe('clearSearch', () => {
    it('should clear searchQuery', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.searchQuery = 'test query'
      await nextTick()
      expect(wrapper.vm.searchQuery).toBe('test query')

      wrapper.vm.clearSearch()
      await nextTick()
      expect(wrapper.vm.searchQuery).toBe('')
    })
  })

  describe('global state', () => {
    it('should share state between instances', async () => {
      const wrapper1 = await mountSuspended(TestComponent)
      const wrapper2 = await mountSuspended(TestComponent)

      wrapper1.vm.openSearch()
      await nextTick()

      // Both should reflect the same state
      expect(wrapper1.vm.isSearchOpen).toBe(true)
      expect(wrapper2.vm.isSearchOpen).toBe(true)
    })
  })
})
