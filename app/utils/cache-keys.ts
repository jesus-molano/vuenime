/**
 * Centralized cache keys for useFetch and data caching
 */
export const CACHE_KEYS = {
  // Static keys (data that doesn't vary by parameters)
  ANIME_GENRES: 'anime-genres',
  CURRENT_SEASON: 'current-season',
  UPCOMING_SEASON: 'upcoming-season',
  SCHEDULE_TODAY: 'schedule-today',
  ANIME_LIST_HOME: 'anime-list-home',

  // Dynamic keys (functions that generate keys with parameters)
  animeDetail: (id: string | number) => `anime-detail-${id}`,
  animeEpisodes: (id: string | number) => `anime-episodes-${id}`,
  animeCharacters: (id: string | number) => `anime-characters-${id}`,
  animeNews: (id: string | number) => `anime-news-${id}`,
  animeReviews: (id: string | number) => `anime-reviews-${id}`,
  animeRecommendations: (id: string | number) => `anime-recommendations-${id}`,
  animeStreaming: (id: string | number) => `anime-streaming-${id}`,
} as const
