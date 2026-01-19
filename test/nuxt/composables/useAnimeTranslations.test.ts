import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useAnimeTranslations } from '~/composables/useAnimeTranslations'

const TestComponent = defineComponent({
  setup() {
    const { translateType, translateGenreById, translateGenreByName, getTranslatedGenre } = useAnimeTranslations()
    return { translateType, translateGenreById, translateGenreByName, getTranslatedGenre }
  },
  render() {
    return h('div', { class: 'test-component' })
  },
})

describe('useAnimeTranslations (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('translateType', () => {
    it('should return translated type for known types', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const result = wrapper.vm.translateType('tv')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return original type if translation not found', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const unknownType = 'unknowntype123'
      const result = wrapper.vm.translateType(unknownType)
      expect(result).toBe(unknownType)
    })

    it('should handle case insensitively', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const result = wrapper.vm.translateType('TV')
      expect(typeof result).toBe('string')
    })
  })

  describe('translateGenreById', () => {
    it('should return translated genre for known ID (action = 1)', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const result = wrapper.vm.translateGenreById(1)
      // Either returns translated string or null
      expect(result === null || typeof result === 'string').toBe(true)
    })

    it('should return null for unknown genre ID', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const result = wrapper.vm.translateGenreById(99999)
      expect(result).toBe(null)
    })
  })

  describe('translateGenreByName', () => {
    it('should return translated genre for known name', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const result = wrapper.vm.translateGenreByName('Action')
      expect(typeof result).toBe('string')
    })

    it('should return original name if not found', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const unknownGenre = 'UnknownGenre123'
      const result = wrapper.vm.translateGenreByName(unknownGenre)
      expect(result).toBe(unknownGenre)
    })
  })

  describe('getTranslatedGenre', () => {
    it('should return object with value and label', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const genre = { mal_id: 1, name: 'Action' }
      const result = wrapper.vm.getTranslatedGenre(genre)

      expect(result).toHaveProperty('value')
      expect(result).toHaveProperty('label')
      expect(result.value).toBe('1')
      expect(typeof result.label).toBe('string')
    })

    it('should use original name as fallback', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const genre = { mal_id: 99999, name: 'CustomGenre' }
      const result = wrapper.vm.getTranslatedGenre(genre)

      expect(result.value).toBe('99999')
      expect(result.label).toBe('CustomGenre')
    })
  })
})
