import { z } from 'zod'

/**
 * Schema for marking a single episode as watched
 */
export const markWatchedInputSchema = z.object({
  mal_id: z.number().int().positive(),
  episode_number: z.number().int().positive().max(5000),
})

/**
 * Schema for marking all episodes as watched
 * Includes safety limit on totalEpisodes to prevent abuse
 */
export const markAllWatchedInputSchema = z.object({
  malId: z.number().int().positive(),
  totalEpisodes: z.number().int().positive().max(2000), // Safety limit
  animeTitle: z.string().optional(),
})

/**
 * Schema for a watched episode record
 */
export const watchedEpisodeSchema = z.object({
  mal_id: z.number().int().positive(),
  episode_number: z.number().int().positive(),
  watched_at: z.number().int().positive(),
})

/**
 * Schema for mark as unwatched input
 */
export const markUnwatchedInputSchema = z.object({
  malId: z.number().int().positive(),
  episodeNumber: z.number().int().positive(),
})

export type MarkWatchedInput = z.infer<typeof markWatchedInputSchema>
export type MarkAllWatchedInput = z.infer<typeof markAllWatchedInputSchema>
export type WatchedEpisode = z.infer<typeof watchedEpisodeSchema>
export type MarkUnwatchedInput = z.infer<typeof markUnwatchedInputSchema>
