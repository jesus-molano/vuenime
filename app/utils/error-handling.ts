/**
 * Error Handling Utility
 * Decodes technical errors into user-friendly messages and handles internationalization keys if needed.
 */

import { logger } from '~/services/logger'

interface FriendlyError {
  message: string // User facing message or i18n key
  code?: string // Internal error code
  originalError?: unknown
}

const ERROR_MESSAGES = {
  DEFAULT: 'notifications.generalError',
  NETWORK_OFFLINE: 'notifications.networkError',
  TIMEOUT: 'notifications.networkError', // Using same Den Den Mushi message for timeout
  UNAUTHORIZED: 'notifications.loginRequired',
  FORBIDDEN: 'notifications.generalError', // Or maybe a specific forbidden one, but using general for now
  NOT_FOUND: 'notifications.notFound',
  CONFLICT: 'notifications.generalError',
  SUPABASE_PG_ERROR: 'notifications.generalError',
}

export function getFriendlyError(error: unknown, context: string = 'Operation'): FriendlyError {
  // Log the raw error for debugging
  logger.error(`Error during ${context}`, error)

  if (!error) {
    return { message: ERROR_MESSAGES.DEFAULT }
  }

  // Handle String errors
  if (typeof error === 'string') {
    return { message: error, originalError: error }
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Network / Connectivity
    if (message.includes('fetch failed') || message.includes('network error')) {
      return { message: ERROR_MESSAGES.NETWORK_OFFLINE, code: 'NETWORK_ERROR', originalError: error }
    }
    if (message.includes('timeout') || message.includes('abort')) {
      return { message: ERROR_MESSAGES.TIMEOUT, code: 'TIMEOUT', originalError: error }
    }

    // Supabase / Auth specific errors (PostgrestError)
    // We check properties dynamically since we might not have the strict type imported here
    const sbError = error as { code?: string; message?: string; details?: string; hint?: string }

    if (sbError.code) {
      // Postgres error codes
      switch (sbError.code) {
        case '23505': // Unique violation
          return { message: ERROR_MESSAGES.CONFLICT, code: 'CONFLICT', originalError: error }
        case '42501': // RLS violation / Permisssion denied
          return { message: ERROR_MESSAGES.FORBIDDEN, code: 'FORBIDDEN', originalError: error }
        case 'PGRST116': // No rows returned (when expecting one)
          return { message: ERROR_MESSAGES.NOT_FOUND, code: 'NOT_FOUND', originalError: error }
      }
    }
  }

  // Fallback
  return {
    message: ERROR_MESSAGES.DEFAULT,
    originalError: error,
  }
}
