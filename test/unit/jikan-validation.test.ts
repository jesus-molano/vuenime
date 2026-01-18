import { describe, it, expect } from 'vitest'
import { jikanPathSchema } from '../../shared/schemas'

// Mirror the ALLOWED_ENDPOINTS from the API
const ALLOWED_ENDPOINTS = ['anime', 'top/anime', 'seasons', 'schedules', 'genres/anime', 'random/anime']

function isAllowedEndpoint(path: string): boolean {
  const normalized = path.replace(/^\/+/, '')
  return ALLOWED_ENDPOINTS.some(
    (ep) => normalized === ep || normalized.startsWith(`${ep}/`) || normalized.match(/^anime\/\d+/)
  )
}

describe('Jikan API Validation', () => {
  describe('Path Schema Validation', () => {
    it('rejects empty paths', () => {
      const result = jikanPathSchema.safeParse('')
      expect(result.success).toBe(false)
    })

    it('rejects undefined paths', () => {
      const result = jikanPathSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('rejects path traversal attempts', () => {
      const maliciousPaths = [
        '../etc/passwd',
        'anime/../../../etc/passwd',
        '..%2F..%2Fetc/passwd',
        'anime/../../secret',
      ]

      for (const path of maliciousPaths) {
        const result = jikanPathSchema.safeParse(path)
        expect(result.success, `Should reject: ${path}`).toBe(false)
      }
    })

    it('rejects paths with invalid characters', () => {
      const invalidPaths = ['anime<script>', 'anime;ls', "anime'--", 'anime"test']

      for (const path of invalidPaths) {
        const result = jikanPathSchema.safeParse(path)
        expect(result.success, `Should reject: ${path}`).toBe(false)
      }
    })

    it('accepts valid paths', () => {
      const validPaths = ['anime', 'anime/1', 'anime/21/full', 'top/anime', 'seasons/2024/winter']

      for (const path of validPaths) {
        const result = jikanPathSchema.safeParse(path)
        expect(result.success, `Should accept: ${path}`).toBe(true)
      }
    })
  })

  describe('Endpoint Allowlist', () => {
    it('rejects non-allowed endpoints', () => {
      const blockedEndpoints = ['users', 'user/1', 'clubs', 'manga', 'people', 'reviews']

      for (const endpoint of blockedEndpoints) {
        expect(isAllowedEndpoint(endpoint), `Should reject: ${endpoint}`).toBe(false)
      }
    })

    it('allows anime endpoints', () => {
      const allowedEndpoints = ['anime', 'anime/1', 'anime/21', 'anime/1/full', 'anime/12345/episodes']

      for (const endpoint of allowedEndpoints) {
        expect(isAllowedEndpoint(endpoint), `Should allow: ${endpoint}`).toBe(true)
      }
    })

    it('allows other valid endpoints', () => {
      const allowedEndpoints = [
        'top/anime',
        'seasons',
        'seasons/2024/winter',
        'schedules',
        'genres/anime',
        'random/anime',
      ]

      for (const endpoint of allowedEndpoints) {
        expect(isAllowedEndpoint(endpoint), `Should allow: ${endpoint}`).toBe(true)
      }
    })

    it('normalizes paths with leading slashes', () => {
      expect(isAllowedEndpoint('/anime')).toBe(true)
      expect(isAllowedEndpoint('//anime')).toBe(true)
      expect(isAllowedEndpoint('/manga')).toBe(false)
    })
  })
})
