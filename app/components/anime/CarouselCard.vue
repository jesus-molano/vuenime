<template>
  <NuxtLink
    :to="localePath(`/anime/${anime.mal_id}`)"
    class="group block overflow-hidden rounded-xl border border-white/8 bg-rp-surface/95 transition-all hover:border-white/15 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
  >
    <!-- Poster - uses medium image for carousels (smaller file size, sufficient quality) -->
    <div class="relative aspect-3/4 overflow-hidden">
      <NuxtImg
        :src="imageUrl"
        :alt="$t('anime.coverAlt', { title: anime.title })"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        placeholder
      />

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <!-- Score badge -->
      <UiScoreBadge
        v-if="anime.score"
        :score="anime.score"
        size="xs"
        class="absolute right-1.5 top-1.5"
      />

      <!-- Airing badge -->
      <UiAiringBadge
        v-if="anime.airing"
        size="xs"
        class="absolute left-1.5 top-1.5"
      />

      <!-- Title overlay at bottom -->
      <div class="absolute inset-x-0 bottom-0 p-2">
        <h3
          class="line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow-lg transition-colors group-hover:text-rp-iris sm:text-sm"
        >
          {{ anime.title }}
        </h3>
        <div class="mt-1 flex items-center gap-1.5 text-[10px] text-white/70">
          <span v-if="anime.year">{{ anime.year }}</span>
          <span v-if="anime.year && anime.episodes">•</span>
          <span v-if="anime.episodes">{{ anime.episodes }} {{ $t('anime.eps') }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types'
import { getResponsiveImageUrl } from '~/utils/responsive-image'

const props = defineProps<{
  anime: Anime
}>()

const localePath = useLocalePath()

// Use medium-sized image for carousel cards (smaller file size, sufficient for card dimensions)
// Carousel cards are max w-44 (176px), so medium (~100x141px) scales up nicely
const imageUrl = computed(() => getResponsiveImageUrl(props.anime.images, 'medium'))
</script>
