import { RATE_LIMIT } from '~~/shared/constants/api'
import { jikanPathSchema } from '~~/shared/schemas'
import { logger } from '~~/server/utils/logger'

const requestQueue: number[] = []
const ONE_MINUTE_MS = 60 * 1000

const ALLOWED_ENDPOINTS = ['anime', 'top/anime', 'seasons', 'schedules', 'genres/anime', 'random/anime']

/**
 * Remove duplicate anime entries from API responses (Jikan sometimes returns duplicates)
 */
function deduplicateAnimeData<T extends { data?: Array<{ mal_id: number }> }>(response: T): T {
  if (!response.data || !Array.isArray(response.data)) {
    return response
  }

  const seen = new Set<number>()
  const uniqueData = response.data.filter((item) => {
    if (seen.has(item.mal_id)) {
      return false
    }
    seen.add(item.mal_id)
    return true
  })

  return { ...response, data: uniqueData }
}

function isAllowedEndpoint(path: string): boolean {
  const normalized = path.replace(/^\/+/, '')
  return ALLOWED_ENDPOINTS.some(
    (ep) => normalized === ep || normalized.startsWith(`${ep}/`) || normalized.match(/^anime\/\d+/)
  )
}

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now()

  // Remove requests older than 1 minute
  while (requestQueue.length && now - requestQueue[0]! > ONE_MINUTE_MS) {
    requestQueue.shift()
  }

  // If we've reached the maximum requests per minute, wait
  if (requestQueue.length >= RATE_LIMIT.MAX_PER_MINUTE) {
    const waitTime = ONE_MINUTE_MS - (now - requestQueue[0]!)
    await new Promise((resolve) => setTimeout(resolve, waitTime))
    return waitForRateLimit()
  }

  // If 2 requests are made in the last second, wait 500ms
  const recentRequest = requestQueue.filter((time) => now - time < RATE_LIMIT.RETRY_DELAY)
  if (recentRequest.length >= RATE_LIMIT.MAX_PER_SECOND) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT.RETRY_DELAY))
    return waitForRateLimit()
  }

  requestQueue.push(Date.now())
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?.path

  // Validate path with Zod
  const validation = jikanPathSchema.safeParse(path)
  if (!validation.success) {
    logger.jikan.warn('Invalid path', { path, error: validation.error.message })
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid API path',
    })
  }

  // Check if endpoint is allowed
  if (!isAllowedEndpoint(validation.data)) {
    logger.jikan.warn('Endpoint not allowed', { path: validation.data })
    throw createError({
      statusCode: 403,
      statusMessage: 'Endpoint not allowed',
    })
  }

  try {
    await waitForRateLimit()

    const query = getQuery(event)
    const queryString = new URLSearchParams(query as Record<string, string>).toString()
    const url = `${config.jikanApiUrl}/${validation.data}${queryString ? `?${queryString}` : ''}`

    const response = await $fetch(url, {
      retry: RATE_LIMIT.MAX_RETRIES,
      retryDelay: RATE_LIMIT.RETRY_DELAY,
      timeout: 10000,
    })

    // Deduplicate anime lists (Jikan API sometimes returns duplicates)
    return deduplicateAnimeData(response as { data?: Array<{ mal_id: number }> })
  } catch (error: unknown) {
    // Handle FetchError from $fetch
    if (error && typeof error === 'object' && 'response' in error) {
      const fetchError = error as { response?: { status?: number }; message?: string }
      const status = fetchError.response?.status

      // 429 - Rate Limited by Jikan API
      if (status === 429) {
        logger.jikan.warn('Rate limited by Jikan API', { path: validation.data })
        throw createError({
          statusCode: 429,
          statusMessage: 'Rate limited - please wait a moment and try again',
        })
      }

      // 502/503/504 - Upstream issues (MAL down, Jikan overloaded)
      if (status && status >= 502 && status <= 504) {
        logger.jikan.warn('Upstream service unavailable', { path: validation.data, status })
        throw createError({
          statusCode: 503,
          statusMessage: 'Anime database temporarily unavailable - please try again later',
        })
      }

      // 404 - Not found
      if (status === 404) {
        logger.jikan.info('Resource not found', { path: validation.data })
        throw createError({
          statusCode: 404,
          statusMessage: 'Anime not found',
        })
      }
    }

    logger.jikan.error('Request failed', error, {
      path: validation.data,
    })

    // Re-throw if it's already a createError
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch from anime API',
    })
  }
})
