import type { SupabaseClient } from '@supabase/supabase-js'
import type { FavoriteAnime } from '~/types/favorites'
import type { Database } from '~~/shared/types/database'

type DbFavorite = Database['public']['Tables']['favorites']['Row']
type DbFavoriteInsert = Database['public']['Tables']['favorites']['Insert']

// ============================================
// Data Conversion
// ============================================

export function toDbFormat(anime: FavoriteAnime, userId: string): DbFavoriteInsert {
  return {
    user_id: userId,
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english ?? null,
    image_url: anime.images?.jpg?.large_image_url ?? anime.images?.jpg?.image_url ?? null,
    score: anime.score ?? null,
    year: anime.year ?? null,
    episodes: anime.episodes ?? null,
    airing: anime.airing ?? false,
    genres: anime.genres?.map((g) => ({ mal_id: g.mal_id, name: g.name })) ?? [],
  }
}

export function fromDbFormat(row: DbFavorite): FavoriteAnime {
  return {
    mal_id: row.mal_id,
    title: row.title,
    title_english: row.title_english,
    images: {
      jpg: {
        image_url: row.image_url ?? '',
        small_image_url: row.image_url ?? '',
        large_image_url: row.image_url ?? '',
      },
      webp: {
        image_url: row.image_url ?? '',
        small_image_url: row.image_url ?? '',
        large_image_url: row.image_url ?? '',
      },
    },
    score: row.score,
    year: row.year,
    episodes: row.episodes,
    airing: row.airing ?? false,
    genres: parseGenres(row.genres),
    addedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }
}

function parseGenres(genres: unknown): FavoriteAnime['genres'] {
  if (!Array.isArray(genres)) return []

  return genres.map((g) => ({
    mal_id: (g as { mal_id?: number }).mal_id ?? 0,
    type: 'anime' as const,
    name: (g as { name?: string }).name ?? '',
    url: '',
  }))
}

// ============================================
// Database Operations
// ============================================

export async function fetchUserFavorites(client: SupabaseClient<Database>, userId: string): Promise<FavoriteAnime[]> {
  const { data, error } = await client
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return data?.map(fromDbFormat) ?? []
}

export async function fetchExistingIds(client: SupabaseClient<Database>, userId: string): Promise<Set<number>> {
  const { data } = await client.from('favorites').select('mal_id').eq('user_id', userId)

  return new Set(data?.map((f) => f.mal_id) ?? [])
}

export async function insertFavorite(
  client: SupabaseClient<Database>,
  userId: string,
  anime: FavoriteAnime
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('favorites').insert(toDbFormat(anime, userId))

  if (error) {
    console.error('Error inserting favorite:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertManyFavorites(
  client: SupabaseClient<Database>,
  userId: string,
  animes: FavoriteAnime[]
): Promise<{ success: boolean; error?: string }> {
  if (animes.length === 0) return { success: true }

  const { error } = await client.from('favorites').insert(animes.map((a) => toDbFormat(a, userId)))

  if (error) {
    console.error('Error inserting favorites:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteFavorite(
  client: SupabaseClient<Database>,
  userId: string,
  malId: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('favorites').delete().eq('user_id', userId).eq('mal_id', malId)

  if (error) {
    console.error('Error deleting favorite:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAllFavorites(
  client: SupabaseClient<Database>,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('favorites').delete().eq('user_id', userId)

  if (error) {
    console.error('Error clearing favorites:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
