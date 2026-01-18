import type {
  AnimeListResponse,
  AnimeDetailResponse,
  AnimeStreamingResponse,
  AnimeEpisodesResponse,
  GenresResponse,
  ScheduleDay,
  ScheduleResponse,
  SeasonsResponse,
  CharactersResponse,
  RecommendationsResponse,
  ReviewsResponse,
  NewsResponse,
} from '~~/shared/types'

const API_BASE = '/api/jikan'

export interface AnimeSearchParams {
  q?: string
  type?: string
  genres?: string
  start_date?: string
  end_date?: string
  page?: number
  limit?: number
}

export interface AnimeListParams {
  page?: number
  limit?: number
}

export interface EpisodesParams {
  page?: number
}

export interface TopAnimeParams {
  limit?: number
  filter?: 'airing' | 'upcoming' | 'bypopularity' | 'favorite'
}

/**
 * Anime API Service
 * Centralized API calls for anime-related endpoints
 */
export const animeApi = {
  /**
   * Search/list anime with filters
   */
  search: (params: AnimeSearchParams) => {
    return $fetch<AnimeListResponse>(`${API_BASE}/anime`, { query: params })
  },

  /**
   * Get anime list (trending/popular)
   */
  list: (params: AnimeListParams = {}) => {
    return $fetch<AnimeListResponse>(`${API_BASE}/anime`, { query: params })
  },

  /**
   * Get anime by ID
   */
  getById: (id: string | number) => {
    return $fetch<AnimeDetailResponse>(`${API_BASE}/anime/${id}`)
  },

  /**
   * Get anime episodes with pagination
   */
  getEpisodes: (id: string | number, params: EpisodesParams = {}) => {
    return $fetch<AnimeEpisodesResponse>(`${API_BASE}/anime/${id}/episodes`, { query: params })
  },

  /**
   * Get streaming links for an anime
   */
  getStreaming: (id: string | number) => {
    return $fetch<AnimeStreamingResponse>(`${API_BASE}/anime/${id}/streaming`)
  },

  /**
   * Get all anime genres
   */
  getGenres: () => {
    return $fetch<GenresResponse>(`${API_BASE}/genres/anime`)
  },

  /**
   * Get top anime by score
   */
  getTopAnime: (params: TopAnimeParams = {}) => {
    return $fetch<AnimeListResponse>(`${API_BASE}/top/anime`, { query: params })
  },

  /**
   * Get a random anime
   */
  getRandom: () => {
    // Add timestamp to bypass any caching
    return $fetch<AnimeDetailResponse>(`${API_BASE}/random/anime`, {
      query: { _t: Date.now() },
    })
  },

  /**
   * Get anime schedule by day
   */
  getSchedule: (day?: ScheduleDay, params?: { limit?: number }) => {
    return $fetch<ScheduleResponse>(`${API_BASE}/schedules`, {
      query: { filter: day, ...params },
    })
  },

  /**
   * Get current season anime
   */
  getCurrentSeason: (params?: { limit?: number; page?: number }) => {
    return $fetch<SeasonsResponse>(`${API_BASE}/seasons/now`, { query: params })
  },

  /**
   * Get upcoming season anime
   */
  getUpcomingSeason: (params?: { limit?: number; page?: number }) => {
    return $fetch<SeasonsResponse>(`${API_BASE}/seasons/upcoming`, { query: params })
  },

  /**
   * Get anime characters
   */
  getCharacters: (id: string | number) => {
    return $fetch<CharactersResponse>(`${API_BASE}/anime/${id}/characters`)
  },

  /**
   * Get anime recommendations
   */
  getRecommendations: (id: string | number) => {
    return $fetch<RecommendationsResponse>(`${API_BASE}/anime/${id}/recommendations`)
  },

  /**
   * Get anime reviews
   */
  getReviews: (id: string | number, page?: number) => {
    return $fetch<ReviewsResponse>(`${API_BASE}/anime/${id}/reviews`, { query: { page } })
  },

  /**
   * Get anime news
   */
  getNews: (id: string | number, page?: number) => {
    return $fetch<NewsResponse>(`${API_BASE}/anime/${id}/news`, { query: { page } })
  },
}
