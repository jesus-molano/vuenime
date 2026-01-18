// Jikan API Types
// https://docs.api.jikan.moe/

export interface AnimeImage {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export interface AnimeImages {
  jpg: AnimeImage
  webp: AnimeImage
}

export interface AnimeTrailerImages {
  image_url: string | null
  small_image_url: string | null
  medium_image_url: string | null
  large_image_url: string | null
  maximum_image_url: string | null
}

export interface AnimeTrailer {
  youtube_id: string | null
  url: string | null
  embed_url: string | null
  images: AnimeTrailerImages
}

export interface AnimeTitle {
  type: string
  title: string
}

export interface AnimeAired {
  from: string | null
  to: string | null
  string: string
}

export interface AnimeGenre {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface AnimeStudio {
  mal_id: number
  type: string
  name: string
  url: string
}

export interface Anime {
  mal_id: number
  url: string
  images: AnimeImages
  trailer: AnimeTrailer
  approved: boolean
  titles: AnimeTitle[]
  title: string
  title_english: string | null
  title_japanese: string | null
  title_synonyms: string[]
  type: string | null
  source: string | null
  episodes: number | null
  status: string | null
  airing: boolean
  aired: AnimeAired
  duration: string | null
  rating: string | null
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  members: number | null
  favorites: number | null
  synopsis: string | null
  background: string | null
  season: string | null
  year: number | null
  genres: AnimeGenre[]
  themes: AnimeGenre[]
  demographics: AnimeGenre[]
  studios: AnimeStudio[]
}

export interface AnimePagination {
  last_visible_page: number
  has_next_page: boolean
  current_page: number
  items: {
    count: number
    total: number
    per_page: number
  }
}

export interface AnimeListResponse {
  data: Anime[]
  pagination: AnimePagination
}

export interface AnimeDetailResponse {
  data: Anime
}

// Streaming response from /anime/{id}/streaming
export interface StreamingLink {
  name: string
  url: string
}

export interface AnimeStreamingResponse {
  data: StreamingLink[]
}

// Episodes response from /anime/{id}/episodes
export interface Episode {
  mal_id: number
  url: string
  title: string
  title_japanese: string | null
  title_romanji: string | null
  aired: string | null
  score: number | null
  filler: boolean
  recap: boolean
}

export interface AnimeEpisodesResponse {
  data: Episode[]
  pagination: AnimePagination
}

// Filter types
export interface AnimeFilters {
  q?: string
  genres?: string
  status?: 'airing' | 'complete' | 'upcoming'
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx'
  order_by?: 'score' | 'title' | 'rank' | 'popularity' | 'members' | 'favorites'
  sort?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Genre response from /genres/anime
export interface GenreItem {
  mal_id: number
  name: string
  url: string
  count: number
}

export interface GenresResponse {
  data: GenreItem[]
}

// Producer response from /producers
export interface ProducerItem {
  mal_id: number
  url: string
  titles: { type: string; title: string }[]
  images: { jpg: { image_url: string } }
  favorites: number
  count: number
  established: string | null
  about: string | null
}

export interface ProducersResponse {
  data: ProducerItem[]
  pagination: AnimePagination
}

// Schedule types
export type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface ScheduleResponse {
  data: Anime[]
  pagination: AnimePagination
}

// Seasons types
export type Season = 'winter' | 'spring' | 'summer' | 'fall'

export interface SeasonsResponse {
  data: Anime[]
  pagination: AnimePagination
}

// Characters types
export interface VoiceActor {
  person: {
    mal_id: number
    name: string
    images: { jpg: { image_url: string } }
  }
  language: string
}

export interface Character {
  character: {
    mal_id: number
    name: string
    images: {
      jpg: { image_url: string }
      webp: { image_url: string }
    }
  }
  role: 'Main' | 'Supporting'
  voice_actors: VoiceActor[]
}

export interface CharactersResponse {
  data: Character[]
}

// Recommendations types
export interface Recommendation {
  entry: {
    mal_id: number
    title: string
    images: AnimeImages
  }
  votes: number
}

export interface RecommendationsResponse {
  data: Recommendation[]
}

// Reviews types
export interface Review {
  mal_id: number
  user: {
    username: string
    images: { jpg: { image_url: string } }
  }
  score: number
  review: string
  date: string
  tags: string[]
  reactions: { overall: number }
}

export interface ReviewsResponse {
  data: Review[]
  pagination: AnimePagination
}

// News types
export interface NewsItem {
  mal_id: number
  url: string
  title: string
  date: string
  author_username: string
  excerpt: string
  images: { jpg: { image_url: string } }
  comments: number
}

export interface NewsResponse {
  data: NewsItem[]
  pagination: AnimePagination
}
