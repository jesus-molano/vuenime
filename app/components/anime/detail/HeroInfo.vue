<template>
  <div class="flex-1 space-y-4 text-center md:text-left">
    <!-- Badges Row -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <NuxtLink
        v-if="anime.type"
        :to="typeSearchLink"
        class="rounded-lg bg-rp-base px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-rp-surface hover:ring-white/30"
      >
        {{ translatedType }}
      </NuxtLink>
      <NuxtLink
        v-if="anime.year"
        :to="yearSearchLink"
        class="rounded-lg bg-rp-base px-3 py-1.5 text-xs font-semibold text-white shadow-md ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-rp-surface hover:ring-white/30"
      >
        {{ anime.year }}
      </NuxtLink>
      <span
        v-if="anime.rating"
        class="glass-badge rounded-lg border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
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

    <!-- Quick Stats (non-clickable) -->
    <div class="flex flex-wrap items-center justify-center gap-2 text-sm md:justify-start md:text-base">
      <UTooltip
        v-if="anime.episodes"
        :text="$t('anime.episodesCount')"
      >
        <span
          class="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/30 px-2.5 py-1 backdrop-blur-md"
        >
          <UIcon
            name="i-heroicons-play-circle"
            class="size-4 text-rp-iris md:size-5"
          />
          <span class="font-medium text-white">{{ anime.episodes }} {{ $t('anime.eps') }}</span>
        </span>
      </UTooltip>
      <UTooltip
        v-if="anime.duration"
        :text="$t('anime.episodeDuration')"
      >
        <span
          class="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/30 px-2.5 py-1 backdrop-blur-md"
        >
          <UIcon
            name="i-heroicons-clock"
            class="size-4 text-rp-foam md:size-5"
          />
          <span class="font-medium text-white">{{ anime.duration }}</span>
        </span>
      </UTooltip>
      <UTooltip
        v-if="anime.rank"
        :text="$t('anime.rankTooltip')"
      >
        <span
          class="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/30 px-2.5 py-1 backdrop-blur-md"
        >
          <UIcon
            name="i-heroicons-trophy"
            class="size-4 text-rp-gold md:size-5"
          />
          <span class="font-medium text-white">#{{ anime.rank }}</span>
        </span>
      </UTooltip>
      <UTooltip
        v-if="anime.popularity"
        :text="$t('anime.popularityTooltip')"
      >
        <span
          class="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/30 px-2.5 py-1 backdrop-blur-md"
        >
          <UIcon
            name="i-heroicons-fire"
            class="size-4 text-rp-love md:size-5"
          />
          <span class="font-medium text-white">#{{ anime.popularity }}</span>
        </span>
      </UTooltip>
    </div>

    <!-- Genres (clickable) -->
    <div
      v-if="anime.genres?.length"
      class="flex flex-wrap justify-center gap-2 md:justify-start"
    >
      <NuxtLink
        v-for="genre in anime.genres.slice(0, 5)"
        :key="genre.mal_id"
        :to="getGenreSearchLink(genre)"
        class="rounded-full bg-rp-base px-3 py-1 text-sm font-medium text-white shadow-md ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-rp-surface hover:ring-white/30"
      >
        {{ getGenreName(genre) }}
      </NuxtLink>
    </div>

    <!-- Streaming Links -->
    <AnimeDetailStreamingLinks :anime-id="anime.mal_id" />

    <!-- Studios (clickable) -->
    <div
      v-if="anime.studios?.length"
      class="inline-flex flex-wrap items-center justify-center gap-2 md:justify-start"
    >
      <span class="text-sm font-semibold text-white">{{ $t('anime.studios') }}:</span>
      <NuxtLink
        v-for="studio in anime.studios"
        :key="studio.mal_id"
        :to="getStudioSearchLink(studio)"
        class="rounded-lg bg-rp-base px-2.5 py-1 text-sm font-medium text-white shadow-md ring-1 ring-white/10 transition-all hover:scale-105 hover:bg-rp-surface hover:ring-white/30"
      >
        {{ studio.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const localePath = useLocalePath()
const { translateType, translateGenreById } = useAnimeTranslations()

// Translated type
const translatedType = computed(() => (props.anime.type ? translateType(props.anime.type) : ''))

// Get translated genre name
const getGenreName = (genre: { mal_id: number; name: string }) => {
  return translateGenreById(genre.mal_id) || genre.name
}

// Search links with locale
const typeSearchLink = computed(() => ({
  path: localePath('/search'),
  query: { type: props.anime.type?.toLowerCase() },
}))

const yearSearchLink = computed(() => ({
  path: localePath('/search'),
  query: { year: props.anime.year },
}))

const getGenreSearchLink = (genre: { mal_id: number; name: string }) => ({
  path: localePath('/search'),
  query: { genres: genre.mal_id, name: getGenreName(genre) },
})

const getStudioSearchLink = (studio: { mal_id: number; name: string }) => ({
  path: localePath('/search'),
  query: { producers: studio.mal_id, name: studio.name },
})
</script>
