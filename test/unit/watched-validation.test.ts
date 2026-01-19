import { describe, it, expect } from 'vitest'
import {
  markWatchedInputSchema,
  markAllWatchedInputSchema,
  markUnwatchedInputSchema,
  watchedEpisodeSchema,
} from '../../shared/schemas'

describe('markWatchedInputSchema', () => {
  it('accepts valid input', () => {
    const result = markWatchedInputSchema.safeParse({
      mal_id: 1,
      episode_number: 1,
    })
    expect(result.success).toBe(true)
  })

  it('accepts high episode numbers within limit', () => {
    const result = markWatchedInputSchema.safeParse({
      mal_id: 1,
      episode_number: 5000,
    })
    expect(result.success).toBe(true)
  })

  it('rejects episode_number <= 0', () => {
    expect(
      markWatchedInputSchema.safeParse({
        mal_id: 1,
        episode_number: 0,
      }).success
    ).toBe(false)

    expect(
      markWatchedInputSchema.safeParse({
        mal_id: 1,
        episode_number: -1,
      }).success
    ).toBe(false)
  })

  it('rejects episode_number > 5000', () => {
    const result = markWatchedInputSchema.safeParse({
      mal_id: 1,
      episode_number: 5001,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative mal_id', () => {
    const result = markWatchedInputSchema.safeParse({
      mal_id: -1,
      episode_number: 1,
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero mal_id', () => {
    const result = markWatchedInputSchema.safeParse({
      mal_id: 0,
      episode_number: 1,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer values', () => {
    expect(
      markWatchedInputSchema.safeParse({
        mal_id: 1.5,
        episode_number: 1,
      }).success
    ).toBe(false)

    expect(
      markWatchedInputSchema.safeParse({
        mal_id: 1,
        episode_number: 1.5,
      }).success
    ).toBe(false)
  })
})

describe('markAllWatchedInputSchema', () => {
  it('accepts valid input', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: 1,
      totalEpisodes: 26,
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional animeTitle', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: 1,
      totalEpisodes: 26,
      animeTitle: 'Cowboy Bebop',
    })
    expect(result.success).toBe(true)
  })

  it('accepts totalEpisodes at limit (2000)', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: 1,
      totalEpisodes: 2000,
    })
    expect(result.success).toBe(true)
  })

  it('rejects totalEpisodes > 2000 (safety limit)', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: 1,
      totalEpisodes: 2001,
    })
    expect(result.success).toBe(false)
  })

  it('rejects totalEpisodes <= 0', () => {
    expect(
      markAllWatchedInputSchema.safeParse({
        malId: 1,
        totalEpisodes: 0,
      }).success
    ).toBe(false)

    expect(
      markAllWatchedInputSchema.safeParse({
        malId: 1,
        totalEpisodes: -1,
      }).success
    ).toBe(false)
  })

  it('rejects negative malId', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: -1,
      totalEpisodes: 26,
    })
    expect(result.success).toBe(false)
  })

  it('rejects very large totalEpisodes (abuse prevention)', () => {
    const result = markAllWatchedInputSchema.safeParse({
      malId: 1,
      totalEpisodes: 999999,
    })
    expect(result.success).toBe(false)
  })
})

describe('markUnwatchedInputSchema', () => {
  it('accepts valid input', () => {
    const result = markUnwatchedInputSchema.safeParse({
      malId: 1,
      episodeNumber: 5,
    })
    expect(result.success).toBe(true)
  })

  it('rejects negative values', () => {
    expect(
      markUnwatchedInputSchema.safeParse({
        malId: -1,
        episodeNumber: 5,
      }).success
    ).toBe(false)

    expect(
      markUnwatchedInputSchema.safeParse({
        malId: 1,
        episodeNumber: -5,
      }).success
    ).toBe(false)
  })

  it('rejects zero values', () => {
    expect(
      markUnwatchedInputSchema.safeParse({
        malId: 0,
        episodeNumber: 5,
      }).success
    ).toBe(false)

    expect(
      markUnwatchedInputSchema.safeParse({
        malId: 1,
        episodeNumber: 0,
      }).success
    ).toBe(false)
  })
})

describe('watchedEpisodeSchema', () => {
  it('accepts valid watched episode', () => {
    const result = watchedEpisodeSchema.safeParse({
      mal_id: 1,
      episode_number: 1,
      watched_at: Date.now(),
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid watched_at timestamp', () => {
    expect(
      watchedEpisodeSchema.safeParse({
        mal_id: 1,
        episode_number: 1,
        watched_at: -1,
      }).success
    ).toBe(false)

    expect(
      watchedEpisodeSchema.safeParse({
        mal_id: 1,
        episode_number: 1,
        watched_at: 0,
      }).success
    ).toBe(false)
  })

  it('rejects missing required fields', () => {
    expect(
      watchedEpisodeSchema.safeParse({
        mal_id: 1,
        episode_number: 1,
      }).success
    ).toBe(false)

    expect(
      watchedEpisodeSchema.safeParse({
        mal_id: 1,
        watched_at: Date.now(),
      }).success
    ).toBe(false)
  })
})
