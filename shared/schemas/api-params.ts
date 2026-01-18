import { z } from 'zod'

export const jikanPathSchema = z
  .string()
  .min(1, 'Path is required')
  .regex(/^[a-zA-Z0-9\-_/]+$/, 'Invalid path characters')
  .refine((path) => !path.includes('..') && !path.startsWith('/'), 'Path traversal not allowed')

export const animeSearchParamsSchema = z.object({
  q: z.string().max(100).optional(),
  type: z.enum(['tv', 'movie', 'ova', 'special', 'ona', 'music']).optional(),
  status: z.enum(['airing', 'complete', 'upcoming']).optional(),
  page: z.coerce.number().int().positive().max(1000).optional(),
  limit: z.coerce.number().int().positive().max(25).optional(),
})

export type JikanPath = z.infer<typeof jikanPathSchema>
export type AnimeSearchParams = z.infer<typeof animeSearchParamsSchema>
