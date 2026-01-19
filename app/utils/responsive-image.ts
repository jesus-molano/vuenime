import type { AnimeImages } from '~~/shared/types'

/**
 * Image size options from Jikan API
 * - small: ~50x74px - for tiny thumbnails
 * - medium: ~100x141px - for carousel cards on mobile
 * - large: ~225x350px - for main cards and desktop
 */
export type ImageSize = 'small' | 'medium' | 'large'

/**
 * Get the appropriate image URL based on desired size
 * Falls back to larger sizes if smaller not available
 */
export function getResponsiveImageUrl(images: AnimeImages | undefined, size: ImageSize = 'large'): string {
  if (!images?.webp) return ''

  const { webp } = images

  switch (size) {
    case 'small':
      return webp.small_image_url || webp.image_url || webp.large_image_url || ''
    case 'medium':
      return webp.image_url || webp.large_image_url || ''
    case 'large':
    default:
      return webp.large_image_url || webp.image_url || ''
  }
}

/**
 * Determine optimal image size based on container width
 * @param containerWidth - Width in pixels
 */
export function getOptimalImageSize(containerWidth: number): ImageSize {
  if (containerWidth <= 60) return 'small'
  if (containerWidth <= 150) return 'medium'
  return 'large'
}
