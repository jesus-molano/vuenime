import type { Anime, AnimeImages, AnimeGenre } from '~~/shared/types/anime'
import type { FavoriteAnime, AddFavoriteInput } from '~/types/favorites'

/**
 * Factory functions for creating mock anime data
 */

// Default image structure
export const createMockImages = (id: number = 1): AnimeImages => ({
  jpg: {
    image_url: `https://cdn.myanimelist.net/images/anime/${id}/image.jpg`,
    small_image_url: `https://cdn.myanimelist.net/images/anime/${id}/small.jpg`,
    large_image_url: `https://cdn.myanimelist.net/images/anime/${id}/large.jpg`,
  },
  webp: {
    image_url: `https://cdn.myanimelist.net/images/anime/${id}/image.webp`,
    small_image_url: `https://cdn.myanimelist.net/images/anime/${id}/small.webp`,
    large_image_url: `https://cdn.myanimelist.net/images/anime/${id}/large.webp`,
  },
})

// Default genres
export const mockGenres: AnimeGenre[] = [
  { mal_id: 1, type: 'anime', name: 'Action', url: 'https://myanimelist.net/anime/genre/1/Action' },
  { mal_id: 2, type: 'anime', name: 'Adventure', url: 'https://myanimelist.net/anime/genre/2/Adventure' },
  { mal_id: 10, type: 'anime', name: 'Fantasy', url: 'https://myanimelist.net/anime/genre/10/Fantasy' },
]

/**
 * Create a mock Anime object with customizable properties
 */
export function createMockAnime(overrides: Partial<Anime> = {}): Anime {
  const id = overrides.mal_id ?? 1
  return {
    mal_id: id,
    url: `https://myanimelist.net/anime/${id}`,
    images: createMockImages(id),
    trailer: {
      youtube_id: 'abc123',
      url: 'https://www.youtube.com/watch?v=abc123',
      embed_url: 'https://www.youtube.com/embed/abc123',
      images: {
        image_url: null,
        small_image_url: null,
        medium_image_url: null,
        large_image_url: null,
        maximum_image_url: null,
      },
    },
    approved: true,
    titles: [
      { type: 'Default', title: `Test Anime ${id}` },
      { type: 'English', title: `Test Anime ${id} English` },
      { type: 'Japanese', title: `テストアニメ${id}` },
    ],
    title: `Test Anime ${id}`,
    title_english: `Test Anime ${id} English`,
    title_japanese: `テストアニメ${id}`,
    title_synonyms: [],
    type: 'TV',
    source: 'Manga',
    episodes: 12,
    status: 'Finished Airing',
    airing: false,
    aired: {
      from: '2024-01-01T00:00:00+00:00',
      to: '2024-03-31T00:00:00+00:00',
      string: 'Jan 1, 2024 to Mar 31, 2024',
    },
    duration: '24 min per ep',
    rating: 'PG-13 - Teens 13 or older',
    score: 8.5,
    scored_by: 100000,
    rank: 100,
    popularity: 50,
    members: 500000,
    favorites: 10000,
    synopsis: 'This is a test anime synopsis for testing purposes.',
    background: 'Background information about the anime.',
    season: 'winter',
    year: 2024,
    genres: mockGenres,
    themes: [],
    demographics: [],
    studios: [{ mal_id: 1, type: 'anime', name: 'Test Studio', url: 'https://myanimelist.net/anime/producer/1' }],
    ...overrides,
  }
}

/**
 * Create a mock FavoriteAnime object
 */
export function createMockFavoriteAnime(overrides: Partial<FavoriteAnime> = {}): FavoriteAnime {
  const id = overrides.mal_id ?? 1
  return {
    mal_id: id,
    title: `Test Anime ${id}`,
    images: createMockImages(id),
    score: 8.5,
    year: 2024,
    episodes: 12,
    genres: mockGenres,
    airing: false,
    addedAt: Date.now(),
    ...overrides,
  }
}

/**
 * Create a mock AddFavoriteInput object
 */
export function createMockAddFavoriteInput(overrides: Partial<AddFavoriteInput> = {}): AddFavoriteInput {
  const id = overrides.mal_id ?? 1
  return {
    mal_id: id,
    title: `Test Anime ${id}`,
    images: createMockImages(id),
    score: 8.5,
    year: 2024,
    episodes: 12,
    genres: mockGenres,
    airing: false,
    ...overrides,
  }
}

/**
 * Create multiple mock anime objects
 */
export function createMockAnimeList(count: number, startId: number = 1): Anime[] {
  return Array.from({ length: count }, (_, i) =>
    createMockAnime({
      mal_id: startId + i,
      title: `Test Anime ${startId + i}`,
      score: 7 + Math.random() * 3, // Random score between 7-10
    })
  )
}

/**
 * Create multiple mock favorite anime objects
 */
export function createMockFavoriteList(count: number, startId: number = 1): FavoriteAnime[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) =>
    createMockFavoriteAnime({
      mal_id: startId + i,
      title: `Test Anime ${startId + i}`,
      score: 7 + Math.random() * 3,
      addedAt: now - i * 1000, // Each anime added 1 second apart
    })
  )
}

// Pre-built mock anime for common test scenarios
export const mockAnime1 = createMockAnime({ mal_id: 1, title: 'Alpha Anime', score: 8.5 })
export const mockAnime2 = createMockAnime({ mal_id: 2, title: 'Beta Anime', score: 9.0 })
export const mockAnime3 = createMockAnime({ mal_id: 3, title: 'Zeta Anime', score: 7.0 })

// Default mockAnime for backwards compatibility
export const mockAnime = mockAnime1

export const mockAiringAnime = createMockAnime({
  mal_id: 100,
  title: 'Currently Airing',
  airing: true,
  status: 'Currently Airing',
  episodes: null,
})

export const mockUpcomingAnime = createMockAnime({
  mal_id: 101,
  title: 'Upcoming Anime',
  airing: false,
  status: 'Not yet aired',
  score: null,
  episodes: null,
})
