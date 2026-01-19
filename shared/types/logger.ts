/**
 * Shared logger interface for client and server implementations.
 * Both loggers implement this contract while maintaining environment-specific behavior.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export interface Logger {
  debug: (message: string, context?: LogContext) => void
  info: (message: string, context?: LogContext) => void
  warn: (message: string, context?: LogContext) => void
  error: (message: string, error?: unknown, context?: LogContext) => void
}
