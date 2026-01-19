# Architecture

Este documento explica cómo está organizado VueNime, las decisiones técnicas detrás del diseño, y las convenciones que seguimos.

## Stack Tecnológico

| Capa           | Tecnología                             | Por qué                                            |
| -------------- | -------------------------------------- | -------------------------------------------------- |
| **Framework**  | Nuxt 4                                 | SSR + ISR para SEO y performance                   |
| **UI**         | Vue 3 + Composition API                | Reactividad elegante, `<script setup>`             |
| **Styling**    | Tailwind CSS via Nuxt UI               | Utility-first, componentes prehechos               |
| **Estado**     | Pinia                                  | Simple, TypeScript-first, persiste en localStorage |
| **Backend**    | Supabase                               | Auth + PostgreSQL sin servidor propio              |
| **Validación** | Zod                                    | Schemas type-safe compartidos cliente/servidor     |
| **i18n**       | @nuxtjs/i18n                           | Traducción con lazy loading                        |
| **Testing**    | Vitest + @nuxt/test-utils + Playwright | Unit rápido + E2E completo                         |

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐               │
│  │   Pages    │  │   Stores   │  │ Composables │               │
│  │ (Vue SFC)  │  │  (Pinia)   │  │   (use*)    │               │
│  └─────┬──────┘  └─────┬──────┘  └──────┬──────┘               │
│        │               │                │                       │
│        └───────────────┼────────────────┘                       │
│                        ▼                                        │
│              ┌─────────────────┐                                │
│              │   API Service   │                                │
│              │ (app/services)  │                                │
│              └────────┬────────┘                                │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────────┐
│                       NUXT SERVER                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                  /api/jikan/[...path]                     │    │
│  │                                                           │    │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │Validation│─▶│ Rate Limiter │─▶│ Deduplication│        │    │
│  │  │  (Zod)   │  │(25/min, 2/s) │  │   (mal_id)   │        │    │
│  │  └──────────┘  └──────────────┘  └───────┬──────┘        │    │
│  └──────────────────────────────────────────┼───────────────┘    │
└─────────────────────────────────────────────┼─────────────────────┘
                                              │
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                           ▼
               ┌───────────────┐                           ┌───────────────┐
               │   Jikan API   │                           │   Supabase    │
               │  (MAL data)   │                           │  - Auth       │
               │               │                           │  - PostgreSQL │
               └───────────────┘                           └───────────────┘
