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
          v-if="!isLoading && hasResults && hasActiveFilters"
          class="text-sm text-rp-subtle"
        >
          <template v-if="results.length < totalItems">
            {{ $t('home.showingCount', { current: results.length, total: totalItems }) }}
          </template>
          <template v-else>{{ totalItems }} {{ $t('search.resultsFound') }}</template>
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
            <!-- Row 1: Type + Year (inline) -->
            <div class="flex flex-wrap items-end gap-4">
              <!-- Type -->
              <div class="flex-1">
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

              <!-- Year Input (compact) -->
              <div class="w-24 shrink-0">
                <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                  {{ $t('search.year') }}
                </h4>
                <input
                  v-model="yearInput"
                  type="number"
                  :placeholder="currentYear.toString()"
                  :min="1960"
                  :max="currentYear + 1"
                  class="w-full rounded-lg border bg-rp-base px-2.5 py-1.5 text-center text-sm text-rp-text outline-none transition-colors"
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
        <UiFilterTag
          v-if="selectedType"
          variant="iris"
          @remove="clearTypeFilter"
        >
          {{ selectedTypeLabel }}
        </UiFilterTag>
        <UiFilterTag
          v-if="selectedGenre"
          variant="foam"
          @remove="clearGenreFilter"
        >
          {{ selectedGenreLabel }}
        </UiFilterTag>
        <UiFilterTag
          v-if="selectedYear"
          variant="gold"
          @remove="clearYearFilter"
        >
          {{ selectedYear }}
        </UiFilterTag>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 md:pb-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
      >
        <AnimeCardSkeleton
          v-for="i in 24"
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
        v-else-if="!hasResults && !isLoading"
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
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
      >
        <AnimeCard
          v-for="anime in results"
          :key="anime.mal_id"
          :anime="anime"
        />
      </div>

      <!-- Load More Trigger (always rendered when filters active) -->
      <div
        v-if="hasActiveFilters"
        ref="triggerRef"
        class="flex flex-col items-center justify-center gap-4 py-8"
      >
        <div
          v-if="isLoadingMore"
          class="flex items-center gap-3"
        >
          <div class="size-5 animate-spin rounded-full border-2 border-rp-iris border-t-transparent" />
          <span class="text-sm text-rp-subtle">{{ $t('common.loading') }}</span>
        </div>

        <div
          v-else-if="loadMoreError"
          class="flex flex-col items-center gap-3"
        >
          <p class="text-sm text-rp-love">{{ $t('home.loadMoreError') }}</p>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
            @click="loadMore"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="size-4"
            />
            {{ $t('common.retry') }}
          </button>
        </div>

        <p
          v-else-if="!hasNextPage && results.length > 0"
          class="text-sm text-rp-muted"
        >
          {{ $t('home.endOfList') }}
        </p>
      </div>
    </UContainer>

    <!-- Back to Top -->
    <UiBackToTop />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const {
  showFilters,
  showGenreDropdown,
  genreSearch,
  searchInput,
  debouncedSearch,
  selectedType,
  selectedYear,
  selectedGenre,
  yearInput,
  yearError,
  currentYear,
  typeOptions,
  popularGenres,
  filteredGenres,
  activeFiltersCount,
  hasActiveFilters,
  searchTitle,
  selectedTypeLabel,
  selectedGenreLabel,
  toggleType,
  applyYearFilter,
  validateYear,
  selectGenre,
  closeGenreDropdown,
  clearTypeFilter,
  clearGenreFilter,
  clearYearFilter,
  clearAllFilters,
  updateUrl,
} = useSearchFilters()

// Search params for infinite scroll
const searchParams = computed(() => {
  if (!hasActiveFilters.value) return null

  return {
    q: debouncedSearch.value || undefined,
    type: selectedType.value || undefined,
    year: selectedYear.value || undefined,
    genres: selectedGenre.value || undefined,
  }
})

// Infinite scroll search results
const {
  searchResults: results,
  isLoading,
  isLoadingMore,
  hasNextPage,
  totalItems,
  hasResults,
  loadMoreError,
  loadMore,
} = useSearchResults(searchParams)

// Infinite scroll trigger
const { triggerRef } = useInfiniteScroll({
  hasMore: hasNextPage,
  isLoading: isLoadingMore,
  hasError: loadMoreError,
  onLoadMore: loadMore,
})

const handleSearch = () => {
  updateUrl(true)
}

useSeoMeta({
  title: () => `${searchTitle.value || t('nav.explore')} | VueNime`,
  description: () => (searchTitle.value ? `${t('search.resultsFor')} ${searchTitle.value}` : t('nav.explore')),
})
</script>
