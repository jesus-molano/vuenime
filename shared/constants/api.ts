// Jikan API Configuration
export const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4'

// Rate limiting constants
export const RATE_LIMIT = {
  MAX_PER_MINUTE: 25, // Keep under 30 for safety margin
  MAX_PER_SECOND: 2,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
} as const

// Cache TTL in seconds
export const CACHE_TTL = {
  ANIME_LIST: 600, // 10 minutes
  ANIME_DETAIL: 3600, // 1 hour
  SEARCH_RESULTS: 300, // 5 minutes
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 24,
  MAX_LIMIT: 25,
  MAX_PAGES_TO_RESTORE: 5,
} as const

// Mobile-optimized limits for faster initial load
// Desktop gets full content, mobile gets reduced for better FCP
export const MOBILE_LIMITS = {
  TRENDING: 12, // vs 24 on desktop - user sees 1-2 cards initially
  CAROUSEL: 8, // vs 15 on desktop - user sees 2-3 cards initially
} as const

export const DESKTOP_LIMITS = {
  TRENDING: 24,
  CAROUSEL: 15,
} as const
