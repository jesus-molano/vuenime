import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createCachedData,
  markCacheFresh,
  invalidateCache,
  clearAllCacheTimestamps,
  CACHE_TTL,
} from '~/utils/cache'
import type { NuxtApp } from '#app'

describe('cache utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearAllCacheTimestamps()
  })

  afterEach(() => {
    vi.useRealTimers()
    clearAllCacheTimestamps()
  })

  const createMockNuxtApp = (
    payloadData: Record<string, unknown> = {},
    staticData: Record<string, unknown> = {}
  ): NuxtApp =>
    ({
      payload: { data: payloadData },
      static: { data: staticData },
    }) as unknown as NuxtApp

  describe('createCachedData', () => {
    it('should return undefined when no cached data exists', () => {
      const getCachedData = createCachedData<{ test: string }>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp()

      const result = getCachedData('test-key', nuxtApp)

      expect(result).toBeUndefined()
    })

    it('should return cached data from payload when it exists', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      const result = getCachedData('test-key', nuxtApp)

      expect(result).toEqual(testData)
    })

    it('should return cached data from static when payload is empty', () => {
      const testData = { test: 'static-value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({}, { 'test-key': testData })

      const result = getCachedData('test-key', nuxtApp)

      expect(result).toEqual(testData)
    })

    it('should prefer payload data over static data', () => {
      const payloadData = { test: 'payload' }
      const staticData = { test: 'static' }
      const getCachedData = createCachedData<typeof payloadData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'test-key': payloadData }, { 'test-key': staticData })

      const result = getCachedData('test-key', nuxtApp)

      expect(result).toEqual(payloadData)
    })

    it('should set timestamp on first access (SSR data)', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access - should set timestamp
      const result1 = getCachedData('test-key', nuxtApp)
      expect(result1).toEqual(testData)

      // Second access within TTL - should still return data
      vi.advanceTimersByTime(1000)
      const result2 = getCachedData('test-key', nuxtApp)
      expect(result2).toEqual(testData)
    })

    it('should return data when within TTL', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT) // 5 minutes
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access sets timestamp
      getCachedData('test-key', nuxtApp)

      // Advance time but stay within TTL (5 minutes = 300000ms)
      vi.advanceTimersByTime(299999)

      const result = getCachedData('test-key', nuxtApp)
      expect(result).toEqual(testData)
    })

    it('should return undefined when cache has expired', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT) // 5 minutes
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access sets timestamp
      getCachedData('test-key', nuxtApp)

      // Advance time past TTL (5 minutes = 300000ms)
      vi.advanceTimersByTime(300001)

      const result = getCachedData('test-key', nuxtApp)
      expect(result).toBeUndefined()
    })

    it('should work with different TTL values', () => {
      const testData = { test: 'value' }
      const getCachedDataLong = createCachedData<typeof testData>(CACHE_TTL.VERY_LONG) // 1 hour
      const nuxtApp = createMockNuxtApp({ 'long-key': testData })

      // First access
      getCachedDataLong('long-key', nuxtApp)

      // Advance 30 minutes - should still be valid
      vi.advanceTimersByTime(30 * 60 * 1000)

      const result = getCachedDataLong('long-key', nuxtApp)
      expect(result).toEqual(testData)
    })

    it('should handle multiple keys independently', () => {
      const data1 = { test: 'data1' }
      const data2 = { test: 'data2' }
      const getCachedData = createCachedData<typeof data1>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'key1': data1, 'key2': data2 })

      // Access both keys
      getCachedData('key1', nuxtApp)
      vi.advanceTimersByTime(100000)
      getCachedData('key2', nuxtApp)

      // Advance time so key1 expires but key2 is still fresh
      vi.advanceTimersByTime(200001)

      expect(getCachedData('key1', nuxtApp)).toBeUndefined()
      expect(getCachedData('key2', nuxtApp)).toEqual(data2)
    })
  })

  describe('markCacheFresh', () => {
    it('should update the timestamp for a key', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access
      getCachedData('test-key', nuxtApp)

      // Advance time close to expiry
      vi.advanceTimersByTime(299000)

      // Refresh the cache
      markCacheFresh('test-key')

      // Advance more time - would have expired without refresh
      vi.advanceTimersByTime(200000)

      // Should still return data because we refreshed
      const result = getCachedData('test-key', nuxtApp)
      expect(result).toEqual(testData)
    })

    it('should allow refreshing cache that would otherwise expire', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(60000) // 1 minute TTL
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access
      getCachedData('test-key', nuxtApp)

      // Advance 50 seconds
      vi.advanceTimersByTime(50000)

      // Refresh
      markCacheFresh('test-key')

      // Advance another 50 seconds - would be 100s total, past 60s TTL
      vi.advanceTimersByTime(50000)

      // Should still be valid because we refreshed at 50s
      expect(getCachedData('test-key', nuxtApp)).toEqual(testData)
    })
  })

  describe('invalidateCache', () => {
    it('should remove timestamp for a key', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.VERY_LONG)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access - sets timestamp and returns data
      const result1 = getCachedData('test-key', nuxtApp)
      expect(result1).toEqual(testData)

      // Invalidate
      invalidateCache('test-key')

      // Access again - no timestamp, so it treats as SSR data and sets new timestamp
      const result2 = getCachedData('test-key', nuxtApp)
      expect(result2).toEqual(testData)
    })

    it('should not affect other keys', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'key1': testData, 'key2': testData })

      // Access both keys
      getCachedData('key1', nuxtApp)
      getCachedData('key2', nuxtApp)

      // Invalidate only key1
      invalidateCache('key1')

      // Advance time but within TTL
      vi.advanceTimersByTime(100000)

      // key2 should still have its original timestamp and be valid
      // key1 will get a new timestamp on access
      expect(getCachedData('key2', nuxtApp)).toEqual(testData)
    })

    it('should allow forcing a refresh on next access', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.VERY_LONG)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access
      getCachedData('test-key', nuxtApp)

      // Invalidate to force refresh
      invalidateCache('test-key')

      // The next access will treat it as new SSR data
      const result = getCachedData('test-key', nuxtApp)
      expect(result).toEqual(testData)
    })
  })

  describe('clearAllCacheTimestamps', () => {
    it('should clear all timestamps', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({
        'key1': testData,
        'key2': testData,
        'key3': testData,
      })

      // Access all keys
      getCachedData('key1', nuxtApp)
      getCachedData('key2', nuxtApp)
      getCachedData('key3', nuxtApp)

      // Clear all
      clearAllCacheTimestamps()

      // All keys should now be treated as new SSR data on next access
      // They will return data but with new timestamps
      expect(getCachedData('key1', nuxtApp)).toEqual(testData)
      expect(getCachedData('key2', nuxtApp)).toEqual(testData)
      expect(getCachedData('key3', nuxtApp)).toEqual(testData)
    })

    it('should be useful for logout scenarios', () => {
      const userData = { user: 'data' }
      const getCachedData = createCachedData<typeof userData>(CACHE_TTL.VERY_LONG)
      const nuxtApp = createMockNuxtApp({ 'user-data': userData })

      // Access user data
      getCachedData('user-data', nuxtApp)

      // Simulate logout - clear all cache
      clearAllCacheTimestamps()

      // Data should be treated as fresh SSR data
      expect(getCachedData('user-data', nuxtApp)).toEqual(userData)
    })
  })

  describe('CACHE_TTL constants', () => {
    it('should have SHORT as 5 minutes', () => {
      expect(CACHE_TTL.SHORT).toBe(5 * 60 * 1000)
    })

    it('should have MEDIUM as 10 minutes', () => {
      expect(CACHE_TTL.MEDIUM).toBe(10 * 60 * 1000)
    })

    it('should have LONG as 30 minutes', () => {
      expect(CACHE_TTL.LONG).toBe(30 * 60 * 1000)
    })

    it('should have VERY_LONG as 1 hour', () => {
      expect(CACHE_TTL.VERY_LONG).toBe(60 * 60 * 1000)
    })

    it('should have correct relative ordering', () => {
      expect(CACHE_TTL.SHORT).toBeLessThan(CACHE_TTL.MEDIUM)
      expect(CACHE_TTL.MEDIUM).toBeLessThan(CACHE_TTL.LONG)
      expect(CACHE_TTL.LONG).toBeLessThan(CACHE_TTL.VERY_LONG)
    })
  })

  describe('edge cases', () => {
    it('should handle zero TTL', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(0)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access - sets timestamp
      getCachedData('test-key', nuxtApp)

      // Any time advance should expire
      vi.advanceTimersByTime(1)

      expect(getCachedData('test-key', nuxtApp)).toBeUndefined()
    })

    it('should handle very large TTL', () => {
      const testData = { test: 'value' }
      const getCachedData = createCachedData<typeof testData>(Number.MAX_SAFE_INTEGER)
      const nuxtApp = createMockNuxtApp({ 'test-key': testData })

      // First access
      getCachedData('test-key', nuxtApp)

      // Advance a lot of time
      vi.advanceTimersByTime(365 * 24 * 60 * 60 * 1000) // 1 year

      expect(getCachedData('test-key', nuxtApp)).toEqual(testData)
    })

    it('should handle accessing non-existent key multiple times', () => {
      const getCachedData = createCachedData<{ test: string }>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp()

      expect(getCachedData('non-existent', nuxtApp)).toBeUndefined()
      expect(getCachedData('non-existent', nuxtApp)).toBeUndefined()
      expect(getCachedData('non-existent', nuxtApp)).toBeUndefined()
    })

    it('should correctly type the return value', () => {
      interface CustomData {
        id: number
        name: string
      }
      const testData: CustomData = { id: 1, name: 'test' }
      const getCachedData = createCachedData<CustomData>(CACHE_TTL.SHORT)
      const nuxtApp = createMockNuxtApp({ 'typed-key': testData })

      const result = getCachedData('typed-key', nuxtApp)

      if (result) {
        expect(result.id).toBe(1)
        expect(result.name).toBe('test')
      }
    })
  })
})
