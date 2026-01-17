import type { Anime } from '~~/shared/types/anime'

export interface FavoriteAnime {
  mal_id: number
  title: string
  title_english?: string | null
  images: Anime['images']
  score?: number | null
  year?: number | null
  episodes?: number | null
  genres?: Anime['genres']
  airing?: boolean
  addedAt: number
}

// Tipo para añadir favoritos (campos mínimos requeridos)
export type AddFavoriteInput = Pick<Anime, 'mal_id' | 'title' | 'images'> &
  Partial<Pick<Anime, 'score' | 'year' | 'episodes' | 'genres' | 'airing' | 'title_english'>>
