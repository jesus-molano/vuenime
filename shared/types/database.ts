export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          airing: boolean | null
          created_at: string | null
          episodes: number | null
          genres: Json | null
          id: string
          image_url: string | null
          mal_id: number
          score: number | null
          title: string
          title_english: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          airing?: boolean | null
          created_at?: string | null
          episodes?: number | null
          genres?: Json | null
          id?: string
          image_url?: string | null
          mal_id: number
          score?: number | null
          title: string
          title_english?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          airing?: boolean | null
          created_at?: string | null
          episodes?: number | null
          genres?: Json | null
          id?: string
          image_url?: string | null
          mal_id?: number
          score?: number | null
          title?: string
          title_english?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      watched_episodes: {
        Row: {
          episode_number: number
          id: string
          mal_id: number
          user_id: string
          watched_at: string | null
        }
        Insert: {
          episode_number: number
          id?: string
          mal_id: number
          user_id: string
          watched_at?: string | null
        }
        Update: {
          episode_number?: number
          id?: string
          mal_id?: number
          user_id?: string
          watched_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

export type Favorite = Tables<'favorites'>
export type DbWatchedEpisode = Tables<'watched_episodes'>
