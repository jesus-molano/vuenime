<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Header -->
    <section class="relative overflow-hidden bg-rp-base pb-8 pt-24 md:pb-12 md:pt-32">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-linear-to-b from-rp-love/10 via-rp-base to-rp-base" />

      <UContainer class="relative z-10 px-4 sm:px-6">
        <div class="mx-auto max-w-4xl text-center">
          <!-- Icon -->
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/20 md:size-20">
            <UIcon
              name="i-heroicons-heart-solid"
              class="size-8 text-rp-love md:size-10"
              aria-hidden="true"
            />
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-rp-text md:text-4xl lg:text-5xl">
            {{ $t('favorites.title') }}
          </h1>

          <!-- Subtitle -->
          <p class="mx-auto mt-3 max-w-2xl text-rp-subtle md:mt-4 md:text-lg">
            {{ $t('favorites.subtitle') }}
          </p>

          <!-- Stats -->
          <div
            v-if="favoritesCount > 0"
            class="mt-6 flex justify-center gap-6"
          >
            <div class="rounded-xl bg-rp-surface px-4 py-2">
              <span class="text-lg font-bold text-rp-love md:text-xl">{{ favoritesCount }}</span>
              <span class="ml-2 text-sm text-rp-subtle">{{ $t('favorites.animeCount') }}</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="pb-16 md:pb-24">
      <UContainer class="px-4 sm:px-6">
        <!-- Empty State -->
        <div
          v-if="favoritesCount === 0"
          class="mx-auto flex max-w-md flex-col items-center py-16 text-center"
        >
          <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-rp-surface">
            <UIcon
              name="i-heroicons-heart"
              class="size-12 text-rp-muted"
              aria-hidden="true"
            />
          </div>
          <h2 class="text-xl font-semibold text-rp-text md:text-2xl">
            {{ $t('favorites.emptyTitle') }}
          </h2>
          <p class="mt-2 text-rp-subtle">
            {{ $t('favorites.emptyDesc') }}
          </p>
          <NuxtLink
            :to="localePath('/')"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-rp-iris px-6 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
          >
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="size-5"
              aria-hidden="true"
            />
            {{ $t('favorites.exploreAnime') }}
          </NuxtLink>
        </div>

        <!-- Favorites Grid -->
        <template v-else>
          <!-- Controls -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
            <p class="text-sm text-rp-subtle">
              {{ $t('favorites.showing', { count: favoritesCount }) }}
            </p>

            <div class="flex items-center gap-3">
              <!-- Clear All Button -->
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg bg-rp-love/10 px-3 py-2 text-sm text-rp-love transition-all hover:bg-rp-love/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
                @click="showClearConfirm = true"
              >
                <UIcon
                  name="i-heroicons-trash"
                  class="size-4"
                  aria-hidden="true"
                />
                <span class="hidden sm:inline">{{ $t('favorites.clearAll') }}</span>
              </button>

              <!-- Sort Buttons with Animated Indicator -->
              <div
                ref="sortContainerRef"
                class="relative flex rounded-xl bg-rp-surface/80 p-1 ring-1 ring-rp-overlay/50 backdrop-blur-sm"
                role="group"
                :aria-label="$t('favorites.sortLabel')"
              >
                <!-- Animated background indicator -->
                <div
                  class="sort-indicator absolute inset-y-1 rounded-lg bg-linear-to-r from-rp-iris to-rp-love shadow-lg shadow-rp-iris/25 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  :style="indicatorStyle"
                />

                <UTooltip
                  v-for="option in sortOptions"
                  :key="option.value"
                  :text="option.label"
                  :delay-duration="200"
                >
                  <button
                    :data-sort="option.value"
                    type="button"
                    :aria-pressed="sortBy === option.value"
                    :aria-label="option.label"
                    class="sort-button relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
                    :class="sortBy === option.value ? 'text-white' : 'text-rp-subtle hover:text-rp-text'"
                    @click="preferencesStore.setFavoritesSortBy(option.value)"
                  >
                    <UIcon
                      :name="option.icon"
                      class="size-4 transition-transform duration-200"
                      :class="sortBy === option.value ? 'scale-110' : 'scale-100'"
                      aria-hidden="true"
                    />
                    <span class="hidden xs:inline">{{ option.label }}</span>
                  </button>
                </UTooltip>
              </div>
            </div>
          </div>

          <!-- Grid -->
          <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
          >
            <AnimeCard
              v-for="anime in displayedFavorites"
              :key="anime.mal_id"
              :anime="anime"
              animate-on-remove
            />
          </div>

          <!-- Pagination -->
          <UiPagination
            v-model:current-page="currentPage"
            :total-pages="totalPages"
            class="mt-8"
            @update:current-page="scrollToTop"
          />
        </template>
      </UContainer>
    </section>

    <!-- Clear Confirmation Modal -->
    <UiModal
      v-model:open="showClearConfirm"
      aria-labelled-by="clear-dialog-title"
      content-class="max-w-sm"
    >
      <div
        class="p-6 text-center"
        role="alertdialog"
        aria-describedby="clear-dialog-desc"
      >
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/20">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="size-8 text-rp-love"
            aria-hidden="true"
          />
        </div>
        <h3
          id="clear-dialog-title"
          class="text-lg font-semibold text-rp-text"
        >
          {{ $t('favorites.clearConfirmTitle') }}
        </h3>
        <p
          id="clear-dialog-desc"
          class="mt-2 text-sm text-rp-subtle"
        >
          {{ $t('favorites.clearConfirmDesc') }}
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            @click="showClearConfirm = false"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-rp-love px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rp-love/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            @click="handleClearAll"
          >
            {{ $t('favorites.clearAll') }}
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { PAGINATION } from '~~/shared/constants/api'

