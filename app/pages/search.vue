<template>
  <div class="min-h-screen py-6 pt-20 sm:py-8 sm:pt-24 md:py-12 md:pt-32">
    <UContainer class="px-4 sm:px-6">
      <!-- Search Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="mb-2 text-xl font-bold text-rp-text sm:text-2xl md:text-3xl">
          <template v-if="searchTitle">
            {{ $t('search.resultsFor') }}
            <span class="text-rp-iris">{{ searchTitle }}</span>
          </template>
          <template v-else>
            {{ $t('nav.explore') }}
          </template>
        </h1>
        <p
          v-if="!isLoading && searchResults && hasActiveFilters"
          class="text-sm text-rp-subtle"
        >
          {{ searchResults.pagination?.items?.total || 0 }} {{ $t('search.resultsFound') }}
        </p>
      </div>

      <!-- Search Bar with Filters -->
      <div class="mb-6 flex items-center gap-2">
        <!-- Search Input -->
        <form
          role="search"
          class="flex flex-1 items-center gap-2 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 px-4 py-2.5 backdrop-blur-sm transition-all focus-within:border-rp-iris/50 focus-within:bg-rp-surface/80"
          @submit.prevent="handleSearch"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="size-5 shrink-0 text-rp-muted"
          />
          <input
            v-model="searchInput"
            type="search"
            :placeholder="$t('home.searchPlaceholder')"
            class="min-w-0 flex-1 bg-transparent text-sm text-rp-text placeholder-rp-subtle outline-none"
          />
        </form>

        <!-- Filters Button -->
        <button
          type="button"
          class="relative flex items-center gap-2 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 px-4 py-2.5 text-sm font-medium text-rp-text transition-all hover:border-rp-iris/50 hover:bg-rp-surface/80"
          @click="showFilters = !showFilters"
        >
          <UIcon
            name="i-heroicons-funnel"
            class="size-5"
          />
          <span class="hidden sm:inline">{{ $t('search.filters') }}</span>
          <span
            v-if="activeFiltersCount > 0"
            class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-rp-iris text-xs font-bold text-white"
          >
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <!-- Filters Panel -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="showFilters"
          class="relative z-20 mb-6 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 p-4 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <!-- Row 1: Type + Year -->
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Type -->
              <div>
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                  {{ $t('anime.type') }}
                </h4>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="type in typeOptions"
                    :key="type.value"
                    type="button"
                    class="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                    :class="
                      selectedType === type.value
                        ? 'bg-rp-iris text-white'
                        : 'bg-rp-overlay/50 text-rp-text hover:bg-rp-overlay'
                    "
                    @click="toggleType(type.value)"
                  >
                    {{ type.label }}
                  </button>
                </div>
              </div>

              <!-- Year Input -->
              <div>
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                  {{ $t('search.year') }}
                </h4>
                <input
                  v-model="yearInput"
                  type="number"
                  :placeholder="$t('search.enterYear')"
                  :min="1960"
                  :max="currentYear + 1"
                  class="w-full rounded-lg border bg-rp-base px-3 py-2 text-sm text-rp-text outline-none transition-colors"
                  :class="
                    yearError ? 'border-rp-love focus:border-rp-love' : 'border-rp-overlay/50 focus:border-rp-iris'
                  "
                  @keyup.enter="applyYearFilter"
                  @blur="applyYearFilter"
                  @input="validateYear"
                />
                <p
                  v-if="yearError"
                  class="mt-1 text-xs text-rp-love"
                >
                  {{ yearError }}
                </p>
              </div>
            </div>

            <!-- Row 2: Genres -->
            <div>
              <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                {{ $t('anime.genres') }}
              </h4>

              <!-- Genre Search -->
              <div class="relative mb-2">
                <input
                  v-model="genreSearch"
                  type="text"
                  :placeholder="$t('search.searchGenre')"
                  class="w-full rounded-lg border border-rp-overlay/50 bg-rp-base px-3 py-2 text-sm text-rp-text outline-none transition-colors focus:border-rp-iris"
                  @focus="showGenreDropdown = true"
                  @blur="closeGenreDropdown"
                />

                <!-- Dropdown -->
                <Transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="showGenreDropdown && filteredGenres.length > 0"
                    class="absolute z-100 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-rp-overlay/50 bg-rp-surface shadow-xl"
                  >
                    <button
                      v-for="genre in filteredGenres"
                      :key="genre.value"
                      type="button"
                      class="flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-rp-overlay/50"
                      :class="selectedGenre === genre.value ? 'bg-rp-foam/20 text-rp-foam' : 'text-rp-text'"
                      @click="selectGenre(genre.value)"
                    >
                      {{ genre.label }}
                    </button>
                  </div>
                </Transition>
              </div>

              <!-- Popular Genres Pills -->
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="genre in popularGenres"
                  :key="genre.value"
                  type="button"
                  class="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
                  :class="
                    selectedGenre === genre.value
                      ? 'bg-rp-foam text-rp-base'
                      : 'bg-rp-overlay/50 text-rp-text hover:bg-rp-overlay'
                  "
                  @click="selectGenre(selectedGenre === genre.value ? '' : genre.value)"
                >
                  {{ genre.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Clear Button -->
          <div
            v-if="activeFiltersCount > 0"
            class="mt-4 border-t border-rp-overlay/50 pt-4"
          >
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-lg text-sm font-medium text-rp-love transition-all hover:text-rp-love/80"
              @click="clearAllFilters"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="size-4"
              />
              {{ $t('search.clearFilters') }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Active Filters Tags -->
      <div
        v-if="activeFiltersCount > 0 && !showFilters"
        class="mb-6 flex flex-wrap items-center gap-2"
      >
        <span
          v-if="selectedType"
          class="flex items-center gap-1 rounded-full bg-rp-iris/20 px-3 py-1 text-sm text-rp-iris"
        >
          {{ typeOptions.find((type) => type.value === selectedType)?.label }}
          <button
            type="button"
            class="ml-1 rounded-full p-0.5 hover:bg-rp-iris/30"
            @click="clearTypeFilter"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="size-3"
            />
          </button>
        </span>
        <span
          v-if="selectedGenre"
          class="flex items-center gap-1 rounded-full bg-rp-foam/20 px-3 py-1 text-sm text-rp-foam"
        >
          {{ genres.find((g) => g.value === selectedGenre)?.label }}
          <button
            type="button"
            class="ml-1 rounded-full p-0.5 hover:bg-rp-foam/30"
            @click="clearGenreFilter"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="size-3"
            />
          </button>
        </span>
        <span
          v-if="selectedYear"
          class="flex items-center gap-1 rounded-full bg-rp-gold/20 px-3 py-1 text-sm text-rp-gold"
        >
          {{ selectedYear }}
          <button
            type="button"
            class="ml-1 rounded-full p-0.5 hover:bg-rp-gold/30"
            @click="clearYearFilter"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="size-3"
            />
          </button>
        </span>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 md:pb-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
      >
        <AnimeCardSkeleton
          v-for="i in 12"
          :key="i"
        />
      </div>

      <!-- No Filters Applied -->
      <div
        v-else-if="!hasActiveFilters"
        class="flex flex-col items-center justify-center py-16 md:py-24"
      >
        <div class="mb-4 rounded-2xl bg-linear-to-br from-rp-iris/20 to-rp-love/20 p-6">
          <UIcon
            name="i-heroicons-sparkles"
            class="size-12 text-rp-iris"
          />
        </div>
        <p class="mb-2 text-xl font-semibold text-rp-text">{{ $t('search.useFilters') }}</p>
        <p class="max-w-sm text-center text-sm text-rp-subtle">{{ $t('search.useFiltersDesc') }}</p>
      </div>

      <!-- No Results -->
      <div
        v-else-if="!searchResults?.data?.length"
        class="flex flex-col items-center justify-center py-16 md:py-24"
      >
        <div class="mb-4 rounded-2xl bg-rp-overlay/50 p-6">
          <UIcon
            name="i-heroicons-face-frown"
            class="size-12 text-rp-muted"
          />
        </div>
        <p class="mb-2 text-xl font-semibold text-rp-text">{{ $t('common.noResults') }}</p>
        <p class="text-sm text-rp-subtle">{{ $t('search.tryDifferent') }}</p>
      </div>

      <!-- Results Grid -->
      <div
        v-else
        class="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 md:pb-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
      >
        <AnimeCard
          v-for="anime in searchResults.data"
          :key="anime.mal_id"
          :anime="anime"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { AnimeListResponse } from '~~/shared/types'
import { PAGINATION } from '~~/shared/constants/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { translateType, getTranslatedGenre } = useAnimeTranslations()

// UI state
const showFilters = ref(false)

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

// Debounce search input
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchInput, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue
  }, 500)
})

