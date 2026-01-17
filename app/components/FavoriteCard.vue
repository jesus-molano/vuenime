<template>
  <div class="group relative">
    <NuxtLink
      :to="`/anime/${anime.mal_id}`"
      class="block overflow-hidden rounded-lg bg-rp-surface shadow-md transition-all duration-300 hover:shadow-rp-iris/20 sm:rounded-xl sm:shadow-lg md:rounded-2xl md:shadow-2xl"
    >
      <!-- Image -->
      <div class="relative aspect-3/4 overflow-hidden">
        <img
          :src="anime.images.webp.large_image_url"
          :alt="anime.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        >

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-rp-base via-transparent to-transparent" />

        <!-- Score badge -->
        <div
          v-if="anime.score"
          class="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-gradient-rp-score px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg md:right-3 md:top-3 md:gap-1 md:px-2.5 md:py-1 md:text-xs"
        >
          <UIcon name="i-heroicons-star-solid" class="size-2.5 md:size-3.5" />
          {{ anime.score.toFixed(1) }}
        </div>

        <!-- Airing badge -->
        <div
          v-if="anime.airing"
          class="absolute left-2 top-2 rounded-full bg-rp-foam/90 px-1.5 py-0.5 text-[10px] font-semibold text-rp-base md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-xs"
        >
          {{ $t('anime.airing') }}
        </div>

        <!-- Content over image -->
        <div class="absolute inset-x-0 bottom-0 p-2 md:p-4">
          <h3 class="line-clamp-2 text-xs font-bold text-rp-text transition-colors group-hover:text-rp-iris md:text-sm lg:text-base">
            {{ anime.title }}
          </h3>

          <div class="mt-0.5 flex items-center gap-2 text-[9px] text-rp-subtle md:gap-3 md:text-xs">
            <span v-if="anime.year" class="flex items-center gap-0.5 md:gap-1">
              <UIcon name="i-heroicons-calendar" class="size-2.5 md:size-3.5" />
              {{ anime.year }}
            </span>
            <span v-if="anime.episodes" class="flex items-center gap-0.5 md:gap-1">
              <UIcon name="i-heroicons-play" class="size-2.5 md:size-3.5" />
              {{ anime.episodes }} {{ $t('anime.eps') }}
            </span>
          </div>

          <!-- Genres -->
          <div class="mt-1 flex flex-wrap gap-1 md:mt-2">
            <span
              v-for="genre in anime.genres?.slice(0, 2)"
              :key="genre.mal_id"
              class="rounded-full bg-rp-overlay/80 px-1.5 py-0.5 text-[10px] text-rp-subtle backdrop-blur-sm md:px-2 md:text-xs"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Remove button -->
    <button
      class="absolute -right-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full bg-rp-love text-white opacity-0 shadow-lg transition-all duration-200 hover:bg-rp-love/80 group-hover:opacity-100"
      :aria-label="$t('anime.removeFavorite')"
      @click.stop="emit('remove', anime.mal_id)"
    >
      <UIcon name="i-heroicons-x-mark" class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FavoriteAnime } from '~/stores/favorites'

defineProps<{
  anime: FavoriteAnime
}>()

const emit = defineEmits<{
  remove: [malId: number]
}>()
</script>
