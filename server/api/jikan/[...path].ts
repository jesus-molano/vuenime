import { RATE_LIMIT } from '~~/shared/constants/api'

const requestQueue: number[] = []
const ONE_MINUTE_MS = 60 * 1000

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now()

  // Remove requests older than 1 minute
  while (requestQueue.length && now - requestQueue[0]! > ONE_MINUTE_MS) {
    requestQueue.shift()
  }

  // If we've reached the maximum requests per minute, wait
  if (requestQueue.length >= RATE_LIMIT.MAX_PER_MINUTE) {
    const waitTime = ONE_MINUTE_MS - (now - requestQueue[0]!)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    return waitForRateLimit()
  }

  // If 2 requests are made in the last second, wait 500ms
  const recentRequest = requestQueue.filter(time => now - time < RATE_LIMIT.RETRY_DELAY)
  if (recentRequest.length >= RATE_LIMIT.MAX_PER_SECOND) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.RETRY_DELAY))
    return waitForRateLimit()
  }

  requestQueue.push(Date.now())
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?.path
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()

  await waitForRateLimit()

  const url = `${config.jikanApiUrl}/${path}${queryString ? `?${queryString}` : ''}`

  return await $fetch(url, {
    retry: RATE_LIMIT.MAX_RETRIES,
    retryDelay: RATE_LIMIT.RETRY_DELAY,
  })
})
