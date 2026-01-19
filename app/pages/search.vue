<template>
  <div class="min-h-screen py-6 pt-20 sm:py-8 sm:pt-24 md:py-12 md:pt-32">
    <UContainer class="px-4 sm:px-6">
      <!-- Search Header -->
      <div
        v-scroll-reveal.fade-up
        class="mb-6 md:mb-8"
      >
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
      <div
        v-scroll-reveal.fade-up="50"
        class="mb-6 flex items-center gap-2"
      >
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

      <!-- Filters Panel - Bottom Sheet on mobile, inline on desktop -->
      <!-- Mobile: Teleported bottom sheet -->
      <Teleport to="body">
        <!-- Backdrop -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showFilters && isMobile"
            class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            @click="showFilters = false"
          />
        </Transition>

        <!-- Mobile Bottom Sheet -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div
            v-if="showFilters && isMobile"
            class="fixed inset-x-0 bottom-0 z-60 max-h-[85svh] overflow-y-auto rounded-t-3xl border-t border-rp-overlay/30 bg-rp-surface shadow-2xl"
          >
            <!-- Mobile header with drag handle -->
            <div class="sticky top-0 z-10 border-b border-rp-overlay/30 bg-rp-surface pb-3 pt-2">
              <div class="mx-auto mb-3 h-1 w-12 rounded-full bg-rp-overlay/50" />
              <div class="flex items-center justify-between px-4">
                <h3 class="text-base font-semibold text-rp-text">{{ $t('search.filters') }}</h3>
                <button
                  type="button"
                  class="rounded-full p-1.5 text-rp-subtle transition-colors hover:bg-rp-overlay/50 hover:text-rp-text"
                  @click="showFilters = false"
                >
                  <UIcon
                    name="i-heroicons-x-mark"
                    class="size-5"
                  />
                </button>
              </div>
            </div>

            <!-- Filter Content -->
            <div class="space-y-0">
              <!-- Type Section -->
              <div class="border-b border-rp-overlay/30 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-tv"
                    class="size-3.5 text-rp-iris"
                  />
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                    {{ $t('anime.type') }}
                  </h4>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="type in typeOptionsWithIcons"
                    :key="type.value"
                    type="button"
                    class="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all"
                    :class="
                      selectedType === type.value
                        ? 'bg-linear-to-r from-rp-iris to-rp-love text-white shadow-lg shadow-rp-iris/25'
                        : 'bg-rp-overlay/40 text-rp-text hover:bg-rp-overlay/60'
                    "
                    @click="toggleType(type.value)"
                  >
                    <UIcon
                      :name="type.icon"
                      class="size-3.5 transition-transform group-hover:scale-110"
                      :class="selectedType === type.value ? 'text-white' : 'text-rp-subtle'"
                    />
                    {{ type.label }}
                  </button>
                </div>
              </div>

              <!-- Year Section -->
              <div class="border-b border-rp-overlay/30 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-calendar"
                    class="size-3.5 text-rp-gold"
                  />
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                    {{ $t('search.year') }}
                  </h4>
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    v-for="year in quickYears"
                    :key="year"
                    type="button"
                    class="rounded-lg px-2 py-1.5 text-xs font-medium transition-all"
                    :class="
                      selectedYear === year.toString()
                        ? 'bg-rp-gold text-rp-base shadow-lg shadow-rp-gold/25'
                        : 'bg-rp-overlay/40 text-rp-text hover:bg-rp-overlay/60'
                    "
                    @click="selectYear(year.toString())"
                  >
                    {{ year }}
                  </button>
                  <div class="relative">
                    <input
                      v-model="yearInput"
                      type="number"
                      :placeholder="$t('search.year')"
                      :min="1960"
                      :max="currentYear + 1"
                      class="w-16 rounded-lg border bg-rp-overlay/40 px-2 py-1.5 text-center text-xs text-rp-text outline-none transition-all placeholder:text-rp-muted focus:ring-2 focus:ring-rp-gold/50"
                      :class="yearError ? 'border-rp-love' : 'border-transparent focus:border-rp-gold'"
                      @keyup.enter="applyYearFilter"
                      @blur="applyYearFilter"
                      @input="validateYear"
                    />
                  </div>
                </div>
                <p
                  v-if="yearError"
                  class="mt-1.5 text-xs text-rp-love"
                >
                  {{ yearError }}
                </p>
              </div>

              <!-- Genres Section -->
              <div class="p-4">
                <div class="mb-2 flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-tag"
                    class="size-3.5 text-rp-foam"
                  />
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                    {{ $t('anime.genres') }}
                  </h4>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="genre in popularGenres"
                    :key="genre.value"
                    type="button"
                    class="rounded-lg px-2 py-1.5 text-xs font-medium transition-all"
                    :class="
                      selectedGenre === genre.value
                        ? 'bg-rp-foam text-rp-base shadow-lg shadow-rp-foam/25'
                        : 'bg-rp-overlay/40 text-rp-text hover:bg-rp-overlay/60'
                    "
                    @click="selectGenre(selectedGenre === genre.value ? '' : genre.value)"
                  >
                    {{ genre.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Footer -->
            <div
              class="sticky bottom-0 flex items-center gap-3 border-t border-rp-overlay/30 bg-rp-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <button
                v-if="activeFiltersCount > 0"
                type="button"
                class="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-rp-love transition-all hover:bg-rp-love/10"
                @click="clearAllFilters"
              >
                <UIcon
                  name="i-heroicons-trash"
                  class="size-4"
                />
                {{ $t('search.clearFilters') }}
              </button>
              <button
                type="button"
                class="ml-auto flex items-center gap-2 rounded-xl bg-linear-to-r from-rp-iris to-rp-love px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rp-iris/25 transition-all hover:opacity-90 active:scale-95"
                @click="showFilters = false"
              >
                <UIcon
                  name="i-heroicons-check"
                  class="size-4"
                />
                {{ $t('search.applyFilters') }}
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Desktop: Inline filters -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="showFilters && !isMobile"
          class="relative z-20 mb-6 overflow-visible rounded-2xl border border-rp-overlay/30 bg-rp-surface/70 ring-1 ring-rp-iris/10 backdrop-blur-md"
        >
          <div class="space-y-0">
            <!-- Type Section -->
            <div class="border-b border-rp-overlay/30 p-5">
              <div class="mb-3 flex items-center gap-2">
                <UIcon
                  name="i-heroicons-tv"
                  class="size-4 text-rp-iris"
                />
                <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                  {{ $t('anime.type') }}
                </h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in typeOptionsWithIcons"
                  :key="type.value"
                  type="button"
                  class="group flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all"
                  :class="
                    selectedType === type.value
                      ? 'bg-linear-to-r from-rp-iris to-rp-love text-white shadow-lg shadow-rp-iris/25'
                      : 'bg-rp-overlay/40 text-rp-text hover:scale-105 hover:bg-rp-overlay/60 hover:shadow-md'
                  "
                  @click="toggleType(type.value)"
                >
                  <UIcon
                    :name="type.icon"
                    class="size-4 transition-transform group-hover:scale-110"
                    :class="selectedType === type.value ? 'text-white' : 'text-rp-subtle'"
                  />
                  {{ type.label }}
                </button>
              </div>
            </div>

            <!-- Year Section -->
            <div class="border-b border-rp-overlay/30 p-5">
              <div class="mb-3 flex items-center gap-2">
                <UIcon
                  name="i-heroicons-calendar"
                  class="size-4 text-rp-gold"
                />
                <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                  {{ $t('search.year') }}
                </h4>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="year in quickYears"
                  :key="year"
                  type="button"
                  class="rounded-xl px-3 py-2 text-sm font-medium transition-all"
                  :class="
                    selectedYear === year.toString()
                      ? 'bg-rp-gold text-rp-base shadow-lg shadow-rp-gold/25'
                      : 'bg-rp-overlay/40 text-rp-text hover:scale-105 hover:bg-rp-overlay/60'
                  "
                  @click="selectYear(year.toString())"
                >
                  {{ year }}
                </button>
                <div class="relative">
                  <input
                    v-model="yearInput"
                    type="number"
                    :placeholder="$t('search.year')"
                    :min="1960"
                    :max="currentYear + 1"
                    class="w-20 rounded-xl border bg-rp-overlay/40 px-3 py-2 text-center text-sm text-rp-text outline-none transition-all placeholder:text-rp-muted focus:ring-2 focus:ring-rp-gold/50"
                    :class="yearError ? 'border-rp-love' : 'border-transparent focus:border-rp-gold'"
                    @keyup.enter="applyYearFilter"
                    @blur="applyYearFilter"
                    @input="validateYear"
                  />
                </div>
              </div>
              <p
                v-if="yearError"
                class="mt-2 text-xs text-rp-love"
              >
                {{ yearError }}
              </p>
            </div>

            <!-- Genres Section -->
            <div class="p-5">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-tag"
                    class="size-4 text-rp-foam"
                  />
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
                    {{ $t('anime.genres') }}
                  </h4>
                </div>
                <!-- Genre Search Input -->
                <div class="relative">
                  <UIcon
                    name="i-heroicons-magnifying-glass"
                    class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-rp-muted"
                  />
                  <input
                    v-model="genreSearch"
                    type="text"
                    :placeholder="$t('search.searchGenre')"
                    class="w-40 rounded-lg border border-rp-overlay/50 bg-rp-base/50 py-1.5 pl-8 pr-3 text-xs text-rp-text outline-none transition-all focus:border-rp-foam focus:ring-1 focus:ring-rp-foam/30"
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
                      class="absolute right-0 z-100 mt-1 max-h-60 w-48 overflow-y-auto rounded-xl border border-rp-overlay/50 bg-rp-surface shadow-xl"
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
              </div>

              <!-- Genre Chips -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="genre in popularGenres"
                  :key="genre.value"
                  type="button"
                  class="rounded-xl px-3 py-2 text-sm font-medium transition-all"
                  :class="
                    selectedGenre === genre.value
                      ? 'bg-rp-foam text-rp-base shadow-lg shadow-rp-foam/25'
                      : 'bg-rp-overlay/40 text-rp-text hover:scale-105 hover:bg-rp-overlay/60'
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
            class="border-t border-rp-overlay/30 bg-rp-base/30 px-5 py-3"
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
        v-scroll-reveal.fade-up
        class="flex flex-col items-center justify-center py-12 md:py-20"
      >
        <NuxtImg
          src="/images/search.webp"
          alt=""
          aria-hidden="true"
          class="mb-4 h-40 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] sm:h-48 md:h-56"
        />
        <p class="mb-2 text-xl font-semibold text-rp-text">{{ $t('search.useFilters') }}</p>
        <p class="max-w-sm text-center text-sm text-rp-subtle">{{ $t('search.useFiltersDesc') }}</p>
      </div>

      <!-- No Results -->
      <div
        v-else-if="!hasResults && !isLoading"
        v-scroll-reveal.fade-up
        class="flex flex-col items-center justify-center py-12 md:py-20"
      >
        <NuxtImg
          src="/images/search.webp"
          alt=""
          aria-hidden="true"
          class="mb-4 h-40 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] sm:h-48 md:h-56"
        />
        <p class="mb-2 text-xl font-semibold text-rp-text">{{ $t('common.noResults') }}</p>
        <p class="text-sm text-rp-subtle">{{ $t('search.tryDifferent') }}</p>
      </div>

      <!-- Results Grid -->
      <div
        v-else
        v-scroll-reveal.fade-up="100"
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

// Responsive mobile detection
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.body.style.overflow = ''
  })
})

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
  typeOptionsWithIcons,
  quickYears,
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
  selectYear,
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

// Lock body scroll when filter sheet is open on mobile
watch(showFilters, (isOpen) => {
  if (import.meta.client) {
    if (isOpen && isMobile.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

const config = useRuntimeConfig()
useSeoMeta({
  title: () => `${searchTitle.value || t('nav.explore')} | VueNime`,
  description: () => (searchTitle.value ? `${t('search.resultsFor')} ${searchTitle.value}` : t('nav.explore')),
  ogTitle: () => `${searchTitle.value || t('nav.explore')} | VueNime`,
  ogDescription: () => (searchTitle.value ? `${t('search.resultsFor')} ${searchTitle.value}` : t('nav.explore')),
  ogImage: `${config.public.siteUrl}/og-image.png`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${searchTitle.value || t('nav.explore')} | VueNime`,
  twitterDescription: () => (searchTitle.value ? `${t('search.resultsFor')} ${searchTitle.value}` : t('nav.explore')),
  twitterImage: `${config.public.siteUrl}/og-image.png`,
})
</script>
