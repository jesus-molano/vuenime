import { describe, it, expect } from 'vitest'
import { formatNumber } from '../../app/utils/formatters'

describe('formatters', () => {
  describe('formatNumber', () => {
    it('should return the number as string for values under 1000', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(1)).toBe('1')
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(500)).toBe('500')
    })

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1.0K')
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(10000)).toBe('10.0K')
      expect(formatNumber(999999)).toBe('1000.0K')
    })

    it('should format millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1.0M')
      expect(formatNumber(1500000)).toBe('1.5M')
      expect(formatNumber(10000000)).toBe('10.0M')
      expect(formatNumber(2500000)).toBe('2.5M')
    })

    it('should handle edge cases at boundaries', () => {
      // Just under 1000
      expect(formatNumber(999)).toBe('999')
      // Exactly 1000
      expect(formatNumber(1000)).toBe('1.0K')
      // Just under 1 million
      expect(formatNumber(999999)).toBe('1000.0K')
      // Exactly 1 million
      expect(formatNumber(1000000)).toBe('1.0M')
    })
  })
})
