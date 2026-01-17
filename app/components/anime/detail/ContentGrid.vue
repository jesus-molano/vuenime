<template>
  <section class="relative overflow-x-hidden bg-rp-base py-6 sm:py-8 md:py-10">
    <!-- Subtle gradient background -->
    <div class="absolute inset-0 bg-linear-to-b from-rp-surface/30 to-transparent" />

    <UContainer class="relative overflow-hidden">
      <div class="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
        <!-- Synopsis Column -->
        <div class="min-w-0">
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
          <div class="relative overflow-hidden">
            <p
              class="break-words text-sm leading-relaxed text-rp-subtle sm:text-base"
              :class="[isExpanded ? '' : 'line-clamp-6 sm:line-clamp-10 lg:line-clamp-14']"
            >
              {{ synopsis || $t('common.noResults') }}
            </p>

            <!-- Gradient fade when collapsed -->
            <div
              v-if="!isExpanded && isLongText"
              class="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-rp-base to-transparent sm:h-10"
            />
          </div>

          <!-- Expand/collapse button -->
          <button
            v-if="isLongText"
            type="button"
            class="mt-3 flex items-center gap-1 text-xs font-medium text-rp-iris transition-colors hover:text-rp-iris/80 sm:mt-4 sm:gap-1.5 sm:text-sm"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? $t('anime.showLess') : $t('common.readMore') }}
            <UIcon
              :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="size-3.5 sm:size-4"
            />
          </button>
        </div>

        <!-- Episodes Column -->
        <div
          v-if="hasEpisodes || isLoading"
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
                <p
                  v-if="displayEpisodeCount"
                  class="text-xs text-rp-subtle sm:text-sm"
                >
                  {{ displayEpisodeCount }} {{ $t('anime.eps') }}
                </p>
              </div>
            </div>

            <!-- View toggle -->
            <div class="flex items-center gap-0.5 rounded-md bg-rp-surface p-0.5 sm:gap-1 sm:rounded-lg sm:p-1">
              <button
                type="button"
                class="rounded p-1 transition-colors sm:rounded-md sm:p-1.5"
                :class="viewMode === 'list' ? 'bg-rp-overlay text-rp-text' : 'text-rp-subtle hover:text-rp-text'"
                @click="viewMode = 'list'"
              >
                <UIcon
                  name="i-heroicons-bars-3"
                  class="size-3.5 sm:size-4"
                />
              </button>
              <button
                type="button"
                class="rounded p-1 transition-colors sm:rounded-md sm:p-1.5"
                :class="viewMode === 'grid' ? 'bg-rp-overlay text-rp-text' : 'text-rp-subtle hover:text-rp-text'"
                @click="viewMode = 'grid'"
              >
                <UIcon
                  name="i-heroicons-squares-2x2"
                  class="size-3.5 sm:size-4"
                />
              </button>
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
              <a
                v-for="episode in displayedEpisodes"
                :key="episode.mal_id"
                :href="episode.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-2 rounded-lg border border-transparent bg-rp-surface p-2 transition-all duration-300 hover:border-rp-iris/30 hover:bg-rp-overlay hover:shadow-lg hover:shadow-rp-iris/5 sm:gap-3 sm:rounded-xl sm:p-3"
              >
                <!-- Episode number badge -->
                <div
                  class="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-linear-to-br from-rp-iris/20 to-rp-iris/5 text-sm font-bold text-rp-iris transition-all duration-300 group-hover:from-rp-iris group-hover:to-rp-iris/80 group-hover:text-white sm:size-10 sm:rounded-lg sm:text-base"
                >
                  <span class="relative z-10">{{ episode.mal_id }}</span>
                </div>

                <!-- Episode info -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <h4
                      class="truncate text-xs font-semibold text-rp-text transition-colors group-hover:text-rp-iris sm:text-sm"
                    >
                      {{ episode.title || $t('anime.episode') + ' ' + episode.mal_id }}
                    </h4>
                    <!-- Tags - mobile (inline dots) -->
                    <div
                      v-if="episode.filler || episode.recap"
                      class="flex shrink-0 items-center gap-0.5 sm:hidden"
                    >
                      <span
                        v-if="episode.filler"
                        class="size-1.5 rounded-full bg-rp-gold"
                        title="Filler"
                      />
                      <span
                        v-if="episode.recap"
                        class="size-1.5 rounded-full bg-rp-foam"
                        title="Recap"
                      />
                    </div>
                  </div>
                  <div
                    class="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-rp-subtle sm:gap-2 sm:text-xs"
                  >
                    <span
                      v-if="episode.aired"
                      class="flex items-center gap-0.5 sm:gap-1"
                    >
                      <UIcon
                        name="i-heroicons-calendar"
                        class="size-2.5 sm:size-3"
                      />
                      {{ formatDate(episode.aired) }}
                    </span>
                    <span
                      v-if="episode.score"
                      class="flex items-center gap-0.5 sm:gap-1"
                    >
                      <UIcon
                        name="i-heroicons-star-solid"
                        class="size-2.5 text-rp-gold sm:size-3"
                      />
                      {{ episode.score.toFixed(1) }}
                    </span>
                  </div>
                </div>

                <!-- Tags - desktop -->
                <div class="hidden items-center gap-1 sm:flex">
                  <span
                    v-if="episode.filler"
                    class="rounded-full bg-rp-gold/20 px-2 py-0.5 text-[10px] font-medium text-rp-gold"
                  >
                    Filler
                  </span>
                  <span
                    v-if="episode.recap"
                    class="rounded-full bg-rp-foam/20 px-2 py-0.5 text-[10px] font-medium text-rp-foam"
                  >
                    Recap
                  </span>
                </div>

                <!-- Arrow -->
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="size-3.5 text-rp-muted opacity-0 transition-all group-hover:text-rp-iris group-hover:opacity-100 sm:size-4"
                />
              </a>
            </TransitionGroup>
          </div>

          <!-- Grid view -->
          <div
            v-else
            class="grid max-h-112 grid-cols-4 gap-1.5 overflow-y-auto scrollbar-none sm:grid-cols-5 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5"
          >
            <TransitionGroup name="episode-grid">
              <a
                v-for="episode in displayedEpisodes"
                :key="episode.mal_id"
                :href="episode.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative flex flex-col items-center justify-center rounded-lg border border-transparent bg-rp-surface p-2 text-center transition-all duration-300 hover:border-rp-iris/30 hover:bg-rp-overlay hover:shadow-lg hover:shadow-rp-iris/5 sm:rounded-xl sm:p-3"
              >
                <!-- Episode number -->
                <div
                  class="mb-1 flex size-8 items-center justify-center rounded-md bg-linear-to-br from-rp-iris/20 to-rp-iris/5 text-sm font-bold text-rp-iris transition-all duration-300 group-hover:scale-110 group-hover:from-rp-iris group-hover:to-rp-iris/80 group-hover:text-white sm:mb-2 sm:size-10 sm:rounded-lg sm:text-lg"
                >
                  {{ episode.mal_id }}
                </div>

                <!-- Title -->
                <h4
                  class="line-clamp-1 text-[10px] font-medium text-rp-text transition-colors group-hover:text-rp-iris sm:line-clamp-2 sm:text-xs"
                >
                  {{ episode.title || $t('anime.episode') + ' ' + episode.mal_id }}
                </h4>

                <!-- Badges -->
                <div
                  v-if="episode.filler || episode.recap"
                  class="absolute right-1 top-1 flex gap-0.5 sm:right-1.5 sm:top-1.5"
                >
                  <span
                    v-if="episode.filler"
                    class="size-1.5 rounded-full bg-rp-gold"
                    title="Filler"
                  />
                  <span
                    v-if="episode.recap"
                    class="size-1.5 rounded-full bg-rp-foam"
                    title="Recap"
                  />
                </div>
              </a>
            </TransitionGroup>
          </div>

          <!-- Show more/less and Load more buttons -->
          <div class="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <!-- Show all/less toggle for current loaded episodes -->
            <button
              v-if="episodes.length > initialCount && !showAll"
              type="button"
              class="group flex items-center gap-1.5 rounded-full bg-rp-iris px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rp-iris/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rp-iris/30 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
              @click="showAll = true"
            >
              {{ $t('anime.showAllEpisodes', { count: episodes.length }) }}
              <UIcon
                name="i-heroicons-chevron-down"
                class="size-3.5 transition-transform group-hover:translate-y-0.5 sm:size-4"
              />
            </button>
            <button
              v-else-if="showAll && episodes.length > initialCount"
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
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  synopsis: string | null | undefined
  animeId: string
  totalEpisodes: number | null
}>()

const { locale } = useI18n()
const { episodes, isLoading, isLoadingMore, hasEpisodes, hasNextPage, loadMore } = useAnimeEpisodes(props.animeId)

const isExpanded = ref(false)
const isLongText = computed(() => (props.synopsis?.length ?? 0) > 500)

const initialCount = 10
const showAll = ref(false)
const viewMode = ref<'list' | 'grid'>('list')

const displayedEpisodes = computed(() => {
  if (showAll.value) return episodes.value
  return episodes.value.slice(0, initialCount)
})

// Use prop totalEpisodes if available, otherwise show loaded count with + if there are more pages
const displayEpisodeCount = computed(() => {
  if (props.totalEpisodes) return props.totalEpisodes
  if (episodes.value.length > 0) {
    return hasNextPage.value ? `${episodes.value.length}+` : episodes.value.length
  }
  return null
})

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale.value, {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}
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
