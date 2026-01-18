import { RATE_LIMIT } from '~~/shared/constants/api'
import { jikanPathSchema } from '~~/shared/schemas'

const requestQueue: number[] = []
const ONE_MINUTE_MS = 60 * 1000

const ALLOWED_ENDPOINTS = ['anime', 'top/anime', 'seasons', 'schedules', 'genres/anime', 'random/anime']

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
    console.error('[Jikan API] Invalid path:', { path, error: validation.error })
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid API path',
    })
  }

  // Check if endpoint is allowed
  if (!isAllowedEndpoint(validation.data)) {
    console.error('[Jikan API] Endpoint not allowed:', { path: validation.data })
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

    return await $fetch(url, {
      retry: RATE_LIMIT.MAX_RETRIES,
      retryDelay: RATE_LIMIT.RETRY_DELAY,
      timeout: 10000,
    })
  } catch (error: unknown) {
    console.error('[Jikan API] Error:', {
      path: validation.data,
      error: error instanceof Error ? error.message : error,
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
