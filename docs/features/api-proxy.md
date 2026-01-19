# API Proxy

VueNime no hace llamadas directas a la API de Jikan desde el navegador. Todo el tráfico pasa por un proxy en el servidor que implementa rate limiting, validación, y deduplicación.

## ¿Por qué un Proxy?

### 1. Rate Limiting Controlado

Jikan tiene límites estrictos:

- 3 requests por segundo
- 60 requests por minuto

Si hacemos llamadas directas desde el navegador, cada usuario consume su propio límite... pero también pueden abusar y causar que Jikan nos banee la IP del servidor.

Con el proxy, controlamos centralmente cuántas requests hacemos.

### 2. Deduplicación de Datos

Jikan a veces devuelve anime duplicados en las listas. El proxy filtra estos duplicados antes de enviar la respuesta al cliente.

### 3. Seguridad

El proxy implementa una whitelist de endpoints. Solo permitimos las rutas que realmente usamos, lo que previene que alguien abuse del proxy para hacer requests arbitrarias.

### 4. Cache en Edge

Cuando deployamos en Vercel, las respuestas del proxy se cachean en edge. Esto significa que requests repetidas ni siquiera llegan a Jikan.

## Implementación

### Archivo Principal

`server/api/jikan/[...path].ts`

Este catch-all route maneja cualquier path bajo `/api/jikan/`:

```
/api/jikan/anime/1234        →  https://api.jikan.moe/v4/anime/1234
/api/jikan/top/anime         →  https://api.jikan.moe/v4/top/anime
/api/jikan/seasons/2024/fall →  https://api.jikan.moe/v4/seasons/2024/fall
```

### Rate Limiter

```typescript
const RATE_LIMIT = {
  MAX_PER_MINUTE: 25, // Keep under Jikan's 30 for safety margin
  MAX_PER_SECOND: 2,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
}

const requestQueue: number[] = []
const ONE_MINUTE_MS = 60 * 1000

const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now()

  // Remove requests older than 1 minute
  while (requestQueue.length && now - requestQueue[0]! > ONE_MINUTE_MS) {
    requestQueue.shift()
  }

  // If we've hit the per-minute limit, wait
  if (requestQueue.length >= RATE_LIMIT.MAX_PER_MINUTE) {
    const waitTime = ONE_MINUTE_MS - (now - requestQueue[0]!)
    await new Promise((resolve) => setTimeout(resolve, waitTime))
    return waitForRateLimit() // Recursive check
  }

  // If 2+ requests in the last second, wait 500ms
  const recentRequests = requestQueue.filter((time) => now - time < RATE_LIMIT.RETRY_DELAY)
  if (recentRequests.length >= RATE_LIMIT.MAX_PER_SECOND) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT.RETRY_DELAY))
    return waitForRateLimit()
  }

  requestQueue.push(Date.now())
}
```

**¿Por qué 25/minuto en vez de 30?** Margen de seguridad. Si estamos cerca del límite y hay un pico de tráfico, no queremos que Jikan nos bloquee.

### Whitelist de Endpoints

Solo permitimos endpoints que realmente usamos:

```typescript
const ALLOWED_ENDPOINTS = [
  'anime', // /anime/:id
  'top/anime', // Rankings
  'seasons', // By season
  'schedules', // Weekly schedule
  'genres/anime', // Genre list
  'random/anime', // Random anime
]

function isAllowedEndpoint(path: string): boolean {
  const normalized = path.replace(/^\/+/, '')
  return ALLOWED_ENDPOINTS.some(
    (ep) => normalized === ep || normalized.startsWith(`${ep}/`) || normalized.match(/^anime\/\d+/) // Allow /anime/:id
  )
}
```

Si alguien intenta acceder a `/api/jikan/users/...` o cualquier otro endpoint, recibe un 403.

### Validación con Zod

El path se valida antes de hacer nada:

```typescript
const validation = jikanPathSchema.safeParse(path)
if (!validation.success) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid API path',
  })
}
```

El schema es simple pero efectivo:

```typescript
// shared/schemas/jikan.ts
export const jikanPathSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[\w\/-]+$/) // Only alphanumeric, dashes, slashes
```

### Deduplicación

Jikan a veces devuelve el mismo anime múltiples veces en una lista. Lo filtramos:

```typescript
function deduplicateAnimeData<T extends { data?: Array<{ mal_id: number }> }>(response: T): T {
  if (!response.data || !Array.isArray(response.data)) {
    return response
  }

  const seen = new Set<number>()
  const uniqueData = response.data.filter((item) => {
    if (seen.has(item.mal_id)) {
      return false
    }
    seen.add(item.mal_id)
    return true
  })

  return { ...response, data: uniqueData }
}
```

### Manejo de Errores

El proxy traduce errores de Jikan a mensajes amigables:

```typescript
try {
  const response = await $fetch(url, {
    retry: RATE_LIMIT.MAX_RETRIES,
    retryDelay: RATE_LIMIT.RETRY_DELAY,
    timeout: 10000,
  })
  return deduplicateAnimeData(response)
} catch (error) {
  if (error.response?.status === 429) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Rate limited - please wait a moment and try again',
    })
  }

  if (error.response?.status >= 502 && error.response?.status <= 504) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Anime database temporarily unavailable - please try again later',
    })
  }

  if (error.response?.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Anime not found',
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to fetch from anime API',
  })
}
```

