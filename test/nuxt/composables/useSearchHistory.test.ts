import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useSearchHistory } from '~/composables/useSearchHistory'

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()
    return { history, addToHistory, removeFromHistory, clearHistory }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'history-count' }, String(this.history.length)),
      h('span', { id: 'history-items' }, JSON.stringify(this.history)),
      h('button', { id: 'add-btn', onClick: () => this.addToHistory('test') }, 'Add'),
      h('button', { id: 'remove-btn', onClick: () => this.removeFromHistory('test') }, 'Remove'),
      h('button', { id: 'clear-btn', onClick: this.clearHistory }, 'Clear'),
    ])
  },
})

describe('useSearchHistory (Nuxt)', () => {
  let mockStorage: Record<string, string>

  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage = {}

    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        mockStorage[key] = undefined as unknown as string
      }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initial state', () => {
    it('should start with empty history when localStorage is empty', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('0')
    })

    it('should load history from localStorage on mount', async () => {
      mockStorage.vuenime_search_history = JSON.stringify(['naruto', 'one piece'])

      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('2')
    })
  })

  describe('addToHistory', () => {
    it('should add a search term to history', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      // Clear any initial state
      wrapper.vm.clearHistory()
      await nextTick()

      wrapper.vm.addToHistory('naruto')
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('1')
    })

    it('should add to front of history', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('first')
      wrapper.vm.addToHistory('second')
      await nextTick()

      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history[0]).toBe('second')
      expect(history[1]).toBe('first')
    })

    it('should not add empty strings', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('')
      wrapper.vm.addToHistory('   ')
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('0')
    })

    it('should trim whitespace from search terms', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('  naruto  ')
      await nextTick()

      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history[0]).toBe('naruto')
    })

    it('should move existing term to front', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('first')
      wrapper.vm.addToHistory('second')
      wrapper.vm.addToHistory('first') // Add again
      await nextTick()

      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history[0]).toBe('first')
      expect(history.length).toBe(2)
    })

    it('should be case-insensitive when checking duplicates', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('Naruto')
      wrapper.vm.addToHistory('naruto')
      await nextTick()

      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history.length).toBe(1)
      expect(history[0]).toBe('naruto') // Latest version
    })

    it('should limit history to 5 items', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      for (let i = 1; i <= 7; i++) {
        wrapper.vm.addToHistory(`item${i}`)
      }
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('5')
      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history[0]).toBe('item7')
      expect(history[4]).toBe('item3')
    })
  })

  describe('removeFromHistory', () => {
    it('should remove a search term from history', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('naruto')
      wrapper.vm.addToHistory('one piece')
      await nextTick()
      expect(wrapper.find('#history-count').text()).toBe('2')

      wrapper.vm.removeFromHistory('naruto')
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('1')
      const history = JSON.parse(wrapper.find('#history-items').text())
      expect(history[0]).toBe('one piece')
    })

    it('should be case-insensitive when removing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('Naruto')
      await nextTick()

      wrapper.vm.removeFromHistory('naruto')
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('0')
    })

    it('should do nothing if term not in history', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('naruto')
      await nextTick()

      wrapper.vm.removeFromHistory('one piece')
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('1')
    })
  })

  describe('clearHistory', () => {
    it('should clear all history', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.addToHistory('naruto')
      wrapper.vm.addToHistory('one piece')
      await nextTick()

      wrapper.vm.clearHistory()
      await nextTick()

      expect(wrapper.find('#history-count').text()).toBe('0')
    })
  })

  describe('localStorage persistence', () => {
    it('should save history to localStorage on add', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.addToHistory('naruto')
      await nextTick()

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'vuenime_search_history',
        expect.stringContaining('naruto')
      )
    })

    it('should save history to localStorage on remove', async () => {
      const wrapper = await mountSuspended(TestComponent)
      await nextTick()

      wrapper.vm.clearHistory()
      wrapper.vm.addToHistory('naruto')
      wrapper.vm.removeFromHistory('naruto')
      await nextTick()

      expect(localStorage.setItem).toHaveBeenLastCalledWith('vuenime_search_history', '[]')
    })
  })
})
