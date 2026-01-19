/**
 * Environment Validation Plugin
 * Validates required environment variables at server startup.
 * Prevents runtime errors by catching missing configuration early.
 */

import { safeValidateEnv } from '~~/shared/schemas/env'
import { createLogger } from '../utils/logger'

const logger = createLogger('EnvValidation')

export default defineNitroPlugin(() => {
  const result = safeValidateEnv(process.env)

  if (!result.success) {
    const errors = result.error.flatten()
    const fieldErrors: Record<string, string[]> = {}

    for (const [field, messages] of Object.entries(errors.fieldErrors || {})) {
      if (messages) {
        fieldErrors[field] = messages
      }
    }

    logger.error('Environment validation failed', null, {
      fieldErrors,
      hint: 'Required: SUPABASE_URL, SUPABASE_KEY. See .env.example for configuration.',
    })

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed')
    }
  }
})
