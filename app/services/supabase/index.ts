// Re-export only the public database operations (not internal conversion functions)
export {
  fetchUserFavorites,
  fetchExistingIds,
  insertFavorite,
  insertManyFavorites,
  deleteFavorite,
  deleteAllFavorites,
} from './favorites'

export {
  fetchUserWatchedEpisodes,
  fetchWatchedForAnime,
  fetchExistingWatchedIds,
  insertWatchedEpisode,
  insertManyWatchedEpisodes,
  deleteWatchedEpisode,
  deleteAllWatchedForAnime,
  deleteAllWatched,
} from './watched'