// Type options (all from Jikan API) - translated
const typeKeys = ['tv', 'movie', 'ova', 'ona', 'special', 'music', 'cm', 'pv', 'tv_special']
const typeOptions = computed(() => typeKeys.map((key) => ({ value: key, label: translateType(key) })))

// Fetch genres from API
const { data: genresData } = useFetch<{ data: { mal_id: number; name: string }[] }>('/api/jikan/genres/anime', {
  key: 'anime-genres',
  default: () => ({ data: [] }),
})

const genres = computed(() => genresData.value?.data?.map((g) => getTranslatedGenre(g)) || [])

// Popular genres (top 10)
const popularGenres = computed(() => genres.value.slice(0, 10))

// Genre search
const genreSearch = ref('')
const showGenreDropdown = ref(false)

const filteredGenres = computed(() => {
  if (!genreSearch.value) return genres.value
  const search = genreSearch.value.toLowerCase()
  return genres.value.filter((g) => g.label.toLowerCase().includes(search))
})

const selectGenre = (value: string) => {
  selectedGenre.value = value
  genreSearch.value = ''
  showGenreDropdown.value = false
  updateUrl()
}

// Close dropdown when clicking outside
const closeGenreDropdown = () => {
  setTimeout(() => {
    showGenreDropdown.value = false
  }, 150)
}

