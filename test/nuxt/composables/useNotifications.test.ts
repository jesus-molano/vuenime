import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const notifications = useNotifications()
    return { notifications }
  },
  render() {
    return h('div', { class: 'test-component' }, 'Notifications Test')
  },
})

describe('useNotifications (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('composable structure', () => {
    it('should return all notification functions', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      // Generic
      expect(typeof notifications.success).toBe('function')
      expect(typeof notifications.error).toBe('function')
      expect(typeof notifications.info).toBe('function')
      expect(typeof notifications.loading).toBe('function')

      // Favorites
      expect(typeof notifications.favoriteAdded).toBe('function')
      expect(typeof notifications.favoriteRemoved).toBe('function')
      expect(typeof notifications.favoriteError).toBe('function')
      expect(typeof notifications.clearFavoritesSuccess).toBe('function')

      // Watched
      expect(typeof notifications.episodeMarkedWatched).toBe('function')
      expect(typeof notifications.episodeMarkedUnwatched).toBe('function')
      expect(typeof notifications.allEpisodesMarkedWatched).toBe('function')
      expect(typeof notifications.watchedCleared).toBe('function')
      expect(typeof notifications.watchedError).toBe('function')

      // Loading
      expect(typeof notifications.loadingAnime).toBe('function')

      // API Errors
      expect(typeof notifications.rateLimited).toBe('function')
      expect(typeof notifications.serviceUnavailable).toBe('function')
      expect(typeof notifications.animeNotFound).toBe('function')
    })
  })

  describe('generic notifications', () => {
    it('should call success without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.success('Test Title', 'Test Description')).not.toThrow()
    })

    it('should call error without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.error('Error Title', 'Error Description')).not.toThrow()
    })

    it('should call info without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.info('Info Title', 'Info Description')).not.toThrow()
    })

    it('should call loading without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.loading('Loading Title')).not.toThrow()
    })
  })

  describe('favorites notifications', () => {
    it('should call favoriteAdded without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.favoriteAdded('Naruto')).not.toThrow()
    })

    it('should call favoriteRemoved without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.favoriteRemoved('Naruto')).not.toThrow()
    })

    it('should call favoriteError without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.favoriteError()).not.toThrow()
    })

    it('should call clearFavoritesSuccess without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.clearFavoritesSuccess()).not.toThrow()
    })
  })

  describe('watched episodes notifications', () => {
    it('should call episodeMarkedWatched without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.episodeMarkedWatched('Naruto', 5)).not.toThrow()
    })

    it('should call episodeMarkedUnwatched without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.episodeMarkedUnwatched('Naruto', 5)).not.toThrow()
    })

    it('should call allEpisodesMarkedWatched without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.allEpisodesMarkedWatched('Naruto')).not.toThrow()
    })

    it('should call watchedCleared without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.watchedCleared('Naruto')).not.toThrow()
    })

    it('should call watchedError without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.watchedError()).not.toThrow()
    })
  })

  describe('loading notifications', () => {
    it('should call loadingAnime and return dismiss function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      const dismiss = notifications.loadingAnime()

      // Should return a function
      expect(typeof dismiss).toBe('function')

      // Calling dismiss should not throw
      expect(() => dismiss()).not.toThrow()
    })
  })

  describe('API error notifications', () => {
    it('should call rateLimited without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.rateLimited()).not.toThrow()
    })

    it('should call serviceUnavailable without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.serviceUnavailable()).not.toThrow()
    })

    it('should call animeNotFound without throwing', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const { notifications } = wrapper.vm

      expect(() => notifications.animeNotFound()).not.toThrow()
    })
  })
})
