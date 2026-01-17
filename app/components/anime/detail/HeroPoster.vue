<template>
  <div class="poster-container relative mx-auto w-44 shrink-0 md:mx-0 md:w-60 lg:w-72">
    <div class="absolute -inset-6 rounded-3xl bg-rp-iris/30 blur-3xl" />
    <div class="absolute -inset-4 rounded-3xl bg-rp-rose/20 blur-2xl" />

    <div
      class="group relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/20 transition-all duration-700 hover:scale-[1.02] hover:shadow-rp-iris/30"
    >
      <NuxtImg
        :src="anime.images.webp.large_image_url"
        :alt="$t('anime.coverAlt', { title: anime.title })"
        :style="posterStyle"
        class="aspect-3/4 w-full object-cover"
        placeholder
      />

      <div
        class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
      />

      <UiScoreBadge
        v-if="anime.score"
        :score="anime.score"
        size="md"
        class="absolute right-3 top-3"
      />

      <UiAiringBadge
        v-if="anime.airing"
        size="md"
        class="absolute left-3 top-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const { posterStyle } = usePosterTransition(() => props.anime.mal_id)
</script>
