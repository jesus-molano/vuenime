# Favorites Sync System

Este documento explica cómo VueNime sincroniza favoritos entre localStorage y Supabase, permitiendo usar la app sin cuenta mientras ofrece sincronización cuando el usuario decide registrarse.

## El Problema

Queríamos resolver dos necesidades que normalmente son contradictorias:

1. **Uso sin fricción**: Que cualquiera pueda guardar favoritos sin crear cuenta
2. **Sincronización**: Que los datos estén disponibles en todos los dispositivos

La mayoría de apps te obligan a crear cuenta antes de guardar cualquier cosa. Nosotros no.

## La Solución: Almacenamiento Dual

```
┌─────────────────────────────────────────────────────────┐
│                     GUEST MODE                          │
│                                                         │
│   User Action ──▶ Pinia Store ──▶ localStorage ✓       │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 AUTHENTICATED MODE                      │
│                                                         │
│   User Action ──▶ Pinia Store ──┬──▶ localStorage ✓    │
│                                 │                       │
│                                 └──▶ Supabase ✓        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

En modo guest, los favoritos solo se guardan en localStorage. Cuando el usuario inicia sesión, se sincronizan con Supabase y a partir de ahí cualquier cambio va a ambos sitios.

## Flujo de Sincronización al Login

Este es el momento más delicado. El usuario puede tener favoritos locales que guardó sin cuenta, y también puede tener favoritos en Supabase de una sesión anterior en otro dispositivo.

```
┌───────────────────────────────────────────────────────────────────┐
│                         LOGIN FLOW                                │
│                                                                   │
│  1. Fetch remote favorites                                        │
│     └──▶ Supabase: [A, B, C]                                     │
│                                                                   │
│  2. Compare with local                                            │
│     └──▶ localStorage: [B, D, E]                                 │
│                                                                   │
│  3. Find local-only items                                         │
│     └──▶ [D, E] (not in remote)                                  │
│                                                                   │
│  4. Upload local-only to Supabase                                │
│     └──▶ INSERT [D, E]                                           │
│                                                                   │
│  5. Merge: remote + local-only                                    │
│     └──▶ Final: [A, B, C, D, E]                                  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**¿Por qué remote es "source of truth"?** Si un anime existe en ambos lados, usamos la versión remota porque puede tener metadata más reciente (fecha de adición original, etc.).

## Implementación

### Store: `app/stores/favorites.ts`

El store maneja todo el estado de favoritos:

```typescript
export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<FavoriteAnime[]>([])
    const hasSynced = ref(false)
    const syncedForUserId = ref<string | null>(null)
    const isSyncing = ref(false)

    // ... actions
  },
  {
    persist: {
      storage: persistedState.localStorage,
      pick: ['favorites', 'hasSynced', 'syncedForUserId'],
    },
  }
)
```

**¿Por qué persistimos `hasSynced` y `syncedForUserId`?** Para saber en la próxima visita si ya sincronizamos y para qué usuario. Si el usuario vuelve logueado, no hacemos sync innecesario.

### Sync Function

```typescript
async function syncWithSupabase(userId: string) {
  if (isSyncing.value) return // Prevent concurrent syncs

  isSyncing.value = true
  isLoading.value = true

  try {
    // 1. Single API call - fetch all remote data
    const remoteData = await fetchUserFavorites(supabase, userId)
    const remoteIds = new Set(remoteData.map((f) => f.mal_id))

    // 2. Find local items that don't exist remotely
    const localOnly = favorites.value.filter((f) => !remoteIds.has(f.mal_id))

    // 3. Upload local-only items (batch insert)
    if (localOnly.length > 0) {
      await insertManyFavorites(supabase, userId, localOnly)
    }

    // 4. Merge: remote + local-only
    favorites.value = [...remoteData, ...localOnly]

    hasSynced.value = true
    syncedForUserId.value = userId
  } finally {
    isLoading.value = false
    isSyncing.value = false
  }
}
```

### Optimistic Updates

Cuando el usuario añade o quita un favorito, actualizamos la UI inmediatamente y luego sincronizamos con el servidor. Si falla, hacemos rollback.

