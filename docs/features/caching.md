# Caching System

VueNime implementa un sistema de cache multinivel para que la navegación se sienta instantánea sin sacrificar la frescura de los datos.

## Niveles de Cache

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CACHE LEVELS                                     │
│                                                                         │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐                 │
│  │   EDGE      │   │   CLIENT     │   │   PREFETCH   │                 │
│  │  (Vercel)   │   │   (Nuxt)     │   │   (Hover)    │                 │
│  ├─────────────┤   ├──────────────┤   ├──────────────┤                 │
│  │ 10min API   │   │ TTL-based    │   │ 400ms delay  │                 │
│  │ 1hr pages   │   │ in payload   │   │ deduplicated │                 │
│  └─────────────┘   └──────────────┘   └──────────────┘                 │
│                                                                         │
│  Request flow:  Client → Nuxt Cache → Edge Cache → Jikan API           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1. Edge Cache (Vercel)

Configurado en `nuxt.config.ts`:

```typescript
routeRules: {
  '/': { prerender: true },
  '/anime/**': {
    isr: 3600,  // Revalidate hourly
    headers: {
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  },
  '/api/jikan/**': {
    cache: { maxAge: 600, staleMaxAge: 3600 },
    headers: {
      'cache-control': 's-maxage=600, stale-while-revalidate',
    },
  },
}
```

**¿Qué significa cada regla?**

- **`/`**: Prerenderizado en build. La página home es estática.
- **`/anime/**`\*\*: ISR con revalidación cada hora. Perfecto para páginas de detalle.
- **`/api/jikan/**`\*\*: Cache de 10 minutos en edge. Requests populares no llegan a Jikan.

### 2. Client Cache (Nuxt Payload)

Nuxt tiene un sistema de payload cache que persiste datos entre navegaciones. Lo extendemos con TTL (time-to-live).

`app/utils/cache.ts`:

```typescript
// Store fetch timestamps by cache key
const cacheTimestamps = new Map<string, number>()

export function createCachedData<T>(ttlMs: number) {
  return (key: string, nuxtApp: NuxtApp): T | undefined => {
    const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (!cached) return undefined

    const fetchedAt = cacheTimestamps.get(key)

    // If no timestamp (SSR data), accept it and set timestamp now
    if (!fetchedAt) {
      cacheTimestamps.set(key, Date.now())
      return cached as T
    }

    // Check if cache has expired
    const age = Date.now() - fetchedAt
    if (age > ttlMs) {
      cacheTimestamps.delete(key)
      return undefined // Trigger new fetch
    }

    return cached as T
  }
}

export function markCacheFresh(key: string) {
  cacheTimestamps.set(key, Date.now())
}
```

**¿Cómo funciona?**

1. Cuando `useAsyncData` necesita datos, llama a `getCachedData`
2. Si hay datos cacheados Y no han expirado, los devuelve
3. Si no hay datos o expiraron, devuelve `undefined` → trigger fetch

### 3. Prefetch en Hover

Cuando el usuario pasa el cursor sobre una card de anime, empezamos a cargar los detalles en background.

`app/composables/useAnimeDetail.ts`:

```typescript
const prefetchCache = new Set<string>()
const pendingPrefetch = new Map<string, ReturnType<typeof setTimeout>>()
const PREFETCH_DELAY = 400 // ms to wait before prefetching

export const prefetchAnimeDetail = (id: string | number) => {
  const animeId = String(id)
  const cacheKey = CACHE_KEYS.animeDetail(animeId)

  // Skip if already prefetched
  if (prefetchCache.has(cacheKey)) return

  // Skip if already in payload cache
  const nuxtApp = useNuxtApp()
  if (nuxtApp.payload.data[cacheKey]) return

  // Skip if already pending
  if (pendingPrefetch.has(cacheKey)) return

  // Debounce: only prefetch after 400ms hover
  const timeoutId = setTimeout(async () => {
    pendingPrefetch.delete(cacheKey)

    // Re-check cache (might have been populated during delay)
    if (nuxtApp.payload.data[cacheKey] || nuxtApp.static.data[cacheKey]) {
      return
    }

    prefetchCache.add(cacheKey)

    try {
      const data = await fetchAnimeDetail(animeId)
      // Store in nuxt payload so useAsyncData picks it up
      nuxtApp.payload.data[cacheKey] = data
      markCacheFresh(cacheKey)
    } catch (error) {
      prefetchCache.delete(cacheKey)
      // Prefetch is best effort - just log in dev
    }
  }, PREFETCH_DELAY)

  pendingPrefetch.set(cacheKey, timeoutId)
}

export const cancelPrefetchAnimeDetail = (id: string | number) => {
  const cacheKey = CACHE_KEYS.animeDetail(id)
  const timeoutId = pendingPrefetch.get(cacheKey)
  if (timeoutId) {
    clearTimeout(timeoutId)
    pendingPrefetch.delete(cacheKey)
  }
}
```