```

## Decisiones Técnicas y Por Qué

### 1. Proxy para la API de Jikan

**Problema**: Jikan tiene rate limiting estricto (3 req/seg, 60 req/min) y puede devolver duplicados.

**Solución**: Todo el tráfico pasa por `/api/jikan/[...path].ts` que:

- Implementa rate limiting más conservador (25/min, 2/seg)
- Deduplica anime con el mismo `mal_id`
- Whitelist de endpoints permitidos (seguridad)
- Cachea respuestas en edge

```
server/api/jikan/[...path].ts
```

Para más detalles: [API Proxy Deep Dive](./features/api-proxy.md)

### 2. Almacenamiento Dual (localStorage + Supabase)

**Problema**: Queremos que usuarios puedan usar la app sin cuenta, pero también sincronizar entre dispositivos.

**Solución**: Sistema dual:

- **localStorage**: Siempre disponible, funciona para guardar datos localmente
- **Supabase**: Cuando hay sesión, sincroniza automáticamente

Al hacer login, los favoritos locales se suben y se combinan con los remotos. El usuario no pierde nada.

```
app/stores/favorites.ts
app/plugins/sync-stores.client.ts
```

Para más detalles: [Favorites Sync Deep Dive](./features/favorites-sync.md)

### 3. Validación con Zod Flexible

**Problema**: Jikan es una API externa que puede cambiar. Si hacemos validación estricta, la app puede romperse por un campo nuevo.

**Solución**: Schemas Zod en modo `.passthrough()` que aceptan campos extra, y usamos safe parse con defaults para datos opcionales.

```typescript
// En lugar de crashear si falta un campo, usamos defaults
const score = data.score ?? null
const genres = data.genres ?? []
```

### 4. ISR (Incremental Static Regeneration)

**Problema**: Queremos SEO (necesita SSR) pero también performance (queremos cache).

**Solución**: ISR permite lo mejor de ambos mundos:

- `/` — Prerenderizado en build
- `/anime/**` — ISR con revalidación cada hora
- `/api/jikan/**` — Cache edge de 10 minutos

```typescript
// nuxt.config.ts
routeRules: {
  '/': { prerender: true },
  '/anime/**': { isr: 3600 },
  '/api/jikan/**': { cache: { maxAge: 600 } },
}
```

### 5. Prefetch en Hover

**Problema**: La navegación entre páginas puede sentirse lenta aunque los datos carguen rápido.

**Solución**: Cuando el usuario pasa el cursor sobre una card, empezamos a cargar los detalles en background. Si hace click, los datos ya están listos.

- Debounce de 400ms (evita cargas innecesarias)
- Deduplicación de requests en vuelo
- Cancelación automática al salir del hover

Para más detalles: [Caching Deep Dive](./features/caching.md)

## Estructura de Carpetas

```
vuenime/
├── app/                        # Código de la aplicación Nuxt
│   ├── components/             # Componentes Vue
│   │   ├── anime/              # Cards, detalles, player
│   │   ├── auth/               # Login, registro
│   │   ├── favorites/          # Lista de favoritos
│   │   ├── home/               # Secciones del home
│   │   ├── layout/             # Header, footer, nav
│   │   └── ui/                 # Componentes genéricos reutilizables
│   │
│   ├── composables/            # Funciones de composición
│   │   ├── useAnimeDetail.ts   # Fetch + cache de detalles
│   │   ├── useCard3DTilt.ts    # Efecto 3D en cards
│   │   ├── useScrollReveal.ts  # Animaciones de scroll
│   │   └── ...
│   │
│   ├── pages/                  # Rutas (file-based routing)
│   │   ├── index.vue           # Home
│   │   ├── anime/[id].vue      # Detalles de anime
│   │   ├── search.vue          # Búsqueda
│   │   └── ...
│   │
│   ├── stores/                 # Pinia stores
│   │   ├── favorites.ts        # Favoritos con sync
│   │   ├── watched.ts          # Historial de vistos
│   │   └── preferences.ts      # Preferencias de usuario
│   │
│   ├── services/               # Lógica de negocio
│   │   ├── api/anime.ts        # Cliente API centralizado
│   │   └── supabase/           # Operaciones de DB
│   │
│   ├── middleware/             # Route guards
│   ├── plugins/                # Plugins de Nuxt
│   └── utils/                  # Utilidades
│
├── server/                     # Código del servidor Nitro
│   ├── api/
│   │   └── jikan/[...path].ts  # Proxy de Jikan
│   └── utils/                  # Utils del servidor
│
├── shared/                     # Código compartido cliente/servidor
│   ├── types/                  # TypeScript types
│   │   ├── anime.ts            # Tipos de Jikan
│   │   └── database.ts         # Tipos de Supabase
│   ├── schemas/                # Zod schemas
│   └── constants/              # Constantes compartidas
│
├── i18n/                       # Traducciones
│   └── locales/
│       ├── en.json
│       ├── es.json
│       └── ja.json
│
├── test/                       # Tests
│   ├── unit/                   # Vitest
│   └── e2e/                    # Playwright
│
└── docs/                       # Documentación
```

## Convenciones de Código

### Componentes

- **Ubicación**: Por dominio, no por tipo. `components/anime/` no `components/cards/`
- **Naming**: PascalCase, prefijo del dominio para componentes específicos

```
AnimeCard.vue       ✓ Componente de dominio
AnimeDetailTabs.vue ✓ Componente de dominio específico
Button.vue          ✓ Componente UI genérico
```

### Composables

- **Prefijo**: Siempre `use`
- **Ubicación**: `app/composables/`
- **Naming**: Describe qué maneja, no cómo

```typescript
// ✓ Bueno - describe qué maneja
useAnimeDetail()
useFavorites()
useScrollReveal()

// ✗ Malo - demasiado genérico o técnico
useData()
useObserver()
```

### Stores (Pinia)

- **Estilo**: Setup stores (composition API)
- **Persistencia**: Configura en options, no manualmente

```typescript
export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    // Setup store con composition API
    const favorites = ref<FavoriteAnime[]>([])
    // ...
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['favorites'], // Solo persiste lo necesario
    },
  }
)
```

### Tipos TypeScript

- **Ubicación compartida**: `shared/types/` para tipos usados en cliente y servidor
- **Imports**: Usa `~~/shared/types` (alias de Nuxt)

```typescript
import type { Anime, AnimeListResponse } from '~~/shared/types'
```

### Validación con Zod

- **Schemas compartidos**: `shared/schemas/`
- **Safe parse**: Siempre `.safeParse()` para datos externos

```typescript
const result = animeSchema.safeParse(data)
if (!result.success) {
  // Manejar error
}
```

### CSS / Tailwind

- **Utility-first**: Preferir clases de Tailwind sobre CSS custom
- **Componentes Nuxt UI**: Usar siempre que sea posible
- **Custom CSS**: Solo cuando Tailwind no puede (ej: animaciones complejas)

```vue
<!-- ✓ Bueno - Tailwind utilities -->
<div class="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">

<!-- ✗ Evitar - CSS custom innecesario -->
<style>
.my-card { display: flex; align-items: center; }
</style>
```

### i18n

- **Keys**: En inglés, snake_case, jerárquicas

```json
{
  "anime": {
    "details": {
      "episodes": "Episodes",
      "score": "Score"
    }
  }
}
```

- **Uso**: Composable `useI18n()` o componente `<i18n-t>`

```vue
<script setup>
const { t } = useI18n()
</script>

<template>
  <span>{{ t('anime.details.episodes') }}</span>
</template>
```

## Testing

### Unit Tests (Vitest + @nuxt/test-utils)

- Ubicación: `test/unit/`
- Para: Utils, composables, lógica pura

```bash
bun run test:unit
```

### Integration Tests (Vitest + @nuxt/test-utils)

- Ubicación: `test/nuxt/`
- Para: Componentes con contexto Nuxt

```bash
bun run test
```

### E2E Tests (Playwright)

- Ubicación: `test/e2e/`
- Para: Flujos de usuario completos

```bash
bun run test:e2e
```

## Performance Considerations

1. **Code Splitting**: Vite separa vendors automáticamente (Vue, Supabase, i18n, etc.)
2. **Lazy Components**: Usa `<LazyComponent>` para componentes pesados
3. **Image Optimization**: Imágenes de MAL van directo desde CDN (no proxy)
4. **Bundle Analysis**: `bun run build && bun run analyze`

## Seguridad

1. **Input Validation**: Todo input externo se valida con Zod
2. **RLS**: Supabase tiene Row Level Security en todas las tablas
3. **CSP**: Content Security Policy configurada en `nuxt.config.ts`
4. **Secrets**: Solo `SUPABASE_KEY` (anon) en cliente, `service_role` solo en server

## Recursos Adicionales

- [Nuxt 4 Docs](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Jikan API Docs](https://docs.api.jikan.moe/)