```typescript
async function addFavorite(anime: AddFavoriteInput) {
  // Validate input with Zod schema
  const validation = addFavoriteInputSchema.safeParse(anime)
  if (!validation.success) {
    logger.error('[FavoritesStore] Invalid addFavorite input', validation.error.flatten())
    notify.favoriteError()
    return
  }

  if (isFavorite(anime.mal_id)) return

  // Create favorite object with all required fields
  const favorite: FavoriteAnime = {
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    images: anime.images,
    score: anime.score,
    year: anime.year,
    episodes: anime.episodes,
    genres: anime.genres,
    airing: anime.airing,
    addedAt: Date.now(),
  }

  // Optimistic update - UI updates immediately
  favorites.value.push(favorite)

  // Sync to Supabase if authenticated
  if (syncedForUserId.value) {
    const { success, error } = await insertFavorite(supabase, syncedForUserId.value, favorite)

    if (!success) {
      // Rollback on error
      const index = favorites.value.findIndex((f) => f.mal_id === anime.mal_id)
      if (index !== -1) favorites.value.splice(index, 1)

      const friendlyError = getFriendlyError(error, 'addFavorite')
      notify.error(friendlyError.message)
      return
    }
  }

  notify.favoriteAdded(anime.title)
}
```

La experiencia para el usuario es instantánea. El corazón se llena inmediatamente, y si hay error de red (raro), se vacía de nuevo con un mensaje explicativo.

### Plugin de Inicialización

`app/plugins/sync-stores.client.ts` maneja los eventos de autenticación:

```typescript
/**
 * IMPORTANT: This plugin is SYNCHRONOUS to avoid blocking hydration.
 * All async operations are deferred to app:mounted hook.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Plugin is synchronous - does not block hydration

  nuxtApp.hook('app:mounted', async () => {
    const supabase = useSupabaseClient<Database>()
    const favoritesStore = useFavoritesStore()
    const watchedStore = useWatchedStore()
    const preferencesStore = usePreferencesStore()

    // Validate session AFTER hydration - clears invalid tokens
    try {
      await supabase.auth.getSession()
    } catch {
      // Invalid refresh token - sign out to clear corrupted session data
      await supabase.auth.signOut({ scope: 'local' })
    }

    let currentUserId: string | null = null
    let initialized = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userId = session?.user?.id ?? null

      if (event === 'INITIAL_SESSION' && !initialized) {
        // First load - initialize stores (uses cache if available)
        currentUserId = userId
        initialized = true
        await Promise.all([favoritesStore.initialize(userId), watchedStore.initialize(userId)])
      } else if (event === 'SIGNED_IN' && userId && currentUserId !== userId) {
        // New sign in - sync local guest data to user account
        currentUserId = userId
        if (initialized) {
          await Promise.all([favoritesStore.handleSignIn(userId), watchedStore.handleSignIn(userId)])
        }
      } else if (event === 'SIGNED_OUT') {
        // Sign out - clear user data
        currentUserId = null
        favoritesStore.handleSignOut()
        watchedStore.handleSignOut()
      }
    })

    // Cleanup auth subscription on page unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
      subscription.unsubscribe()
    })
  })
})
```

**¿Por qué es síncrono con `app:mounted`?**

Un plugin async bloquea la hidratación de Nuxt. Al usar `app:mounted`, el plugin se registra inmediatamente pero las operaciones async se ejecutan después de que la app esté hidratada. Esto mejora el FCP (First Contentful Paint).

**Eventos que manejamos:**

- `INITIAL_SESSION`: Primera carga de la app
- `SIGNED_IN`: Usuario acaba de hacer login
- `SIGNED_OUT`: Usuario cerró sesión

**Stores que sincroniza:**

- `favoritesStore`: Anime favoritos
- `watchedStore`: Anime vistos/historial
- `preferencesStore`: Locale del usuario (i18n)

### Servicio de Supabase

`app/services/supabase/favorites.ts` contiene las operaciones de base de datos:

```typescript
export async function fetchUserFavorites(supabase: SupabaseClient, userId: string): Promise<FavoriteAnime[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function insertManyFavorites(
  supabase: SupabaseClient,
  userId: string,
  favorites: FavoriteAnime[]
): Promise<void> {
  const { error } = await supabase.from('favorites').upsert(
    favorites.map((f) => ({
      user_id: userId,
      mal_id: f.mal_id,
      // ... other fields
    })),
    { onConflict: 'user_id,mal_id' }
  )

  if (error) throw error
}
```

