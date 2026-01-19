<template>
  <div
    id="tabpanel-recommendations"
    role="tabpanel"
    aria-labelledby="tab-recommendations"
    class="pb-20 sm:pb-0"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      <AnimeCardSkeleton
        v-for="i in 10"
        :key="i"
      />
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="recommendations.length === 0"
      icon="i-heroicons-hand-thumb-up"
      :message="$t('detail.noRecommendations')"
    />

    <!-- Recommendations Grid -->
    <div
      v-else
      class="space-y-4"
    >
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <AnimeCard
          v-for="anime in displayedItems"
          :key="anime.mal_id"
          :anime="anime"
        />
      </div>

      <UiShowMoreButton
        :show="hasMore"
        :count="remainingCount"
        @click="loadMore"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types'

const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => props.animeId)
const { recommendations, isLoading } = useAnimeRecommendations(animeIdRef)

// Map recommendations to Anime-compatible objects for AnimeCard
const mappedAnime = computed<Anime[]>(() =>
  recommendations.value.map((rec) => ({
    mal_id: rec.entry.mal_id,
    title: rec.entry.title,
    images: {
      jpg: {
        image_url: rec.entry.images.jpg?.image_url || '',
        small_image_url: rec.entry.images.jpg?.small_image_url || '',
        large_image_url: rec.entry.images.jpg?.large_image_url || '',
      },
      webp: {
        image_url: rec.entry.images.webp?.image_url || '',
        small_image_url: rec.entry.images.webp?.small_image_url || '',
        large_image_url: rec.entry.images.webp?.large_image_url || rec.entry.images.jpg?.large_image_url || '',
      },
    },
    // Required fields - not available from recommendations API
    url: '',
    trailer: {
      youtube_id: null,
      url: null,
      embed_url: null,
      images: {
        image_url: null,
        small_image_url: null,
        medium_image_url: null,
        large_image_url: null,
        maximum_image_url: null,
      },
    },
    approved: true,
    titles: [],
    title_english: null,
    title_japanese: null,
    title_synonyms: [],
    type: null,
    source: null,
    episodes: null,
    status: null,
    airing: false,
    aired: { from: null, to: null, string: '' },
    duration: null,
    rating: null,
    score: null,
    scored_by: null,
    rank: null,
    popularity: null,
    members: null,
    favorites: null,
    synopsis: null,
    background: null,
    season: null,
    year: null,
    genres: [],
    themes: [],
    demographics: [],
    studios: [],
  }))
)

const { displayedItems, hasMore, remainingCount, loadMore } = useShowMore(mappedAnime, {
  initialCount: 10,
  pageSize: 10,
})
</script>
