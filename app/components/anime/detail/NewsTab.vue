<template>
  <div
    id="tabpanel-news"
    role="tabpanel"
    aria-labelledby="tab-news"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="space-y-4"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="animate-pulse rounded-lg border border-rp-overlay/50 bg-rp-surface p-4"
      >
        <div class="flex gap-4">
          <div class="h-20 w-32 shrink-0 rounded-lg bg-rp-overlay" />
          <div class="flex-1">
            <div class="h-4 w-3/4 rounded bg-rp-overlay" />
            <div class="mt-2 h-3 w-full rounded bg-rp-overlay" />
            <div class="mt-1 h-3 w-2/3 rounded bg-rp-overlay" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="news.length === 0"
      icon="i-heroicons-newspaper"
      :message="$t('detail.noNews')"
    />

    <!-- News List -->
    <div
      v-else
      class="space-y-4"
    >
      <AnimeDetailNewsCard
        v-for="item in displayedItems"
        :key="item.mal_id"
        :news="item"
      />

      <UiShowMoreButton
        :show="hasMore"
        :count="remainingCount"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => props.animeId)
const { news, isLoading } = useAnimeNews(animeIdRef)

const { displayedItems, hasMore, remainingCount, loadMore } = useShowMore(news, {
  initialCount: 5,
  showAll: true,
})
</script>
