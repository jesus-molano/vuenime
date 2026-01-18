import { describe, it, expect } from 'vitest'
import { setup, $fetch as nuxtFetch } from '@nuxt/test-utils/runtime'

// Setup Nuxt environment
await setup({
  server: true,
})

describe('Jikan API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Path Validation', () => {
    it('rejects empty paths with 400', async () => {
      try {
        await nuxtFetch('/api/jikan/')
        expect.fail('Should have thrown an error')
      } catch (error: unknown) {
        const err = error as { statusCode?: number }
        expect(err.statusCode).toBe(400)
      }
    })

    it('rejects path traversal attempts with 400', async () => {
      const maliciousPaths = [
        '../etc/passwd',
        'anime/../../../etc/passwd',
        '..%2F..%2Fetc/passwd',
      ]

      for (const path of maliciousPaths) {
        try {
          await nuxtFetch(`/api/jikan/${path}`)
          expect.fail(`Should have rejected: ${path}`)
        } catch (error: unknown) {
          const err = error as { statusCode?: number }
          expect(err.statusCode).toBe(400)
        }
      }
    })

    it('rejects paths starting with slash with 400', async () => {
      try {
        await nuxtFetch('/api/jikan//anime')
        expect.fail('Should have thrown an error')
      } catch (error: unknown) {
        const err = error as { statusCode?: number }
        // Either 400 (invalid path) or 403 (not allowed) is acceptable
        expect([400, 403]).toContain(err.statusCode)
      }
    })

    it('rejects paths with invalid characters with 400', async () => {
      const invalidPaths = [
        'anime?id=1',
        'anime<script>',
        'anime&test=1',
        'anime;ls',
      ]

      for (const path of invalidPaths) {
        try {
          await nuxtFetch(`/api/jikan/${path}`)
          expect.fail(`Should have rejected: ${path}`)
        } catch (error: unknown) {
          const err = error as { statusCode?: number }
          expect(err.statusCode).toBe(400)
        }
      }
    })
  })

  describe('Endpoint Allowlist', () => {
    it('rejects non-allowed endpoints with 403', async () => {
      const blockedEndpoints = [
        'users',
        'user/1',
        'clubs',
        'manga',
        'people',
        'reviews',
      ]

      for (const endpoint of blockedEndpoints) {
        try {
          await nuxtFetch(`/api/jikan/${endpoint}`)
          expect.fail(`Should have rejected: ${endpoint}`)
        } catch (error: unknown) {
          const err = error as { statusCode?: number }
          expect(err.statusCode).toBe(403)
        }
      }
    })

    it('allows valid anime endpoints', async () => {
      // These should not throw 400 or 403
      // They may fail with 500 if the external API is unavailable, which is ok
      const allowedEndpoints = [
        'anime',
        'anime/1',
        'anime/21',
        'anime/1/full',
        'top/anime',
        'seasons',
        'seasons/2024/winter',
        'schedules',
        'genres/anime',
        'random/anime',
      ]

      for (const endpoint of allowedEndpoints) {
        try {
          await nuxtFetch(`/api/jikan/${endpoint}`)
          // If it succeeds, that's fine
        } catch (error: unknown) {
          const err = error as { statusCode?: number }
          // Should not be 400 (invalid path) or 403 (not allowed)
          // 500 is acceptable (external API error)
          expect([400, 403]).not.toContain(err.statusCode)
        }
      }
    })
  })

  describe('Query Parameters', () => {
    it('passes query parameters to the external API', async () => {
      try {
        // This will either succeed or fail with 500 (external API)
        // But should not fail with 400 or 403
        await nuxtFetch('/api/jikan/anime?q=naruto&limit=5')
      } catch (error: unknown) {
        const err = error as { statusCode?: number }
        expect([400, 403]).not.toContain(err.statusCode)
      }
    })
  })
})
