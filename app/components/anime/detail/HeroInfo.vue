<template>
  <div class="flex-1 space-y-4 text-center md:text-left">
    <!-- Badges Row -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <span
        v-if="anime.type"
        class="rounded-lg bg-rp-iris px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md"
      >
        {{ anime.type }}
      </span>
      <span
        v-if="anime.year"
        class="rounded-lg bg-rp-base px-3 py-1.5 text-xs font-semibold text-white shadow-md"
      >
        {{ anime.year }}
      </span>
      <span
        v-if="anime.rating"
        class="rounded-lg bg-rp-base px-3 py-1.5 text-xs font-medium text-white shadow-md"
      >
        {{ anime.rating }}
      </span>
    </div>

    <!-- Title -->
    <h1 class="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
      {{ anime.title }}
    </h1>

    <!-- Japanese Title -->
    <p
      v-if="anime.title_japanese"
      class="text-lg font-medium text-white/80 md:text-xl"
    >
      {{ anime.title_japanese }}
    </p>

    <!-- Quick Stats -->
    <div class="flex flex-wrap items-center justify-center gap-2 text-sm md:justify-start md:text-base">
      <span v-if="anime.episodes" class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
        <UIcon name="i-heroicons-play-circle" class="size-4 text-rp-iris md:size-5" />
        <span class="font-medium text-white">{{ anime.episodes }} {{ $t('anime.eps') }}</span>
      </span>
      <span v-if="anime.duration" class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
        <UIcon name="i-heroicons-clock" class="size-4 text-rp-foam md:size-5" />
        <span class="font-medium text-white">{{ anime.duration }}</span>
      </span>
      <span v-if="anime.rank" class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
        <UIcon name="i-heroicons-trophy" class="size-4 text-rp-gold md:size-5" />
        <span class="font-medium text-white">#{{ anime.rank }}</span>
      </span>
      <span v-if="anime.popularity" class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
        <UIcon name="i-heroicons-fire" class="size-4 text-rp-love md:size-5" />
        <span class="font-medium text-white">#{{ anime.popularity }}</span>
      </span>
    </div>

    <!-- Genres -->
    <div
      v-if="anime.genres?.length"
      class="flex flex-wrap justify-center gap-2 md:justify-start"
    >
      <span
        v-for="genre in anime.genres.slice(0, 5)"
        :key="genre.mal_id"
        class="rounded-full bg-rp-base px-3 py-1 text-sm font-medium text-white shadow-md transition-all hover:bg-rp-surface"
      >
        {{ genre.name }}
      </span>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
      <button
        type="button"
        :aria-pressed="isFavorite"
        class="group flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
        :class="isFavorite
          ? 'bg-rp-love text-white hover:bg-rp-love/90 focus-visible:ring-rp-love'
          : 'bg-rp-iris text-white hover:bg-rp-iris/90 focus-visible:ring-rp-iris'"
        @click="toggleFavorite"
      >
        <UIcon
          :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          class="size-5 transition-transform group-hover:scale-110"
          aria-hidden="true"
        />
        {{ isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite') }}
      </button>
    </div>

    <!-- Studios -->
    <div
      v-if="anime.studios?.length"
      class="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg bg-rp-base px-3 py-1.5 text-sm shadow-md md:justify-start"
    >
      <span class="font-semibold text-rp-subtle">{{ $t('anime.studios') }}:</span>
      <span
        v-for="(studio, index) in anime.studios"
        :key="studio.mal_id"
        class="font-medium text-white"
      >
        {{ studio.name }}<span v-if="index < anime.studios.length - 1" class="text-rp-muted">,</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.anime.mal_id))

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.anime)
}
</script>

