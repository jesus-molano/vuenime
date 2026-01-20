import { ANIME_TYPES } from '~~/shared/constants/translations'
import { CACHE_KEYS } from '~/utils/cache-keys'

/**
 * Composable for search page filter logic
 * Manages type, year, and genre filters with URL sync
 */
export function useSearchFilters() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const localePath = useLocalePath()
  const { translateType, getTranslatedGenre } = useAnimeTranslations()

  // UI state
  const showFilters = ref(false)
  const showGenreDropdown = ref(false)
  const genreSearch = ref('')

  // Query params from URL
  const queryParam = computed(() => (route.query.q as string) || '')
  const typeFilter = computed(() => (route.query.type as string) || '')
  const yearFilter = computed(() => (route.query.year as string) || '')
  const genresFilter = computed(() => (route.query.genres as string) || '')
  const nameParam = computed(() => (route.query.name as string) || '')

  // Local filter state
  const searchInput = ref(queryParam.value)
  const debouncedSearch = ref(queryParam.value)
  const selectedType = ref<string | null>(typeFilter.value || null)
  const selectedYear = ref<string | null>(yearFilter.value || null)
  const selectedGenre = ref(genresFilter.value || '')

  // Debounce search input with cleanup
  let searchTimeout: ReturnType<typeof setTimeout> | null = null
  watch(searchInput, (newValue) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      debouncedSearch.value = newValue
      searchTimeout = null
    }, 500)
  })

  // Cleanup timeout on scope disposal (component unmount)
  onScopeDispose(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
      searchTimeout = null
    }
  })

  const typeKeys = ANIME_TYPES
  const typeOptions = computed(() => typeKeys.map((key) => ({ value: key, label: translateType(key) })))

  // Type options with icons for improved UX
  const typeIcons: Record<string, string> = {
    tv: 'i-heroicons-tv',
    movie: 'i-heroicons-film',
    ova: 'i-heroicons-video-camera',
    ona: 'i-heroicons-globe-alt',
    special: 'i-heroicons-sparkles',
    music: 'i-heroicons-musical-note',
  }

  const typeOptionsWithIcons = computed(() =>
    typeKeys.map((key) => ({
      value: key,
      label: translateType(key),
      icon: typeIcons[key] || 'i-heroicons-play',
    }))
  )

  // Quick year selection (last 5 years)
  const quickYears = computed(() => {
    const years = []
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i)
    }
    return years
  })

  // Fetch genres from API
  const { data: genresData } = useFetch<{ data: { mal_id: number; name: string }[] }>('/api/jikan/genres/anime', {
    key: CACHE_KEYS.ANIME_GENRES,
    default: () => ({ data: [] }),
  })

  const genres = computed(() => genresData.value?.data?.map((g) => getTranslatedGenre(g)) || [])
  const popularGenres = computed(() => genres.value.slice(0, 10))

  const filteredGenres = computed(() => {
    if (!genreSearch.value) return genres.value
    const search = genreSearch.value.toLowerCase()
    return genres.value.filter((g) => g.label.toLowerCase().includes(search))
  })

  // Year validation
  const currentYear = new Date().getFullYear()
  const yearInput = ref(selectedYear.value || '')
  const yearError = ref('')

  const validateYear = () => {
    if (!yearInput.value) {
      yearError.value = ''
      return true
    }
    const year = parseInt(yearInput.value)
    if (isNaN(year)) {
      yearError.value = t('search.yearInvalid')
      return false
    }
    if (year < 1960) {
      yearError.value = t('search.yearTooOld')
      return false
    }
    if (year > currentYear + 1) {
      yearError.value = t('search.yearTooNew')
      return false
    }
    yearError.value = ''
    return true
  }

  // Actions
  const updateUrl = (includeSearch = false) => {
    const queryParams: Record<string, string> = {}
    if (includeSearch && searchInput.value) queryParams.q = searchInput.value
    else if (debouncedSearch.value) queryParams.q = debouncedSearch.value
    if (selectedType.value) queryParams.type = selectedType.value
    if (selectedYear.value) queryParams.year = selectedYear.value
    if (selectedGenre.value) queryParams.genres = selectedGenre.value

    router.push({ path: localePath('/search'), query: queryParams })
  }

  const toggleType = (value: string) => {
    selectedType.value = selectedType.value === value ? null : value
    updateUrl()
  }

  const applyYearFilter = () => {
    if (!validateYear()) return

    const year = parseInt(yearInput.value)
    if (year >= 1960 && year <= currentYear + 1) {
      selectedYear.value = String(year)
      updateUrl()
    } else if (!yearInput.value) {
      selectedYear.value = null
      updateUrl()
    }
  }

  const selectGenre = (value: string) => {
    selectedGenre.value = value
    genreSearch.value = ''
    showGenreDropdown.value = false
    updateUrl()
  }

  const selectYear = (value: string) => {
    if (selectedYear.value === value) {
      selectedYear.value = null
      yearInput.value = ''
    } else {
      selectedYear.value = value
      yearInput.value = value
    }
    updateUrl()
  }

  const closeGenreDropdown = () => {
    setTimeout(() => {
      showGenreDropdown.value = false
    }, 150)
  }

  // Clear functions
  const clearTypeFilter = () => {
    selectedType.value = null
    updateUrl()
  }

  const clearGenreFilter = () => {
    selectedGenre.value = ''
    updateUrl()
  }

  const clearYearFilter = () => {
    selectedYear.value = null
    yearInput.value = ''
    updateUrl()
  }

  const clearAllFilters = () => {
    selectedType.value = null
    selectedYear.value = null
    yearInput.value = ''
    selectedGenre.value = ''
    searchInput.value = ''
    router.push(localePath('/search'))
  }

  // Computed
  const activeFiltersCount = computed(() => {
    let count = 0
    if (selectedType.value) count++
    if (selectedYear.value) count++
    if (selectedGenre.value) count++
    return count
  })

  const hasActiveFilters = computed(
    () => !!(debouncedSearch.value || selectedType.value || selectedYear.value || selectedGenre.value)
  )

  const searchTitle = computed(() => {
    if (debouncedSearch.value) return `"${debouncedSearch.value}"`
    if (nameParam.value) return nameParam.value

    const parts: string[] = []
    if (selectedGenre.value) {
      const genre = genres.value.find((g) => g.value === selectedGenre.value)
      if (genre) parts.push(genre.label)
    }
    if (selectedType.value) {
      const type = typeOptions.value.find((tp) => tp.value === selectedType.value)
      if (type) parts.push(type.label)
    }
    if (selectedYear.value) {
      parts.push(selectedYear.value)
    }

    return parts.join(' · ')
  })

  // Get labels for active filters
  const selectedTypeLabel = computed(
    () => typeOptions.value.find((type) => type.value === selectedType.value)?.label || ''
  )

  const selectedGenreLabel = computed(() => genres.value.find((g) => g.value === selectedGenre.value)?.label || '')

  // Sync with URL
  watch(
    () => route.query,
    (newQuery) => {
      searchInput.value = (newQuery.q as string) || ''
      selectedType.value = (newQuery.type as string) || null
      selectedYear.value = (newQuery.year as string) || null
      yearInput.value = (newQuery.year as string) || ''
      selectedGenre.value = (newQuery.genres as string) || ''
    },
    { immediate: true }
  )

  return {
    // UI state
    showFilters,
    showGenreDropdown,
    genreSearch,

    // Search
    searchInput,
    debouncedSearch,

    // Filters
    selectedType,
    selectedYear,
    selectedGenre,
    yearInput,
    yearError,
    currentYear,

    // Options
    typeOptions,
    typeOptionsWithIcons,
    quickYears,
    genres,
    popularGenres,
    filteredGenres,

    // Computed
    activeFiltersCount,
    hasActiveFilters,
    searchTitle,
    selectedTypeLabel,
    selectedGenreLabel,

    // Actions
    toggleType,
    applyYearFilter,
    validateYear,
    selectYear,
    selectGenre,
    closeGenreDropdown,
    clearTypeFilter,
    clearGenreFilter,
    clearYearFilter,
    clearAllFilters,
    updateUrl,
  }
}
