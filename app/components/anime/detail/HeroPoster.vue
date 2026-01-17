<template>
  <div class="relative mx-auto w-44 shrink-0 md:mx-0 md:w-60 lg:w-72">
    <!-- Glow Effect Behind Poster -->
    <div class="absolute -inset-6 rounded-3xl bg-rp-iris/30 blur-3xl" />
    <div class="absolute -inset-4 rounded-3xl bg-rp-rose/20 blur-2xl" />

    <div
      class="group relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/20 transition-all duration-700 hover:scale-[1.02] hover:shadow-rp-iris/30"
    >
      <img
        :src="anime.images.webp.large_image_url"
        :alt="$t('anime.coverAlt', { title: anime.title })"
        :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
        class="aspect-3/4 w-full object-cover"
      >

      <!-- Shimmer effect on hover -->
      <div
        class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
      />

      <!-- Score Badge -->
      <div
        v-if="anime.score"
        class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5 backdrop-blur-md"
      >
        <UIcon
          name="i-heroicons-star-solid"
          class="size-4 text-rp-gold"
        />
        <span class="text-sm font-bold text-white">{{ anime.score.toFixed(1) }}</span>
      </div>

      <!-- Airing badge -->
      <div
        v-if="anime.airing"
        class="absolute left-3 top-3 rounded-full bg-rp-foam px-2.5 py-1 text-xs font-bold text-rp-base"
      >
        {{ $t('anime.airing') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

defineProps<{
  anime: Anime
}>()
</script>
