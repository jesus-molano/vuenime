import { describe, it, expect } from 'vitest'
import { getResponsiveImageUrl, getOptimalImageSize } from '~/utils/responsive-image'
import type { AnimeImages } from '~~/shared/types'

describe('responsive-image utilities', () => {
  // Mock image data following Jikan API structure
  const createMockImages = (options?: {
    small?: string
    medium?: string
    large?: string
  }): AnimeImages => ({
    jpg: {
      image_url: options?.medium ?? 'https://cdn.example.com/medium.jpg',
      small_image_url: options?.small ?? 'https://cdn.example.com/small.jpg',
      large_image_url: options?.large ?? 'https://cdn.example.com/large.jpg',
    },
    webp: {
      image_url: options?.medium ?? 'https://cdn.example.com/medium.webp',
      small_image_url: options?.small ?? 'https://cdn.example.com/small.webp',
      large_image_url: options?.large ?? 'https://cdn.example.com/large.webp',
    },
  })

  describe('getResponsiveImageUrl', () => {
    describe('size selection', () => {
      it('should return large image by default', () => {
        const images = createMockImages()
        expect(getResponsiveImageUrl(images)).toBe('https://cdn.example.com/large.webp')
      })

      it('should return large image when size is "large"', () => {
        const images = createMockImages()
        expect(getResponsiveImageUrl(images, 'large')).toBe('https://cdn.example.com/large.webp')
      })

      it('should return medium image when size is "medium"', () => {
        const images = createMockImages()
        expect(getResponsiveImageUrl(images, 'medium')).toBe('https://cdn.example.com/medium.webp')
      })

      it('should return small image when size is "small"', () => {
        const images = createMockImages()
        expect(getResponsiveImageUrl(images, 'small')).toBe('https://cdn.example.com/small.webp')
      })
    })

    describe('fallback behavior', () => {
      it('should fallback to medium when small is not available', () => {
        const images = createMockImages({ small: '', medium: 'medium.webp', large: 'large.webp' })
        expect(getResponsiveImageUrl(images, 'small')).toBe('medium.webp')
      })

      it('should fallback to large when small and medium are not available', () => {
        const images = createMockImages({ small: '', medium: '', large: 'large.webp' })
        expect(getResponsiveImageUrl(images, 'small')).toBe('large.webp')
      })

      it('should fallback to large when medium is not available', () => {
        const images = createMockImages({ small: 'small.webp', medium: '', large: 'large.webp' })
        expect(getResponsiveImageUrl(images, 'medium')).toBe('large.webp')
      })

      it('should fallback to medium when large is not available', () => {
        const images = createMockImages({ small: 'small.webp', medium: 'medium.webp', large: '' })
        expect(getResponsiveImageUrl(images, 'large')).toBe('medium.webp')
      })
    })

    describe('edge cases', () => {
      it('should return empty string for undefined images', () => {
        expect(getResponsiveImageUrl(undefined)).toBe('')
      })

      it('should return empty string when webp is missing', () => {
        const images = { jpg: createMockImages().jpg } as AnimeImages
        expect(getResponsiveImageUrl(images)).toBe('')
      })

      it('should return empty string when all URLs are empty', () => {
        const images = createMockImages({ small: '', medium: '', large: '' })
        expect(getResponsiveImageUrl(images, 'large')).toBe('')
        expect(getResponsiveImageUrl(images, 'medium')).toBe('')
        expect(getResponsiveImageUrl(images, 'small')).toBe('')
      })

      it('should handle null webp gracefully', () => {
        const images = { jpg: createMockImages().jpg, webp: null } as unknown as AnimeImages
        expect(getResponsiveImageUrl(images)).toBe('')
      })
    })

    describe('real-world URLs', () => {
      it('should work with MyAnimeList CDN URLs', () => {
        const images: AnimeImages = {
          jpg: {
            image_url: 'https://cdn.myanimelist.net/images/anime/1/249648.jpg',
            small_image_url: 'https://cdn.myanimelist.net/images/anime/1/249648t.jpg',
            large_image_url: 'https://cdn.myanimelist.net/images/anime/1/249648l.jpg',
          },
          webp: {
            image_url: 'https://cdn.myanimelist.net/images/anime/1/249648.webp',
            small_image_url: 'https://cdn.myanimelist.net/images/anime/1/249648t.webp',
            large_image_url: 'https://cdn.myanimelist.net/images/anime/1/249648l.webp',
          },
        }

        expect(getResponsiveImageUrl(images, 'large')).toBe('https://cdn.myanimelist.net/images/anime/1/249648l.webp')
        expect(getResponsiveImageUrl(images, 'medium')).toBe('https://cdn.myanimelist.net/images/anime/1/249648.webp')
        expect(getResponsiveImageUrl(images, 'small')).toBe('https://cdn.myanimelist.net/images/anime/1/249648t.webp')
      })
    })
  })

  describe('getOptimalImageSize', () => {
    describe('size thresholds', () => {
      it('should return "small" for width <= 60px', () => {
        expect(getOptimalImageSize(0)).toBe('small')
        expect(getOptimalImageSize(30)).toBe('small')
        expect(getOptimalImageSize(60)).toBe('small')
      })

      it('should return "medium" for width 61-150px', () => {
        expect(getOptimalImageSize(61)).toBe('medium')
        expect(getOptimalImageSize(100)).toBe('medium')
        expect(getOptimalImageSize(150)).toBe('medium')
      })

      it('should return "large" for width > 150px', () => {
        expect(getOptimalImageSize(151)).toBe('large')
        expect(getOptimalImageSize(200)).toBe('large')
        expect(getOptimalImageSize(500)).toBe('large')
        expect(getOptimalImageSize(1000)).toBe('large')
      })
    })

    describe('real-world component sizes', () => {
      it('should return medium for carousel cards (w-28 = 112px)', () => {
        expect(getOptimalImageSize(112)).toBe('medium')
      })

      it('should return medium for mobile card posters (w-24 = 96px)', () => {
        expect(getOptimalImageSize(96)).toBe('medium')
      })

      it('should return large for desktop card posters (w-full in grid)', () => {
        expect(getOptimalImageSize(200)).toBe('large')
      })

      it('should return large for detail page posters', () => {
        expect(getOptimalImageSize(300)).toBe('large')
      })
    })

    describe('edge cases', () => {
      it('should handle negative numbers as small', () => {
        expect(getOptimalImageSize(-1)).toBe('small')
        expect(getOptimalImageSize(-100)).toBe('small')
      })

      it('should handle very large numbers as large', () => {
        expect(getOptimalImageSize(10000)).toBe('large')
        expect(getOptimalImageSize(Number.MAX_SAFE_INTEGER)).toBe('large')
      })
    })
  })
})
