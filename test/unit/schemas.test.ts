import { describe, it, expect } from 'vitest'
import { jikanPathSchema, animeSearchParamsSchema, addFavoriteInputSchema } from '../../shared/schemas'

describe('jikanPathSchema', () => {
  it('accepts valid paths', () => {
    expect(jikanPathSchema.safeParse('anime').success).toBe(true)
    expect(jikanPathSchema.safeParse('anime/1').success).toBe(true)
    expect(jikanPathSchema.safeParse('top/anime').success).toBe(true)
    expect(jikanPathSchema.safeParse('anime/12345/full').success).toBe(true)
  })

  it('rejects empty paths', () => {
    expect(jikanPathSchema.safeParse('').success).toBe(false)
  })

  it('rejects path traversal attempts', () => {
    expect(jikanPathSchema.safeParse('../etc/passwd').success).toBe(false)
    expect(jikanPathSchema.safeParse('anime/../secret').success).toBe(false)
    expect(jikanPathSchema.safeParse('/anime').success).toBe(false)
  })

  it('rejects invalid characters', () => {
    expect(jikanPathSchema.safeParse('anime?id=1').success).toBe(false)
    expect(jikanPathSchema.safeParse('anime&test').success).toBe(false)
    expect(jikanPathSchema.safeParse('anime<script>').success).toBe(false)
  })
})

describe('animeSearchParamsSchema', () => {
  it('accepts valid search params', () => {
    const result = animeSearchParamsSchema.safeParse({
      q: 'naruto',
      type: 'tv',
      status: 'airing',
      page: 1,
      limit: 25,
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty params', () => {
    expect(animeSearchParamsSchema.safeParse({}).success).toBe(true)
  })

  it('coerces string numbers to numbers', () => {
    const result = animeSearchParamsSchema.safeParse({
      page: '5',
      limit: '10',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(5)
      expect(result.data.limit).toBe(10)
    }
  })

  it('rejects invalid type values', () => {
    const result = animeSearchParamsSchema.safeParse({
      type: 'invalid',
    })
    expect(result.success).toBe(false)
  })

  it('rejects page numbers over 1000', () => {
    const result = animeSearchParamsSchema.safeParse({
      page: 1001,
    })
    expect(result.success).toBe(false)
  })

  it('rejects limit over 25', () => {
    const result = animeSearchParamsSchema.safeParse({
      limit: 26,
    })
    expect(result.success).toBe(false)
  })

  it('rejects query strings over 100 characters', () => {
    const result = animeSearchParamsSchema.safeParse({
      q: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})

describe('addFavoriteInputSchema', () => {
  const validInput = {
    mal_id: 1,
    title: 'Cowboy Bebop',
    title_english: 'Cowboy Bebop',
    images: {
      jpg: {
        image_url: 'https://cdn.example.com/image.jpg',
        small_image_url: 'https://cdn.example.com/small.jpg',
        large_image_url: 'https://cdn.example.com/large.jpg',
      },
      webp: {
        image_url: 'https://cdn.example.com/image.webp',
        small_image_url: 'https://cdn.example.com/small.webp',
        large_image_url: 'https://cdn.example.com/large.webp',
      },
    },
    score: 8.75,
    year: 1998,
    episodes: 26,
    genres: [{ mal_id: 1, name: 'Action' }],
    airing: false,
  }

  it('accepts valid favorite input', () => {
    const result = addFavoriteInputSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('accepts input with minimal fields', () => {
    const result = addFavoriteInputSchema.safeParse({
      mal_id: 1,
      title: 'Test',
      images: validInput.images,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid mal_id', () => {
    const result = addFavoriteInputSchema.safeParse({
      ...validInput,
      mal_id: -1,
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = addFavoriteInputSchema.safeParse({
      ...validInput,
      title: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects score outside 0-10 range', () => {
    expect(
      addFavoriteInputSchema.safeParse({
        ...validInput,
        score: 11,
      }).success
    ).toBe(false)

    expect(
      addFavoriteInputSchema.safeParse({
        ...validInput,
        score: -1,
      }).success
    ).toBe(false)
  })

  it('allows null/undefined for optional fields', () => {
    const result = addFavoriteInputSchema.safeParse({
      mal_id: 1,
      title: 'Test',
      title_english: null,
      images: validInput.images,
      score: null,
      year: undefined,
      episodes: null,
      genres: null,
      airing: null,
    })
    expect(result.success).toBe(true)
  })
})