**Errores que manejamos:**

- `429`: Jikan nos rate limitó (raro con nuestros límites)
- `502/503/504`: MyAnimeList está caído o Jikan está sobrecargado
- `404`: El anime no existe
- Otros: Error genérico

## Configuración de Cache (Vercel)

En `nuxt.config.ts`:

```typescript
routeRules: {
  '/api/jikan/**': {
    cache: { maxAge: 600, staleMaxAge: 3600 },
    headers: {
      'cache-control': 's-maxage=600, stale-while-revalidate',
    },
  },
}
```

Esto significa:

- **600 segundos (10 min)**: Respuesta fresca en cache
- **3600 segundos (1 hora)**: Puede servir stale mientras revalida

En la práctica, requests populares (top anime, temporada actual) casi nunca llegan a Jikan porque están cacheadas.

## Diagrama de Flujo

```
┌────────────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW                                   │
│                                                                        │
│  Client                                                                │
│    │                                                                   │
│    ▼                                                                   │
│  /api/jikan/anime/1234                                                │
│    │                                                                   │
│    ▼                                                                   │
│  ┌─────────────────┐                                                   │
│  │ Vercel Edge     │ ──── Cache HIT? ──▶ Return cached response       │
│  │ Cache           │                                                   │
│  └────────┬────────┘                                                   │
│           │ Cache MISS                                                 │
│           ▼                                                            │
│  ┌─────────────────┐                                                   │
│  │ Validate Path   │ ──── Invalid? ──▶ 400 Bad Request                │
│  │ (Zod)           │                                                   │
│  └────────┬────────┘                                                   │
│           │ Valid                                                      │
│           ▼                                                            │
│  ┌─────────────────┐                                                   │
│  │ Check Whitelist │ ──── Not allowed? ──▶ 403 Forbidden              │
│  └────────┬────────┘                                                   │
│           │ Allowed                                                    │
│           ▼                                                            │
│  ┌─────────────────┐                                                   │
│  │ Rate Limiter    │ ──── Over limit? ──▶ Wait...                     │
│  └────────┬────────┘                                                   │
│           │ Under limit                                                │
│           ▼                                                            │
│  ┌─────────────────┐                                                   │
│  │ Fetch from      │                                                   │
│  │ Jikan API       │                                                   │
│  └────────┬────────┘                                                   │
│           │                                                            │
│           ▼                                                            │
│  ┌─────────────────┐                                                   │
│  │ Deduplicate     │                                                   │
│  │ Response        │                                                   │
│  └────────┬────────┘                                                   │
│           │                                                            │
│           ▼                                                            │
│  Return to client + Store in edge cache                                │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Constantes

`shared/constants/api.ts`:

```typescript
export const RATE_LIMIT = {
  MAX_PER_MINUTE: 25,
  MAX_PER_SECOND: 2,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
} as const

export const CACHE_TTL = {
  ANIME_LIST: 600, // 10 minutes
  ANIME_DETAIL: 3600, // 1 hour
  SEARCH_RESULTS: 300, // 5 minutes
} as const
```

## Logging

El proxy logea eventos importantes:

```typescript
import { logger } from '~/server/utils/logger'

// Warning: something unusual but not fatal
logger.jikan.warn('Rate limited by Jikan API', { path })

// Error: something failed
logger.jikan.error('Request failed', error, { path })

// Info: normal operation worth noting
logger.jikan.info('Resource not found', { path })
```

Los logs ayudan a debuggear en producción y a detectar patrones de abuso.

## Testing

```typescript
describe('Jikan Proxy', () => {
  it('rejects disallowed endpoints', async () => {
    const response = await $fetch('/api/jikan/users/test', {
      ignoreResponseError: true,
    })
    expect(response.statusCode).toBe(403)
  })

  it('validates path format', async () => {
    const response = await $fetch('/api/jikan/../../../etc/passwd', {
      ignoreResponseError: true,
    })
    expect(response.statusCode).toBe(400)
  })

  it('deduplicates anime in response', async () => {
    // Mock Jikan to return duplicates
    const response = await handler(mockEvent)
    const ids = response.data.map((a) => a.mal_id)
    const uniqueIds = [...new Set(ids)]
    expect(ids.length).toBe(uniqueIds.length)
  })
})
```

## Posibles Mejoras

1. **Request coalescing**: Si 10 usuarios piden el mismo endpoint al mismo tiempo, hacer solo 1 request a Jikan
2. **Warming cache**: Pre-calentar el cache con datos populares al deployar
3. **Fallback to stale**: Si Jikan está caído, servir datos viejos en vez de error
4. **Usage analytics**: Trackear qué endpoints se usan más para optimizar

## Archivos Relacionados

| Archivo                         | Propósito                           |
| ------------------------------- | ----------------------------------- |
| `server/api/jikan/[...path].ts` | Handler principal del proxy         |
| `shared/constants/api.ts`       | Constantes de rate limiting y cache |
| `shared/schemas/jikan.ts`       | Validación de paths                 |
| `server/utils/logger.ts`        | Utilidades de logging               |
