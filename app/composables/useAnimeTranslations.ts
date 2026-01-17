import { GENRE_KEYS } from '~~/shared/constants/translations'

export const useAnimeTranslations = () => {
  const { t, te } = useI18n()

  /**
   * Translate anime type
   */
  const translateType = (type: string): string => {
    const key = `types.${type.toLowerCase()}`
    return te(key) ? t(key) : type
  }

  /**
   * Translate genre by ID
   */
  const translateGenreById = (genreId: number): string | null => {
    const genreKey = GENRE_KEYS[genreId]
    if (!genreKey) return null

    const key = `genresList.${genreKey}`
    return te(key) ? t(key) : null
  }

  /**
   * Translate genre by name (fallback if ID not available)
   */
  const translateGenreByName = (name: string): string => {
    // Try to find the genre key by matching the English name
    const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '')

    // Check all genre keys
    for (const [, genreKey] of Object.entries(GENRE_KEYS)) {
      if (genreKey.toLowerCase() === normalizedName) {
        const key = `genresList.${genreKey}`
        return te(key) ? t(key) : name
      }
    }

    return name
  }

  /**
   * Get translated genre object
   */
  const getTranslatedGenre = (genre: { mal_id: number; name: string }): { value: string; label: string } => {
    const translatedName = translateGenreById(genre.mal_id) || genre.name
    return {
      value: String(genre.mal_id),
      label: translatedName,
    }
  }

  return {
    translateType,
    translateGenreById,
    translateGenreByName,
    getTranslatedGenre,
  }
}
