import type {
  AnimeListResponse,
  AnimeDetailResponse,
  AnimeStreamingResponse,
  AnimeEpisodesResponse,
  GenresResponse,
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
}
