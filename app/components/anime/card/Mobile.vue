<template>
  <NuxtLink
    :to="animeLink"
    :view-transition="true"
    class="flex sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
    :aria-labelledby="`anime-title-mobile-${anime.mal_id}`"
  >
    <AnimeCardPoster
      :image-url="anime.images.webp.large_image_url"
      :title="anime.title"
      :score="anime.score"
      size="sm"
      container-class="h-32 w-24 shrink-0"
      :image-style="{ viewTransitionName: `poster-${anime.mal_id}` }"
      score-position="top-right"
    />

    <div class="flex flex-1 flex-col justify-center gap-1.5 p-3">
      <div class="flex items-start justify-between gap-2">
        <h3
          :id="`anime-title-mobile-${anime.mal_id}`"
          class="line-clamp-2 flex-1 text-sm font-bold text-rp-text"
        >
          {{ anime.title }}
        </h3>
        <AnimeCardFavoriteButton
          :is-favorite="isFavorite"
          :is-animating="isAnimating"
          variant="mobile"
          @toggle="$emit('toggle-favorite')"
        />
      </div>

      <AnimeCardInfo
        :year="anime.year"
        :episodes="anime.episodes"
        size="xs"
      />
      <AnimeCardGenres
        :genres="anime.genres"
        size="xs"
      />
      <UiAiringBadge
        v-if="anime.airing"
        size="xs"
        class="mt-0.5 w-fit"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'
import type { FavoriteAnime } from '~/types/favorites'

interface Props {
  anime: Anime | FavoriteAnime
  animeLink: string
  isFavorite: boolean
  isAnimating: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-favorite': []
}>()
</script>
