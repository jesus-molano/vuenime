<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Hero -->
    <FavoritesHero />

    <!-- Main Content -->
    <section
      v-scroll-reveal.fade-up
      class="pb-16 md:pb-24"
    >
      <UContainer class="px-4 sm:px-6">
        <ClientOnly>
          <!-- Loading skeleton (while fetching from Supabase) -->
          <template v-if="isLoading">
            <FavoritesGridSkeleton />
          </template>

          <!-- Empty State -->
          <FavoritesEmptyState v-else-if="isEmpty" />

          <!-- Favorites Grid -->
          <template v-else>
            <!-- Controls -->
            <FavoritesControls @clear="showClearConfirm = true" />

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

          <!-- SSR fallback skeleton -->
          <template #fallback>
            <FavoritesGridSkeleton />
          </template>
        </ClientOnly>
      </UContainer>
    </section>

    <!-- Clear Confirmation Modal -->
    <FavoritesClearModal
      v-model:open="showClearConfirm"
      @confirm="clearAll"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { currentPage, totalPages, displayedFavorites, isEmpty, isLoading, scrollToTop, clearAll } = useFavoritesList()

const showClearConfirm = ref(false)

useSeoMeta({
  title: () => `${t('favorites.title')} | VueNime`,
  description: () => t('favorites.subtitle'),
})
</script>
