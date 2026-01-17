import type { SupabaseClient } from '@supabase/supabase-js'
import type { WatchedEpisode } from '~/types/watched'
import type { Database } from '~~/shared/types/database'

type DbWatchedEpisode = Database['public']['Tables']['watched_episodes']['Row']
type DbWatchedEpisodeInsert = Database['public']['Tables']['watched_episodes']['Insert']

// ============================================
// Data Conversion
// ============================================

export function toDbFormat(episode: WatchedEpisode, userId: string): DbWatchedEpisodeInsert {
  return {
    user_id: userId,
    mal_id: episode.mal_id,
    episode_number: episode.episode_number,
  }
}

export function fromDbFormat(row: DbWatchedEpisode): WatchedEpisode {
  return {
    mal_id: row.mal_id,
    episode_number: row.episode_number,
    watched_at: row.watched_at ? new Date(row.watched_at).getTime() : Date.now(),
  }
}

// ============================================
// Database Operations
// ============================================

export async function fetchUserWatchedEpisodes(
  client: SupabaseClient<Database>,
  userId: string
): Promise<WatchedEpisode[]> {
  const { data, error } = await client
    .from('watched_episodes')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })

  if (error) {
    console.error('Error fetching watched episodes:', error)
    return []
  }

  return data?.map(fromDbFormat) ?? []
}

export async function fetchWatchedForAnime(
  client: SupabaseClient<Database>,
  userId: string,
  malId: number
): Promise<Set<number>> {
  const { data } = await client
    .from('watched_episodes')
    .select('episode_number')
    .eq('user_id', userId)
    .eq('mal_id', malId)

  return new Set(data?.map((e) => e.episode_number) ?? [])
}

export async function fetchExistingWatchedIds(client: SupabaseClient<Database>, userId: string): Promise<Set<string>> {
  const { data } = await client.from('watched_episodes').select('mal_id, episode_number').eq('user_id', userId)

  return new Set(data?.map((e) => `${e.mal_id}-${e.episode_number}`) ?? [])
}

export async function insertWatchedEpisode(
  client: SupabaseClient<Database>,
  userId: string,
  episode: WatchedEpisode
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('watched_episodes').insert(toDbFormat(episode, userId))

  if (error) {
    console.error('Error inserting watched episode:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertManyWatchedEpisodes(
  client: SupabaseClient<Database>,
  userId: string,
  episodes: WatchedEpisode[]
): Promise<{ success: boolean; error?: string }> {
  if (episodes.length === 0) return { success: true }

  const { error } = await client.from('watched_episodes').insert(episodes.map((e) => toDbFormat(e, userId)))

  if (error) {
    console.error('Error inserting watched episodes:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteWatchedEpisode(
  client: SupabaseClient<Database>,
  userId: string,
  malId: number,
  episodeNumber: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client
    .from('watched_episodes')
    .delete()
    .eq('user_id', userId)
    .eq('mal_id', malId)
    .eq('episode_number', episodeNumber)

  if (error) {
    console.error('Error deleting watched episode:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAllWatchedForAnime(
  client: SupabaseClient<Database>,
  userId: string,
  malId: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('watched_episodes').delete().eq('user_id', userId).eq('mal_id', malId)

  if (error) {
    console.error('Error clearing watched episodes for anime:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAllWatched(
  client: SupabaseClient<Database>,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client.from('watched_episodes').delete().eq('user_id', userId)

  if (error) {
    console.error('Error clearing all watched episodes:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
