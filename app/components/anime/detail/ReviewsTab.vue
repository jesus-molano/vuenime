<template>
  <div
    id="tabpanel-reviews"
    role="tabpanel"
    aria-labelledby="tab-reviews"
    class="pb-20 sm:pb-0"
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
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full bg-rp-overlay" />
          <div class="flex-1">
            <div class="h-4 w-24 rounded bg-rp-overlay" />
            <div class="mt-1 h-3 w-16 rounded bg-rp-overlay" />
          </div>
        </div>
        <div class="mt-3 space-y-2">
          <div class="h-3 w-full rounded bg-rp-overlay" />
          <div class="h-3 w-4/5 rounded bg-rp-overlay" />
          <div class="h-3 w-3/5 rounded bg-rp-overlay" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="reviews.length === 0"
      icon="i-heroicons-chat-bubble-left-right"
      :message="$t('detail.noReviews')"
    />

    <!-- Reviews List -->
    <div
      v-else
      class="space-y-4"
    >
      <AnimeDetailReviewCard
        v-for="review in displayedItems"
        :key="review.mal_id"
        :review="review"
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
const { reviews, isLoading } = useAnimeReviews(animeIdRef)

const { displayedItems, hasMore, remainingCount, loadMore } = useShowMore(reviews, {
  initialCount: 3,
  showAll: true,
})
</script>
