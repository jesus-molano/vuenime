import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useFavoritesStore, type AddFavoriteInput } from '../../app/stores/favorites'

// Mock persistedState (Nuxt auto-import)
vi.stubGlobal('persistedState', {
  localStorage: typeof localStorage !== 'undefined' ? localStorage : undefined,
})

// Mock anime data for testing
const mockAnime: AddFavoriteInput = {
  mal_id: 1,
  title: 'Test Anime',
  images: {
    jpg: {
      image_url: 'https://example.com/image.jpg',
      small_image_url: 'https://example.com/small.jpg',
      large_image_url: 'https://example.com/large.jpg',
    },
    webp: {
      image_url: 'https://example.com/image.webp',
      small_image_url: 'https://example.com/small.webp',
      large_image_url: 'https://example.com/large.webp',
    },
  },
  score: 8.5,
  year: 2024,
  episodes: 12,
}

const mockAnime2: AddFavoriteInput = {
  mal_id: 2,
  title: 'Another Anime',
  images: {
    jpg: {
      image_url: 'https://example.com/image2.jpg',
      small_image_url: 'https://example.com/small2.jpg',
      large_image_url: 'https://example.com/large2.jpg',
    },
    webp: {
      image_url: 'https://example.com/image2.webp',
      small_image_url: 'https://example.com/small2.webp',
      large_image_url: 'https://example.com/large2.webp',
    },
  },
  score: 9.0,
  year: 2023,
  episodes: 24,
}

const mockAnime3: AddFavoriteInput = {
  mal_id: 3,
  title: 'Zeta Anime',
  images: {
    jpg: {
      image_url: 'https://example.com/image3.jpg',
      small_image_url: 'https://example.com/small3.jpg',
      large_image_url: 'https://example.com/large3.jpg',
    },
    webp: {
      image_url: 'https://example.com/image3.webp',
      small_image_url: 'https://example.com/small3.webp',
      large_image_url: 'https://example.com/large3.webp',
    },
  },
  score: 7.0,
  year: 2025,
  episodes: 6,
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should start with empty favorites', () => {
      const store = useFavoritesStore()
      expect(store.favorites).toEqual([])
      expect(store.favoritesCount).toBe(0)
    })
  })

  describe('addFavorite', () => {
    it('should add an anime to favorites', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(mockAnime.mal_id)
      expect(store.favorites[0].title).toBe(mockAnime.title)
      expect(store.favorites[0].addedAt).toBeDefined()
    })

    it('should not add duplicate anime', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)
      store.addFavorite(mockAnime)

      expect(store.favorites).toHaveLength(1)
    })

    it('should add multiple different anime', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)
      store.addFavorite(mockAnime2)

      expect(store.favorites).toHaveLength(2)
      expect(store.favoritesCount).toBe(2)
    })
  })

  describe('removeFavorite', () => {
    it('should remove an anime from favorites', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)
      store.addFavorite(mockAnime2)

      store.removeFavorite(mockAnime.mal_id)

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].mal_id).toBe(mockAnime2.mal_id)
    })

    it('should do nothing when removing non-existent anime', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)

      store.removeFavorite(999)

      expect(store.favorites).toHaveLength(1)
    })
  })

  describe('isFavorite', () => {
    it('should return true for favorited anime', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)

      expect(store.isFavorite(mockAnime.mal_id)).toBe(true)
    })

    it('should return false for non-favorited anime', () => {
      const store = useFavoritesStore()

      expect(store.isFavorite(mockAnime.mal_id)).toBe(false)
    })
  })

  describe('toggleFavorite', () => {
    it('should add anime when not in favorites', () => {
      const store = useFavoritesStore()
      store.toggleFavorite(mockAnime)

      expect(store.isFavorite(mockAnime.mal_id)).toBe(true)
    })

    it('should remove anime when already in favorites', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)
      store.toggleFavorite(mockAnime)

      expect(store.isFavorite(mockAnime.mal_id)).toBe(false)
    })
  })

  describe('clearFavorites', () => {
    it('should remove all favorites', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime)
      store.addFavorite(mockAnime2)

      store.clearFavorites()

      expect(store.favorites).toEqual([])
      expect(store.favoritesCount).toBe(0)
    })
  })

  describe('sorting', () => {
    beforeEach(() => {
      // Use a fresh pinia for each test
      setActivePinia(createPinia())
    })

    it('should sort by recent (newest first)', async () => {
      const store = useFavoritesStore()

      store.addFavorite(mockAnime)
      // Small delay to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10))
      store.addFavorite(mockAnime2)
      await new Promise((resolve) => setTimeout(resolve, 10))
      store.addFavorite(mockAnime3)

      const sorted = store.sortedByRecent
      expect(sorted[0].mal_id).toBe(mockAnime3.mal_id)
      expect(sorted[2].mal_id).toBe(mockAnime.mal_id)
    })

    it('should sort by score (highest first)', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime) // score: 8.5
      store.addFavorite(mockAnime2) // score: 9.0
      store.addFavorite(mockAnime3) // score: 7.0

      const sorted = store.sortedByScore
      expect(sorted[0].mal_id).toBe(mockAnime2.mal_id) // 9.0
      expect(sorted[1].mal_id).toBe(mockAnime.mal_id) // 8.5
      expect(sorted[2].mal_id).toBe(mockAnime3.mal_id) // 7.0
    })

    it('should sort by title (alphabetically)', () => {
      const store = useFavoritesStore()
      store.addFavorite(mockAnime3) // Zeta Anime
      store.addFavorite(mockAnime) // Test Anime
      store.addFavorite(mockAnime2) // Another Anime

      const sorted = store.sortedByTitle
      expect(sorted[0].title).toBe('Another Anime')
      expect(sorted[1].title).toBe('Test Anime')
      expect(sorted[2].title).toBe('Zeta Anime')
    })
  })
})