const { t } = useI18n()
const localePath = useLocalePath()
const favoritesStore = useFavoritesStore()
const preferencesStore = usePreferencesStore()
const { favoritesCount } = storeToRefs(favoritesStore)
const { favoritesSortBy: sortBy } = storeToRefs(preferencesStore)

const showClearConfirm = ref(false)
const currentPage = ref(1)
const itemsPerPage = PAGINATION.DEFAULT_LIMIT

// Ref for sort container
const sortContainerRef = ref<HTMLElement | null>(null)
const indicatorReady = ref(false)

// Ensure indicator renders after buttons are mounted
onMounted(() => {
  nextTick(() => {
    indicatorReady.value = true
  })
})

const sortOptions = computed(() => [
  { value: 'recent' as const, label: t('favorites.sortRecent'), icon: 'i-heroicons-clock' },
  { value: 'score' as const, label: t('favorites.sortScore'), icon: 'i-heroicons-star' },
  { value: 'title' as const, label: t('favorites.sortTitle'), icon: 'i-heroicons-bars-arrow-down' },
])

// Calculate indicator position based on active button
const indicatorStyle = computed(() => {
  // Force reactivity on indicatorReady and sortBy
  if (!indicatorReady.value || !sortContainerRef.value) {
    return { left: '4px', width: '0px', opacity: '0' }
  }

  const activeButton = sortContainerRef.value.querySelector(`[data-sort="${sortBy.value}"]`) as HTMLElement | null

  if (!activeButton) {
    return { left: '4px', width: '0px', opacity: '0' }
  }

  return {
    left: `${activeButton.offsetLeft}px`,
    width: `${activeButton.offsetWidth}px`,
    opacity: '1',
  }
})

// Get sorted favorites based on current sort option
const sortedFavorites = computed(() => {
  switch (sortBy.value) {
    case 'score':
      return favoritesStore.sortedByScore
    case 'title':
      return favoritesStore.sortedByTitle
    default:
      return favoritesStore.sortedByRecent
  }
})

// Pagination
const totalPages = computed(() => Math.ceil(favoritesCount.value / itemsPerPage))

const displayedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedFavorites.value.slice(start, end)
})

// Reset to page 1 when sort changes
watch(sortBy, () => {
  currentPage.value = 1
})

// Ensure current page is valid when favorites are removed
watch(favoritesCount, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value
  }
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleClearAll = () => {
  favoritesStore.clearFavorites()
  showClearConfirm.value = false
}

useSeoMeta({
  title: () => `${t('favorites.title')} | VueNime`,
  description: () => t('favorites.subtitle'),
})
</script>

<style scoped>
/* Glow effect for the indicator */
.sort-indicator {
  will-change: left, width;
}

.sort-indicator::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(to right, var(--rp-iris), var(--rp-love));
  opacity: 0.4;
  filter: blur(8px);
  z-index: -1;
}

/* Hover effect for inactive buttons */
.sort-button:not([aria-pressed='true']):hover {
  background: rgba(110, 106, 134, 0.15);
}

/* Active button icon animation */
.sort-button[aria-pressed='true'] .size-4 {
  animation: pulse-icon 0.3s ease-out;
}

@keyframes pulse-icon {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
