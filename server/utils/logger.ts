/**
 * Server-side Logger
 * Implements the shared Logger interface with server-specific formatting.
 * Supports configurable log levels via LOG_LEVEL environment variable.
 */

import type { Logger, LogContext, LogLevel } from '~~/shared/types/logger'

interface LogEntry {
  level: LogLevel
  service: string
  message: string
  context?: LogContext
  timestamp: string
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function getMinLevel(): LogLevel {
  const env = process.env.LOG_LEVEL as LogLevel | undefined
  if (env && LOG_LEVELS[env] !== undefined) return env
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLevel()]
}

function formatEntry(entry: LogEntry): string {
  const { level, service, message, context, timestamp } = entry
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${service}]`

  if (context && Object.keys(context).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(context)}`
  }
  return `${prefix} ${message}`
}

function log(level: LogLevel, service: string, message: string, context?: LogContext, error?: unknown): void {
  if (!shouldLog(level)) return

  const entry: LogEntry = {
    level,
    service,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (error) {
    if (!entry.context) entry.context = {}
    entry.context.error = error instanceof Error ? error.message : String(error)
    if (error instanceof Error && error.stack) {
      entry.context.stack = error.stack
    }
  }

  const formatted = formatEntry(entry)

  switch (level) {
    case 'debug':
      console.debug(formatted)
      break
    case 'info':
      console.info(formatted)
      break
    case 'warn':
      console.warn(formatted)
      break
    case 'error':
      console.error(formatted)
      break
  }
}

/**
 * Creates a server-side logger instance for a specific service.
 * Implements the shared Logger interface.
 *
 * @param service - Name of the service or component using the logger
 * @returns Logger instance with debug, info, warn, error methods
 *
 * @example
 * ```ts
 * const logger = createLogger('JikanProxy')
 * logger.info('Request received', { path: '/anime/1' })
 * logger.error('API call failed', error, { endpoint: '/anime' })
 * ```
 */
export function createLogger(service: string): Logger {
  return {
    debug: (message: string, context?: LogContext) => log('debug', service, message, context),
    info: (message: string, context?: LogContext) => log('info', service, message, context),
    warn: (message: string, context?: LogContext) => log('warn', service, message, context),
    error: (message: string, error?: unknown, context?: LogContext) => log('error', service, message, context, error),
  }
}

/**
 * Pre-configured loggers for common server services.
 */
export const logger = {
  jikan: createLogger('Jikan'),
  api: createLogger('API'),
  auth: createLogger('Auth'),
}
