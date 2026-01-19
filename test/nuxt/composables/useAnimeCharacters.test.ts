import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useAnimeCharacters } from '~/composables/useAnimeCharacters'

// Test component that uses the composable
const TestComponent = defineComponent({
  props: {
    animeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const id = ref(props.animeId)
    const { characters, mainCharacters, supportingCharacters, isLoading, error, refresh } = useAnimeCharacters(id)
    return { characters, mainCharacters, supportingCharacters, isLoading, error, refresh }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'total-count' }, String(this.characters.length)),
      h('span', { id: 'main-count' }, String(this.mainCharacters.length)),
      h('span', { id: 'supporting-count' }, String(this.supportingCharacters.length)),
      h('span', { id: 'is-loading' }, this.isLoading ? 'true' : 'false'),
      h('span', { id: 'error' }, this.error ? 'error' : 'no-error'),
    ])
  },
})

describe('useAnimeCharacters (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return characters as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.characters).toBeDefined()
      expect(Array.isArray(wrapper.vm.characters)).toBe(true)
    })

    it('should return mainCharacters as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.mainCharacters).toBeDefined()
      expect(Array.isArray(wrapper.vm.mainCharacters)).toBe(true)
    })

    it('should return supportingCharacters as array', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.supportingCharacters).toBeDefined()
      expect(Array.isArray(wrapper.vm.supportingCharacters)).toBe(true)
    })

    it('should have isLoading as boolean', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      expect(typeof wrapper.vm.isLoading).toBe('boolean')
    })

    it('should have error ref', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })

      // Error can be null or an error object
      expect(wrapper.vm.error === null || wrapper.vm.error !== undefined).toBe(true)
    })
  })

  describe('computed arrays', () => {
    it('should have mainCharacters computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.mainCharacters).toBeDefined()
    })

    it('should have supportingCharacters computed', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(wrapper.vm.supportingCharacters).toBeDefined()
    })

    it('mainCharacters and supportingCharacters should be subsets of characters', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      const mainCount = wrapper.vm.mainCharacters.length
      const supportingCount = wrapper.vm.supportingCharacters.length
      const totalCount = wrapper.vm.characters.length

      // Combined count should not exceed total
      expect(mainCount + supportingCount).toBeLessThanOrEqual(totalCount)
    })
  })

  describe('empty state handling', () => {
    it('should handle empty characters gracefully', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '1' },
      })
      await nextTick()

      expect(Array.isArray(wrapper.vm.characters)).toBe(true)
      expect(Array.isArray(wrapper.vm.mainCharacters)).toBe(true)
      expect(Array.isArray(wrapper.vm.supportingCharacters)).toBe(true)
    })
  })

  describe('different anime IDs', () => {
    it('should accept different anime IDs', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: '12345' },
      })
      await nextTick()

      expect(wrapper.vm.characters).toBeDefined()
    })
  })
})