**¿Por qué 400ms de delay?**

Si el usuario solo pasa el cursor de camino a otro lugar, no queremos hacer requests innecesarias. 400ms es suficiente para detectar intención real de hover.

### Deduplicación de Requests

Si el prefetch está en vuelo y el usuario hace click, no queremos hacer dos requests:

```typescript
const inFlightRequests = new Map<string, Promise<AnimeDetailResponse>>()

function fetchAnimeDetail(animeId: string): Promise<AnimeDetailResponse> {
  const cacheKey = CACHE_KEYS.animeDetail(animeId)

  // Return existing in-flight request if any
  const existing = inFlightRequests.get(cacheKey)
  if (existing) return existing

  // Create new request and track it
  const promise = $fetch<AnimeDetailResponse>(`/api/jikan/anime/${animeId}`).finally(() => {
    inFlightRequests.delete(cacheKey)
  })

  inFlightRequests.set(cacheKey, promise)
  return promise
}
```

Esto garantiza que **nunca hay dos requests en vuelo para el mismo recurso**.

## TTL por Tipo de Dato

`app/utils/cache.ts`:

```typescript
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 min - data that changes often
  MEDIUM: 10 * 60 * 1000, // 10 min - home page data
  LONG: 30 * 60 * 1000, // 30 min - characters, news
  VERY_LONG: 60 * 60 * 1000, // 1 hour - anime details (rarely change)
} as const
```

| Tipo de Dato    | TTL    | Razón                                  |
| --------------- | ------ | -------------------------------------- |
| Anime details   | 1 hora | Sinopsis, score, etc. rara vez cambian |
| Listas/búsqueda | 10 min | Pueden tener nuevos items              |
| Caracteres      | 30 min | Casi nunca cambian                     |

## Uso en Composables

`app/composables/useAnimeDetail.ts`:

```typescript
export const useAnimeDetail = (id: Ref<string> | string) => {
  const animeId = toRef(id)

  const { data, status, error, refresh } = useAsyncData<AnimeDetailResponse>(
    computed(() => CACHE_KEYS.animeDetail(animeId.value)),
    () => fetchAnimeDetail(animeId.value),
    {
      // Server: blocking fetch for SSR
      // Client: non-blocking, uses prefetch cache or shows skeleton
      lazy: import.meta.client,

      // Cache for 1 hour
      getCachedData: createCachedData(CACHE_TTL.VERY_LONG),
    }
  )

  const anime = computed<Anime | null>(() => data.value?.data ?? null)
  const isLoading = computed(() => status.value === 'pending')

  return { anime, isLoading, error, refresh }
}
```

**¿Por qué `lazy: import.meta.client`?**

- En **servidor**: Queremos datos para SSR (SEO), así que bloqueamos
- En **cliente**: No queremos bloquear la navegación, mostramos skeleton mientras carga

## Cache Keys

`app/utils/cache-keys.ts`:

