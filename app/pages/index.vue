<template>
  <div>
    <!-- Hero Section -->
    <HomeHero />

    <!-- Anime Grid Section -->
    <section class="py-6 sm:py-8 md:py-12">
      <UContainer class="px-4 sm:px-6">
        <!-- Section header -->
        <div class="mb-4 flex items-center justify-between sm:mb-6 md:mb-8">
          <div>
            <h2 class="text-lg font-bold text-rp-text sm:text-xl md:text-2xl">{{ $t('home.trending') }}</h2>
            <p class="text-[10px] text-rp-muted sm:text-xs md:text-sm">
              <ClientOnly fallback-tag="span">
                <template v-if="animeList.length > 0 && totalItems > 0">
                  {{ $t('home.showingCount', { current: animeList.length, total: totalItems }) }}
                </template>
                <template v-else>
                  {{ $t('home.trendingSubtitle') }}
                </template>
                <template #fallback>
                  {{ $t('home.trendingSubtitle') }}
                </template>
              </ClientOnly>
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
        >
          <AnimeCardSkeleton
            v-for="i in 24"
            :key="i"
          />
        </div>

        <!-- Error State -->
        <div
          v-else-if="error && animeList.length === 0"
          class="flex flex-col items-center justify-center py-12 md:py-20"
          role="alert"
        >
          <div class="mb-4 rounded-full bg-rp-love/10 p-3 md:p-4">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="size-6 text-rp-love md:size-8"
              aria-hidden="true"
            />
          </div>
          <p class="mb-4 text-sm text-rp-subtle md:text-base">{{ error.message }}</p>
          <button
            type="button"
            class="rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay md:rounded-xl md:px-6 md:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
            @click="refresh()"
          >
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Anime Grid -->
        <div
          v-else
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
        >
          <AnimeCard
            v-for="anime in animeList"
            :key="anime.mal_id"
            :anime="anime"
          />
        </div>

        <!-- Load More Trigger -->
        <div
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
            v-else-if="!hasNextPage && animeList.length > 0"
            class="text-sm text-rp-muted"
          >
            {{ $t('home.endOfList') }}
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Back to Top -->
    <UiBackToTop />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Anime list data
const { animeList, isLoading, isLoadingMore, hasNextPage, totalItems, error, loadMoreError, loadMore, refresh } =
  useAnimeList()

// Infinite scroll
const { triggerRef } = useInfiniteScroll({
  hasMore: hasNextPage,
  isLoading: isLoadingMore,
  hasError: loadMoreError,
  onLoadMore: loadMore,
})

// SEO
useSeoMeta({
  title: `VueNime - ${t('home.title')} ${t('home.titleHighlight')}`,
  description: t('home.subtitle'),
  ogTitle: `VueNime - ${t('home.title')} ${t('home.titleHighlight')}`,
  ogDescription: t('home.subtitle'),
})
</script>
