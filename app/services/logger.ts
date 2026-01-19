/**
 * Logger Service
 * Abstraction layer for logging to allow easy integration with external services
 * (Sentry, Datadog, etc.) in the future without changing application code.
 */

import type { Logger, LogContext, LogLevel } from '~~/shared/types/logger'

interface LogEntry {
  level: LogLevel
  service: string
  message: string
  context?: LogContext
  error?: unknown
  timestamp: string
}

const isProduction = process.env.NODE_ENV === 'production'

const styles: Record<LogLevel, string> = {
  info: 'color: #3b82f6', // blue
  warn: 'color: #f59e0b', // amber
  error: 'color: #ef4444', // red
  debug: 'color: #a8a29e', // gray
}

function formatEntry(level: LogLevel, service: string, message: string, context?: LogContext, error?: unknown): LogEntry {
  return {
    level,
    service,
    message,
    context,
    error,
    timestamp: new Date().toISOString(),
  }
}

function log(entry: LogEntry) {
  // In production, only log errors. This is where we would send logs to Sentry/Datadog.
  if (isProduction && entry.level !== 'error') return

  // Skip debug logs in production
  if (isProduction && entry.level === 'debug') return

  const { level, service, message, context, error, timestamp } = entry

  if (import.meta.client) {
    // Browser console styling
    const style = styles[level]
    console.groupCollapsed(`%c[${level.toUpperCase()}] [${service}] ${message}`, style)
    if (context) console.log('Context:', context)
    if (error) console.error('Error:', error)
    console.log('Time:', timestamp)
    console.groupEnd()
  } else {
    // Server console (SSR)
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${service}]`
    if (level === 'error') {
      console.error(prefix, message, error, context)
    } else {
      console.log(prefix, message, context || '')
    }
  }
}

/**
 * Creates a logger instance for a specific service.
 * Implements the shared Logger interface.
 *
 * @param service - Name of the service or component using the logger
 * @returns Logger instance with debug, info, warn, error methods
 *
 * @example
 * ```ts
 * const logger = createLogger('AuthService')
 * logger.info('User logged in', { userId: '123' })
 * logger.error('Failed to authenticate', error, { attempt: 3 })
 * ```
 */
export function createLogger(service: string): Logger {
  return {
    debug: (message: string, context?: LogContext) => {
      if (!isProduction) {
        log(formatEntry('debug', service, message, context))
      }
    },
    info: (message: string, context?: LogContext) => {
      log(formatEntry('info', service, message, context))
    },
    warn: (message: string, context?: LogContext) => {
      log(formatEntry('warn', service, message, context))
    },
    error: (message: string, error?: unknown, context?: LogContext) => {
      log(formatEntry('error', service, message, context, error))
    },
  }
}

/**
 * Default logger instance for backward compatibility.
 * Uses 'App' as the default service name.
 */
export const logger = createLogger('App')