```typescript
export const CACHE_KEYS = {
  // Static keys (data that doesn't vary by parameters)
  ANIME_GENRES: 'anime-genres',
  CURRENT_SEASON: 'current-season',
  UPCOMING_SEASON: 'upcoming-season',
  SCHEDULE_TODAY: 'schedule-today',
  ANIME_LIST_HOME: 'anime-list-home',

  // Dynamic keys (functions that generate keys with parameters)
  animeDetail: (id: string | number) => `anime-detail-${id}`,
  animeEpisodes: (id: string | number) => `anime-episodes-${id}`,
  animeCharacters: (id: string | number) => `anime-characters-${id}`,
  animeNews: (id: string | number) => `anime-news-${id}`,
  animeReviews: (id: string | number) => `anime-reviews-${id}`,
  animeRecommendations: (id: string | number) => `anime-recommendations-${id}`,
  animeStreaming: (id: string | number) => `anime-streaming-${id}`,
} as const
```

Keys consistentes evitan colisiones y facilitan invalidación. Los static keys son para datos globales, los dynamic keys son para recursos específicos por ID.

## Invalidación de Cache

```typescript
import { invalidateCache, clearAllCacheTimestamps } from '~/utils/cache'

// Invalidar un recurso específico
invalidateCache(CACHE_KEYS.animeDetail('1234'))

// Invalidar todo (ej: logout, refresh completo)
clearAllCacheTimestamps()
```

## Diagrama de Flujo: Navegación a Detalle

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION TO ANIME DETAIL                             │
│                                                                           │
│  1. User hovers card                                                      │
│     └── Start 400ms timer                                                 │
│                                                                           │
│  2. After 400ms (still hovering)                                          │
│     └── prefetchAnimeDetail(id)                                          │
│         ├── Check prefetchCache → already done? Skip                     │
│         ├── Check payload.data → already cached? Skip                    │
│         └── Fetch in background → Store in payload.data                  │
│                                                                           │
│  3. User clicks card                                                      │
│     └── Navigate to /anime/:id                                           │
│                                                                           │
│  4. Page loads                                                            │
│     └── useAnimeDetail(id)                                               │
│         ├── getCachedData → Found in payload? Return immediately ✓       │
│         └── No cache? Show skeleton, fetch data                          │
│                                                                           │
│  Result: Instant navigation if user hovered for 400ms+                   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Implementación en Componentes

`app/components/anime/AnimeCard.vue`:

```vue
<script setup lang="ts">
const props = defineProps<{ anime: Anime }>()

// Prefetch handlers
const handleMouseEnter = () => {
  prefetchAnimeDetail(props.anime.mal_id)
}

const handleMouseLeave = () => {
  cancelPrefetchAnimeDetail(props.anime.mal_id)
}
</script>

<template>
  <NuxtLink
    :to="`/anime/${anime.mal_id}`"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Card content -->
  </NuxtLink>
</template>
```

## Debugging

En desarrollo, puedes inspeccionar el cache:

```javascript
// En consola del navegador
const nuxtApp = useNuxtApp()

// Ver todos los datos cacheados
console.log(nuxtApp.payload.data)

// Ver datos estáticos (de SSR)
console.log(nuxtApp.static.data)
```

## Métricas de Performance

Con este sistema de cache:

- **First Load**: SSR provee HTML con datos (good for SEO)
- **Navigation**: ~50ms si prefetch funcionó, ~200-500ms sin prefetch
- **Repeat Visit**: Cache del navegador + edge = casi instantáneo

## Trade-offs

### Datos potencialmente stale

Con 1 hora de TTL para detalles, un cambio en MyAnimeList puede tardar hasta 1 hora en reflejarse.

**Mitigación**: El usuario puede forzar refresh con Ctrl+Shift+R.

### Memoria del cliente

El payload cache crece con cada página visitada.

**Mitigación**: El navegador limpia eventualmente, y Nuxt no persiste entre sesiones. En uso normal no es problema.

### Complejidad

Múltiples niveles de cache = más lugares donde pueden haber bugs.

**Mitigación**: Tests exhaustivos, logging en desarrollo, y el cache es best-effort (si falla, simplemente hace fetch).

## Archivos Relacionados

| Archivo                             | Propósito                         |
| ----------------------------------- | --------------------------------- |
| `app/utils/cache.ts`                | Utilidades de cache con TTL       |
| `app/utils/cache-keys.ts`           | Generadores de cache keys         |
| `app/composables/useAnimeDetail.ts` | Fetch + prefetch de detalles      |
| `nuxt.config.ts`                    | Configuración de ISR y edge cache |
