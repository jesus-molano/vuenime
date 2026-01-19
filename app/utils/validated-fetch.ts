import type { ZodSchema } from 'zod'

/**
 * Wrapper for $fetch with Zod validation
 * Uses graceful degradation: logs warnings but doesn't block on validation failures
 * This is important for external APIs that may change their schema unexpectedly
 */
export async function validatedFetch<T>(
  url: string,
  schema: ZodSchema<T>,
  options?: Parameters<typeof $fetch>[1]
): Promise<T> {
  const rawData = await $fetch(url, options)
  const result = schema.safeParse(rawData)

  if (!result.success) {
    // Log warning but don't block - graceful degradation
    console.warn('[API Validation] Schema mismatch:', {
      url,
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
    // Return raw data as T - trusting the external API
    return rawData as T
  }

  return result.data
}

/**
 * Validates data against a schema with graceful degradation
 * Useful for validating data that's already been fetched
 */
export function validateData<T>(data: unknown, schema: ZodSchema<T>, context?: string): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    console.warn(`[Validation${context ? ` ${context}` : ''}] Schema mismatch:`, {
      errors: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return data as T
  }

  return result.data
}
