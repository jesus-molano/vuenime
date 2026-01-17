/**
 * Represents a watched episode in the client store
 */
export interface WatchedEpisode {
  mal_id: number // Anime ID from MyAnimeList
  episode_number: number
  watched_at: number // Timestamp when marked as watched
}

/**
 * Input type for marking an episode as watched
 */
export interface MarkWatchedInput {
  mal_id: number
  episode_number: number
}

/**
 * Group of watched episodes by anime
 */
export interface WatchedAnime {
  mal_id: number
  episodes: number[] // Array of watched episode numbers
  lastWatched: number // Timestamp of last watched episode
}