## Manejo de Errores

Los errores de Supabase se transforman en mensajes amigables:

```typescript
const friendlyError = getFriendlyError(error, 'addFavorite')
notify.error(friendlyError.message)
```

Errores comunes:

- **Network error**: "No pudimos guardar tu favorito. Revisa tu conexión."
- **Auth expired**: "Tu sesión expiró. Por favor, inicia sesión de nuevo."
- **Rate limited**: "Demasiadas solicitudes. Espera un momento."

## Edge Cases

### Usuario con datos corruptos en localStorage

Si el schema de favoritos cambia entre versiones, Zod valida los inputs antes de añadirlos al store. Datos existentes inválidos se manejan por la persistencia de Pinia que usa `pinia-plugin-persistedstate`:

```typescript
// La validación ocurre en addFavorite, no al cargar
const validation = addFavoriteInputSchema.safeParse(anime)
if (!validation.success) {
  logger.error('[FavoritesStore] Invalid addFavorite input', validation.error.flatten())
  notify.favoriteError()
  return
}
```

**Nota**: Los datos ya guardados en localStorage se cargan directamente. Si hay problemas de compatibilidad entre versiones, el usuario puede limpiar el localStorage o los datos corruptos simplemente no se mostrarán correctamente.

### Usuario cambia de cuenta

Si un usuario cierra sesión y entra con otra cuenta:

```typescript
if (syncedForUserId.value && syncedForUserId.value !== userId) {
  // Clear data from previous user
  favorites.value = []
}
await syncWithSupabase(userId)
```

### Conflictos de merge

¿Qué pasa si el mismo anime está en local y remote con datos diferentes?

**Estrategia actual**: Remote gana. Es la fuente de verdad porque puede tener datos de múltiples dispositivos.

**Trade-off**: Si el usuario editó algo localmente sin conexión y luego se conecta, podría perder esa edición. En la práctica esto no pasa porque los favoritos son inmutables una vez creados (solo se añaden/quitan, no se editan).

## Testing

El store tiene tests unitarios en `test/unit/stores/favorites.test.ts`:

```typescript
describe('useFavoritesStore', () => {
  it('adds favorite optimistically', async () => {
    const store = useFavoritesStore()
    await store.addFavorite(mockAnime)
    expect(store.isFavorite(mockAnime.mal_id)).toBe(true)
  })

  it('rolls back on server error', async () => {
    // Mock Supabase to fail
    vi.mocked(insertFavorite).mockResolvedValue({ success: false, error: new Error() })

    const store = useFavoritesStore()
    store.syncedForUserId = 'user-123' // Simulate logged in

    await store.addFavorite(mockAnime)

    expect(store.isFavorite(mockAnime.mal_id)).toBe(false) // Rolled back
  })
})
```

## Archivos Relacionados

| Archivo                              | Propósito                                |
| ------------------------------------ | ---------------------------------------- |
| `app/stores/favorites.ts`            | Store de favoritos con sync logic        |
| `app/stores/watched.ts`              | Store de vistos (misma arquitectura)     |
| `app/stores/preferences.ts`          | Store de preferencias (locale, theme)    |
| `app/plugins/sync-stores.client.ts`  | Inicialización y eventos de auth         |
| `app/services/supabase/favorites.ts` | Operaciones de base de datos (favoritos) |
| `app/services/supabase/watched.ts`   | Operaciones de base de datos (vistos)    |
| `shared/types/favorites.ts`          | Tipos TypeScript                         |
| `shared/schemas/favorites.ts`        | Validación Zod                           |
| `app/types/favorites.ts`             | Tipos locales (FavoriteAnime, etc.)      |

## Posibles Mejoras Futuras

1. **Conflict resolution UI**: Mostrar al usuario cuando hay conflictos y dejarle elegir
2. **Partial sync**: Solo sincronizar cambios desde la última sync (delta sync)
3. **Export/Import**: Permitir exportar favoritos a JSON
