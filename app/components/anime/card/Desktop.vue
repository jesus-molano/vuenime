<template>
  <div class="relative hidden aspect-[3/4.2] overflow-hidden sm:block">
    <NuxtLink
      :to="animeLink"
      :view-transition="true"
      class="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
      :aria-labelledby="`anime-title-desktop-${anime.mal_id}`"
    >
      <NuxtImg
        :src="anime.images.webp.large_image_url"
        :alt="$t('anime.coverAlt', { title: anime.title })"
        :style="posterStyle"
        class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
        draggable="false"
        loading="lazy"
        placeholder
      />
    </NuxtLink>

    <!-- Overlay gradient -->
    <div
      class="card-overlay card-content-fade pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"
    />

    <!-- Glare effect -->
    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :style="glareStyle"
    />

    <!-- Badges -->
    <UiScoreBadge
      v-if="anime.score"
      :score="anime.score"
      size="sm"
      position="top-right"
      class="card-content-fade"
    />
    <UiAiringBadge
      v-if="anime.airing"
      size="sm"
      position="top-left"
      class="card-content-fade"
    />

    <!-- Content -->
    <div class="card-content-fade absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 md:gap-2 md:p-4">
      <h3
        :id="`anime-title-desktop-${anime.mal_id}`"
        class="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-lg transition-colors duration-300 group-hover:text-rp-iris md:text-base"
      >
        {{ anime.title }}
      </h3>

      <AnimeCardInfo
        :year="anime.year"
        :episodes="anime.episodes"
        size="sm"
      />
      <AnimeCardGenres
        :genres="anime.genres"
        size="sm"
      />
    </div>

    <!-- Favorite button -->
    <AnimeCardFavoriteButton
      :is-favorite="isFavorite"
      :is-animating="isAnimating"
      variant="desktop"
      class="card-content-fade absolute bottom-3 right-3 md:bottom-4 md:right-4"
      @toggle="$emit('toggle-favorite')"
    />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Anime } from '~~/shared/types/anime'
import type { FavoriteAnime } from '~/types/favorites'

interface Props {
  anime: Anime | FavoriteAnime
  animeLink: string
  isFavorite: boolean
  isAnimating: boolean
  posterStyle: CSSProperties
  glareStyle: CSSProperties
}

defineProps<Props>()
defineEmits<{
  'toggle-favorite': []
}>()
</script>
