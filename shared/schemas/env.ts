import { z } from 'zod'

/**
 * Schema for validating environment variables at runtime.
 * This ensures all required configuration is present and correctly formatted.
 */
export const envSchema = z.object({
  // Supabase configuration (required for auth and data persistence)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_KEY: z.string().min(1, 'SUPABASE_KEY is required'),

  // Jikan API configuration (optional, has default)
  NUXT_JIKAN_API_URL: z
    .string()
    .url('NUXT_JIKAN_API_URL must be a valid URL')
    .default('https://api.jikan.moe/v4'),

  // Public site URL (optional, has default)
  NUXT_PUBLIC_SITE_URL: z
    .string()
    .url('NUXT_PUBLIC_SITE_URL must be a valid URL')
    .default('http://localhost:3000'),
})

/**
 * Schema for public runtime config (exposed to client).
 * These values are safe to expose in the browser.
 */
export const publicEnvSchema = z.object({
  siteUrl: z.string().url().default('http://localhost:3000'),
})

/**
 * Schema for private runtime config (server-only).
 * These values should never be exposed to the client.
 */
export const privateEnvSchema = z.object({
  jikanApiUrl: z.string().url().default('https://api.jikan.moe/v4'),
})

/**
 * Validates environment variables and returns typed config.
 * Throws ZodError if validation fails.
 *
 * @example
 * ```ts
 * // In a Nuxt plugin or server middleware
 * const env = validateEnv(process.env)
 * console.log(env.SUPABASE_URL)
 * ```
 */
export function validateEnv(env: Record<string, string | undefined>) {
  return envSchema.parse(env)
}

/**
 * Safely validates environment variables without throwing.
 * Returns success/error result.
 *
 * @example
 * ```ts
 * const result = safeValidateEnv(process.env)
 * if (!result.success) {
 *   console.error('Invalid env:', result.error.flatten())
 * }
 * ```
 */
export function safeValidateEnv(env: Record<string, string | undefined>) {
  return envSchema.safeParse(env)
}

// Export types
export type Env = z.infer<typeof envSchema>
export type PublicEnv = z.infer<typeof publicEnvSchema>
export type PrivateEnv = z.infer<typeof privateEnvSchema>
