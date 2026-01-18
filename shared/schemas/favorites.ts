import { z } from 'zod'

const imageSetSchema = z.object({
  image_url: z.url(),
  small_image_url: z.url(),
  large_image_url: z.url(),
})

const imagesSchema = z.object({
  jpg: imageSetSchema,
  webp: imageSetSchema,
})

export const addFavoriteInputSchema = z.object({
  mal_id: z.number().int().positive(),
  title: z.string().min(1).max(500),
  title_english: z.string().max(500).nullish(),
  images: imagesSchema,
  score: z.number().min(0).max(10).nullish(),
  year: z.number().int().positive().nullish(),
  episodes: z.number().int().positive().nullish(),
  genres: z
    .array(
      z.object({
        mal_id: z.number().int().positive(),
        name: z.string(),
      })
    )
    .nullish(),
  airing: z.boolean().nullish(),
})

export type AddFavoriteInput = z.infer<typeof addFavoriteInputSchema>