// Year input
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

// Toggle type
const toggleType = (value: string) => {
  selectedType.value = selectedType.value === value ? null : value
  updateUrl()
}

// Clear filter functions
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
  updateUrl()
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

// API params
const apiParams = computed(() => {
  if (!hasActiveFilters.value) return null

  const params: Record<string, string | number> = {
    limit: PAGINATION.DEFAULT_LIMIT,
  }

  if (debouncedSearch.value) params.q = debouncedSearch.value
  if (selectedType.value) params.type = selectedType.value
  if (selectedYear.value) {
    params.start_date = `${selectedYear.value}-01-01`
    params.end_date = `${selectedYear.value}-12-31`
  }
  if (selectedGenre.value) params.genres = selectedGenre.value

  return params
})

const getCacheKey = () =>
  `search-${debouncedSearch.value}-${selectedType.value}-${selectedYear.value}-${selectedGenre.value}`

const { data: searchResults, status } = useFetch<AnimeListResponse>('/api/jikan/anime', {
  key: getCacheKey,
  query: apiParams,
  watch: [apiParams],
})

const isLoading = computed(() => status.value === 'pending' && hasActiveFilters.value)

// URL management
const updateUrl = (includeSearch = false) => {
  const queryParams: Record<string, string> = {}
  if (includeSearch && searchInput.value) queryParams.q = searchInput.value
  else if (debouncedSearch.value) queryParams.q = debouncedSearch.value
  if (selectedType.value) queryParams.type = selectedType.value
  if (selectedYear.value) queryParams.year = selectedYear.value
  if (selectedGenre.value) queryParams.genres = selectedGenre.value

  router.push({ path: localePath('/search'), query: queryParams })
}

const handleSearch = () => {
  // Immediate search on Enter
  updateUrl(true)
}

const clearAllFilters = () => {
  selectedType.value = null
  selectedYear.value = null
  yearInput.value = ''
  selectedGenre.value = ''
  searchInput.value = ''
  router.push(localePath('/search'))
}

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

useSeoMeta({
  title: () => `${searchTitle.value || t('nav.explore')} | VueNime`,
  description: () => (searchTitle.value ? `${t('search.resultsFor')} ${searchTitle.value}` : t('nav.explore')),
})
</script>
