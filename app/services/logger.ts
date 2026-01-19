/**
 * Logger Service
 * Abstraction layer for logging to allow easy integration with external services
 * (Sentry, Datadog, etc.) in the future without changing application code.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: Error | unknown
  timestamp: string
}

class LoggerService {
  private isProduction = process.env.NODE_ENV === 'production'

  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): LogEntry {
    return {
      level,
      message,
      context,
      error,
      timestamp: new Date().toISOString(),
    }
  }

  private log(entry: LogEntry) {
    // In production, this is where we would send logs to Sentry/Datadog
    // if (this.isProduction) {
    //   sendToExternalService(entry)
    // }

    // Always log to console in development, or if it's an error
    if (!this.isProduction || entry.level === 'error') {
      const styles = {
        info: 'color: #3b82f6', // blue
        warn: 'color: #f59e0b', // amber
        error: 'color: #ef4444', // red
        debug: 'color: #a8a29e', // gray
      }

      if (import.meta.client) {
        // Browser console styling
        const style = styles[entry.level]
        console.groupCollapsed(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style)
        if (entry.context) console.log('Context:', entry.context)
        if (entry.error) console.error(entry.error)
        console.log('Time:', entry.timestamp)
        console.groupEnd()
      } else {
        // Server console (Supabase functions / SSR)
        const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`
        if (entry.level === 'error') {
          console.error(prefix, entry.message, entry.error, entry.context)
        } else {
          console.log(prefix, entry.message, entry.context || '')
        }
      }
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(this.formatEntry('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(this.formatEntry('warn', message, context))
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log(this.formatEntry('error', message, context, error))
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (!this.isProduction) {
      this.log(this.formatEntry('debug', message, context))
    }
  }
}

export const logger = new LoggerService()
