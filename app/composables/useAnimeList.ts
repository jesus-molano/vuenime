import type { AnimeListResponse } from "~~/shared/types";
import { PAGINATION } from '~~/shared/constants/api';

export const useAnimeList = () => {
  const { t } = useI18n()

  const animeList = ref<AnimeListResponse | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const fetchTopAnime = async (page: number = PAGINATION.DEFAULT_PAGE) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<AnimeListResponse>('/api/jikan/anime', {
        query: { page, limit: PAGINATION.DEFAULT_LIMIT }
      })
      animeList.value = data
    } catch (err) {
      error.value = t('common.error')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    animeList,
    isLoading,
    error,
    fetchTopAnime,
  }
}