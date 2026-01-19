type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

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

function log(level: LogLevel, service: string, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return

  const entry: LogEntry = {
    level,
    service,
    message,
    context,
    timestamp: new Date().toISOString(),
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

export function createLogger(service: string) {
  return {
    debug: (message: string, context?: LogContext) => log('debug', service, message, context),
    info: (message: string, context?: LogContext) => log('info', service, message, context),
    warn: (message: string, context?: LogContext) => log('warn', service, message, context),
    error: (message: string, context?: LogContext) => log('error', service, message, context),
  }
}

// Pre-configured loggers for common services
export const logger = {
  jikan: createLogger('Jikan'),
  api: createLogger('API'),
  auth: createLogger('Auth'),
}
