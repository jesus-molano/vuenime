<template>
  <section class="relative overflow-x-hidden bg-rp-base py-6 sm:py-8 md:py-10">
    <!-- Subtle gradient background -->
    <div class="absolute inset-0 bg-linear-to-b from-rp-surface/30 to-transparent" />

    <UContainer class="relative overflow-hidden">
      <div
        :class="['grid min-w-0 gap-6 sm:gap-8 lg:gap-12', shouldShowTwoColumns ? 'lg:grid-cols-2' : 'lg:grid-cols-1']"
      >
        <!-- Synopsis Column -->
        <div
          v-scroll-reveal.fade-up
          class="min-w-0"
        >
          <!-- Header -->
          <div class="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
            <div class="flex size-8 items-center justify-center rounded-lg bg-rp-rose/10 sm:size-10 sm:rounded-xl">
              <UIcon
                name="i-heroicons-document-text"
                class="size-4 text-rp-rose sm:size-5"
              />
            </div>
            <h2 class="text-lg font-bold text-rp-text sm:text-xl md:text-2xl">
              {{ $t('anime.synopsis') }}
            </h2>
          </div>

          <!-- Synopsis text -->
          <UiExpandableText
            :text="synopsis"
            :fallback-text="$t('common.noResults')"
          />
        </div>

        <!-- Episodes Column -->
        <ClientOnly>
          <div
            v-if="hasEpisodes || isLoading"
            v-scroll-reveal.fade-up="100"
            class="min-w-0"
          >
            <!-- Header with count -->
            <div class="mb-3 flex items-center justify-between sm:mb-4">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="flex size-8 items-center justify-center rounded-lg bg-rp-iris/20 sm:size-10 sm:rounded-xl">
                  <UIcon
                    name="i-heroicons-play-circle"
                    class="size-4 text-rp-iris sm:size-5"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-rp-text sm:text-xl md:text-2xl">
                    {{ $t('anime.episodes') }}
                  </h2>
                  <div class="flex items-center gap-2 text-xs text-rp-subtle sm:text-sm">
                    <span v-if="displayEpisodeCount">{{ displayEpisodeCount }} {{ $t('anime.eps') }}</span>
                    <span
                      v-if="watchedCount > 0"
                      class="flex items-center gap-1 text-rp-foam"
                    >
                      <UIcon
                        name="i-heroicons-check-circle-solid"
                        class="size-3 sm:size-3.5"
                      />
                      {{ $t('watched.watchedCount', { count: watchedCount }) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Controls -->
              <div class="flex items-center gap-1.5 sm:gap-2">
                <!-- Skip fillers toggle -->
                <UTooltip
                  v-if="hasFillerEpisodes"
                  :text="hideFiller ? $t('episodes.showFillers') : $t('episodes.hideFillers')"
                  :delay-duration="300"
                >
                  <button
                    type="button"
                    class="flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium transition-all"
                    :class="
                      hideFiller ? 'bg-rp-gold/20 text-rp-gold' : 'bg-rp-surface text-rp-subtle hover:text-rp-text'
                    "
                    @click="hideFiller = !hideFiller"
                  >
                    <UIcon
                      :name="hideFiller ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
                      class="size-3.5"
                    />
                    <span class="hidden sm:inline">{{ $t('episodes.filler') }}</span>
                  </button>
                </UTooltip>

                <!-- Watched actions dropdown -->
                <UDropdownMenu
                  v-if="episodes.length > 0"
                  :items="watchedMenuItems"
                  :content="{ align: 'end' }"
                >
                  <button
                    type="button"
                    class="flex h-6 items-center gap-0.5 rounded-md bg-rp-surface px-1.5 text-rp-subtle transition-colors hover:text-rp-text"
                    :title="$t('watched.markAsWatched')"
                  >
                    <UIcon
                      name="i-heroicons-eye"
                      class="size-4"
                    />
                    <UIcon
                      name="i-heroicons-chevron-down"
                      class="size-3"
                    />
                  </button>
                </UDropdownMenu>

                <!-- View toggle -->
                <div class="flex h-6 items-center gap-0.5 rounded-md bg-rp-surface px-0.5">
                  <button
                    v-for="mode in viewModes"
                    :key="mode.value"
                    type="button"
                    class="flex size-5 items-center justify-center rounded transition-colors"
                    :class="
                      viewMode === mode.value ? 'bg-rp-overlay text-rp-text' : 'text-rp-subtle hover:text-rp-text'
                    "
                    :title="mode.label"
                    :aria-label="mode.label"
                    @click="viewMode = mode.value"
                  >
                    <UIcon
                      :name="mode.icon"
                      class="size-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading state -->
            <div
              v-if="isLoading"
              class="space-y-1.5 sm:space-y-2"
            >
              <div
                v-for="i in 5"
                :key="i"
                class="flex animate-pulse items-center gap-2 rounded-lg bg-rp-surface p-2 sm:gap-3 sm:rounded-xl sm:p-3"
              >
                <div class="size-8 shrink-0 rounded-md bg-rp-overlay sm:size-10 sm:rounded-lg" />
                <div class="flex-1 space-y-1.5 sm:space-y-2">
                  <div class="h-3 w-3/4 rounded bg-rp-overlay sm:h-4" />
                  <div class="h-2.5 w-1/2 rounded bg-rp-overlay sm:h-3" />
                </div>
              </div>
            </div>

            <!-- List view -->
            <div
              v-else-if="viewMode === 'list'"
              class="max-h-112 space-y-1.5 overflow-y-auto scrollbar-none sm:space-y-2"
            >
              <TransitionGroup name="episode-list">
                <AnimeDetailEpisodeListItem
                  v-for="episode in displayedEpisodes"
                  :key="episode.mal_id"
                  :episode="episode"
                  :is-watched="isEpisodeWatched(episode.mal_id)"
                  @toggle-watched="toggleWatched(episode.mal_id)"
                />
              </TransitionGroup>
            </div>

            <!-- Grid view -->
            <div
              v-else
              class="grid max-h-112 grid-cols-4 gap-1.5 overflow-y-auto scrollbar-none sm:grid-cols-5 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5"
            >
              <TransitionGroup name="episode-grid">
                <AnimeDetailEpisodeGridItem
                  v-for="episode in displayedEpisodes"
                  :key="episode.mal_id"
                  :episode="episode"
                  :is-watched="isEpisodeWatched(episode.mal_id)"
                  @toggle-watched="toggleWatched(episode.mal_id)"
                />
              </TransitionGroup>
            </div>

            <!-- Show more/less and Load more buttons -->
            <div class="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
              <!-- Show all/less toggle for current loaded episodes -->
              <button
                v-if="filteredEpisodes.length > initialCount && !showAll"
                type="button"
                class="group flex items-center gap-1.5 rounded-full bg-rp-iris px-4 py-2 text-xs font-semibold text-rp-base shadow-lg shadow-rp-iris/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rp-iris/30 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                @click="showAll = true"
              >
                {{ $t('anime.showAllEpisodes', { count: filteredEpisodes.length }) }}
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="size-3.5 transition-transform group-hover:translate-y-0.5 sm:size-4"
                />
              </button>
              <button
                v-else-if="showAll && filteredEpisodes.length > initialCount"
                type="button"
                class="group flex items-center gap-1.5 rounded-full border border-rp-overlay bg-rp-surface px-4 py-2 text-xs font-semibold text-rp-text transition-all hover:border-rp-iris/50 hover:bg-rp-overlay sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                @click="showAll = false"
              >
                {{ $t('anime.showLess') }}
                <UIcon
                  name="i-heroicons-chevron-up"
                  class="size-3.5 transition-transform group-hover:-translate-y-0.5 sm:size-4"
                />
              </button>

              <!-- Load more pages from API -->
              <button
                v-if="hasNextPage && showAll"
                type="button"
                :disabled="isLoadingMore"
                class="group flex items-center gap-1.5 rounded-full bg-rp-foam px-4 py-2 text-xs font-semibold text-rp-base shadow-lg shadow-rp-foam/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rp-foam/30 disabled:opacity-50 disabled:hover:scale-100 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                @click="loadMore"
              >
                <template v-if="isLoadingMore">
                  <UIcon
                    name="i-heroicons-arrow-path"
                    class="size-3.5 animate-spin sm:size-4"
                  />
                  {{ $t('common.loading') }}
                </template>
                <template v-else>
                  {{ $t('anime.loadMoreEpisodes') }}
                  <UIcon
                    name="i-heroicons-plus"
                    class="size-3.5 transition-transform group-hover:rotate-90 sm:size-4"
                  />
                </template>
              </button>
            </div>
          </div>
        </ClientOnly>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  synopsis: string | null | undefined
  animeId: string
  totalEpisodes: number | null
  animeTitle?: string
}>()

const { t } = useI18n()
const { episodes, isLoading, isLoadingMore, hasEpisodes, hasNextPage, loadMore } = useAnimeEpisodes(props.animeId)

// Prevent hydration mismatch by only applying 2-column layout after mount
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const shouldShowTwoColumns = computed(() => isMounted.value && (hasEpisodes.value || isLoading.value))

// Watched episodes functionality
const malId = computed(() => parseInt(props.animeId, 10))
const watchedStore = useWatchedStore()
const { isEpisodeWatched, watchedCount } = useWatchedToggle(malId)

// Toggle watched without notification (UX best practice: avoid repetitive toasts for frequent actions)
async function toggleWatched(episodeNumber: number) {
  await watchedStore.toggleWatched({
    mal_id: malId.value,
    episode_number: episodeNumber,
  })
}

// Mark all as watched with notification
async function markAllAsWatched(total: number) {
  await watchedStore.markAllAsWatched(malId.value, total, props.animeTitle)
}

// Clear all watched with notification
async function clearAllWatched() {
  await watchedStore.clearWatchedForAnime(malId.value, props.animeTitle)
}

const initialCount = 10
const showAll = ref(false)
const viewMode = ref<'list' | 'grid'>('list')
const hideFiller = ref(false)

const viewModes = computed(() => [
  { value: 'list' as const, label: t('anime.viewList'), icon: 'i-heroicons-bars-3' },
  { value: 'grid' as const, label: t('anime.viewGrid'), icon: 'i-heroicons-squares-2x2' },
])

// Check if there are any filler episodes
const hasFillerEpisodes = computed(() => episodes.value.some((ep) => ep.filler))

// Filter episodes based on filler toggle
const filteredEpisodes = computed(() => {
  if (!hideFiller.value) return episodes.value
  return episodes.value.filter((ep) => !ep.filler)
})

// Dropdown menu items for watched actions
const watchedMenuItems = computed(() => [
  [
    {
      label: t('watched.markAllWatched'),
      icon: 'i-heroicons-check-circle',
      onSelect: () => {
        const total = props.totalEpisodes || episodes.value.length
        markAllAsWatched(total)
      },
    },
    {
      label: t('watched.clearAllWatched'),
      icon: 'i-heroicons-x-circle',
      onSelect: () => clearAllWatched(),
      disabled: watchedCount.value === 0,
    },
  ],
])

const displayedEpisodes = computed(() => {
  if (showAll.value) return filteredEpisodes.value
  return filteredEpisodes.value.slice(0, initialCount)
})

// Use prop totalEpisodes if available, otherwise show loaded count with + if there are more pages
const displayEpisodeCount = computed(() => {
  if (props.totalEpisodes) return props.totalEpisodes
  if (episodes.value.length > 0) {
    return hasNextPage.value ? `${episodes.value.length}+` : episodes.value.length
  }
  return null
})
</script>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.episode-list-enter-active,
.episode-list-leave-active,
.episode-grid-enter-active,
.episode-grid-leave-active {
  transition: all 0.3s ease;
}

.episode-list-enter-from,
.episode-grid-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.episode-list-leave-to,
.episode-grid-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
