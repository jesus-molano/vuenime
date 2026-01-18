import type { Character } from '~~/shared/types'

export const useAnimeCharacters = (animeId: Ref<string | number> | ComputedRef<string | number>) => {
  const { data: characters, isLoading, error, refresh } = useLazyAnimeData<Character>(animeId, 'characters')

  const mainCharacters = computed(() => characters.value.filter((c) => c.role === 'Main'))
  const supportingCharacters = computed(() => characters.value.filter((c) => c.role === 'Supporting'))

  return {
    characters,
    mainCharacters,
    supportingCharacters,
    isLoading,
    error,
    refresh,
  }
}
