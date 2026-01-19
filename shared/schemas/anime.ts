import { z } from 'zod'

// Base schemas for common structures
const animeImageSchema = z.object({
  image_url: z.string().url(),
  small_image_url: z.string().url(),
  large_image_url: z.string().url(),
})

const animeImagesSchema = z.object({
  jpg: animeImageSchema,
  webp: animeImageSchema,
})

const animeTrailerImagesSchema = z.object({
  image_url: z.string().url().nullable(),
  small_image_url: z.string().url().nullable(),
  medium_image_url: z.string().url().nullable(),
  large_image_url: z.string().url().nullable(),
  maximum_image_url: z.string().url().nullable(),
})

const animeTrailerSchema = z.object({
  youtube_id: z.string().nullable(),
  url: z.string().url().nullable(),
  embed_url: z.string().url().nullable(),
  images: animeTrailerImagesSchema,
})

const animeTitleSchema = z.object({
  type: z.string(),
  title: z.string(),
})

const animeAiredSchema = z.object({
  from: z.string().nullable(),
  to: z.string().nullable(),
  string: z.string(),
})

const animeGenreSchema = z.object({
  mal_id: z.number().int().positive(),
  type: z.string(),
  name: z.string(),
  url: z.string().url(),
})

const animeStudioSchema = z.object({
  mal_id: z.number().int().positive(),
  type: z.string(),
  name: z.string(),
  url: z.string().url(),
})

// Main Anime schema
// Using .passthrough() to allow new fields from API without breaking validation
export const animeSchema = z
  .object({
    mal_id: z.number().int().positive(),
    url: z.string().url(),
    images: animeImagesSchema,
    trailer: animeTrailerSchema,
    approved: z.boolean(),
    titles: z.array(animeTitleSchema),
    title: z.string(),
    title_english: z.string().nullable(),
    title_japanese: z.string().nullable(),
    title_synonyms: z.array(z.string()),
    type: z.string().nullable(),
    source: z.string().nullable(),
    episodes: z.number().int().positive().nullable(),
    status: z.string().nullable(),
    airing: z.boolean(),
    aired: animeAiredSchema,
    duration: z.string().nullable(),
    rating: z.string().nullable(),
    score: z.number().min(0).max(10).nullable(),
    scored_by: z.number().int().nonnegative().nullable(),
    rank: z.number().int().positive().nullable(),
    popularity: z.number().int().positive().nullable(),
    members: z.number().int().nonnegative().nullable(),
    favorites: z.number().int().nonnegative().nullable(),
    synopsis: z.string().nullable(),
    background: z.string().nullable(),
    season: z.string().nullable(),
    year: z.number().int().positive().nullable(),
    genres: z.array(animeGenreSchema),
    themes: z.array(animeGenreSchema),
    demographics: z.array(animeGenreSchema),
    studios: z.array(animeStudioSchema),
  })
  .passthrough()

// Pagination schema
export const animePaginationSchema = z.object({
  last_visible_page: z.number().int().positive(),
  has_next_page: z.boolean(),
  current_page: z.number().int().positive(),
  items: z.object({
    count: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    per_page: z.number().int().positive(),
  }),
})

// Response schemas - using .passthrough() to allow new fields from API
export const animeListResponseSchema = z
  .object({
    data: z.array(animeSchema),
    pagination: animePaginationSchema,
  })
  .passthrough()

export const animeDetailResponseSchema = z
  .object({
    data: animeSchema,
  })
  .passthrough()

// Streaming
const streamingLinkSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

export const animeStreamingResponseSchema = z.object({
  data: z.array(streamingLinkSchema),
})

// Episodes
const episodeSchema = z.object({
  mal_id: z.number().int().positive(),
  url: z.string().url(),
  title: z.string(),
  title_japanese: z.string().nullable(),
  title_romanji: z.string().nullable(),
  aired: z.string().nullable(),
  score: z.number().min(0).max(10).nullable(),
  filler: z.boolean(),
  recap: z.boolean(),
})

export const animeEpisodesResponseSchema = z.object({
  data: z.array(episodeSchema),
  pagination: animePaginationSchema,
})

// Characters
const voiceActorSchema = z.object({
  person: z.object({
    mal_id: z.number().int().positive(),
    name: z.string(),
    images: z.object({
      jpg: z.object({ image_url: z.string().url() }),
    }),
  }),
  language: z.string(),
})

const characterSchema = z.object({
  character: z.object({
    mal_id: z.number().int().positive(),
    name: z.string(),
    images: z.object({
      jpg: z.object({ image_url: z.string().url() }),
      webp: z.object({ image_url: z.string().url() }),
    }),
  }),
  role: z.enum(['Main', 'Supporting']),
  voice_actors: z.array(voiceActorSchema),
})

export const charactersResponseSchema = z.object({
  data: z.array(characterSchema),
})

// Recommendations
const recommendationSchema = z.object({
  entry: z.object({
    mal_id: z.number().int().positive(),
    title: z.string(),
    images: animeImagesSchema,
  }),
  votes: z.number().int(),
})

export const recommendationsResponseSchema = z.object({
  data: z.array(recommendationSchema),
})

// Reviews
const reviewSchema = z.object({
  mal_id: z.number().int().positive(),
  user: z.object({
    username: z.string(),
    images: z.object({
      jpg: z.object({ image_url: z.string().url() }),
    }),
  }),
  score: z.number().int().min(1).max(10),
  review: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({ overall: z.number().int().nonnegative() }),
})

export const reviewsResponseSchema = z.object({
  data: z.array(reviewSchema),
  pagination: animePaginationSchema,
})

// News
const newsItemSchema = z.object({
  mal_id: z.number().int().positive(),
  url: z.string().url(),
  title: z.string(),
  date: z.string(),
  author_username: z.string(),
  excerpt: z.string(),
  images: z.object({
    jpg: z.object({ image_url: z.string().url() }),
  }),
  comments: z.number().int().nonnegative(),
})

export const newsResponseSchema = z.object({
  data: z.array(newsItemSchema),
  pagination: animePaginationSchema,
})

// Genres
const genreItemSchema = z.object({
  mal_id: z.number().int().positive(),
  name: z.string(),
  url: z.string().url(),
  count: z.number().int().nonnegative(),
})

export const genresResponseSchema = z.object({
  data: z.array(genreItemSchema),
})

// Schedule (reuses anime schema)
export const scheduleResponseSchema = z.object({
  data: z.array(animeSchema),
  pagination: animePaginationSchema,
})

// Seasons (reuses anime schema)
export const seasonsResponseSchema = z.object({
  data: z.array(animeSchema),
  pagination: animePaginationSchema,
})

// Export types inferred from schemas
export type AnimeSchema = z.infer<typeof animeSchema>
export type AnimeListResponseSchema = z.infer<typeof animeListResponseSchema>
export type AnimeDetailResponseSchema = z.infer<typeof animeDetailResponseSchema>
