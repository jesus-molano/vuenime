<template>
  <div class="flex-1 space-y-4 text-center md:text-left">
    <!-- Badges Row -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <NuxtLink
        v-if="anime.type"
        :to="typeSearchLink"
        class="rounded-lg bg-rp-iris px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-rp-iris/80 hover:scale-105"
      >
        {{ translatedType }}
      </NuxtLink>
      <NuxtLink
        v-if="anime.year"
        :to="yearSearchLink"
        class="rounded-lg bg-rp-base px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-rp-surface hover:scale-105"
      >
        {{ anime.year }}
      </NuxtLink>
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
      <UTooltip
        v-if="anime.episodes"
        :text="$t('anime.episodesCount')"
      >
        <span class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
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
        <span class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
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
        <span class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
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
        <span class="flex items-center gap-1.5 rounded-lg bg-rp-base px-2.5 py-1 shadow-md">
          <UIcon
            name="i-heroicons-fire"
            class="size-4 text-rp-love md:size-5"
          />
          <span class="font-medium text-white">#{{ anime.popularity }}</span>
        </span>
      </UTooltip>
    </div>

    <!-- Genres -->
    <div
      v-if="anime.genres?.length"
      class="flex flex-wrap justify-center gap-2 md:justify-start"
    >
      <NuxtLink
        v-for="genre in anime.genres.slice(0, 5)"
        :key="genre.mal_id"
        :to="getGenreSearchLink(genre)"
        class="rounded-full bg-rp-base px-3 py-1 text-sm font-medium text-white shadow-md transition-all hover:bg-rp-surface hover:scale-105"
      >
        {{ getGenreName(genre) }}
      </NuxtLink>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
      <button
        type="button"
        :aria-pressed="isFavorite"
        class="group flex items-center gap-2 rounded-xl px-6 py-3 font-bold shadow-lg transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
        :class="
          isFavorite
            ? 'bg-rp-love text-white hover:bg-rp-love/90 focus-visible:ring-rp-love'
            : 'bg-rp-iris text-white hover:bg-rp-iris/90 focus-visible:ring-rp-iris'
        "
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
      <template
        v-for="(studio, index) in anime.studios"
        :key="studio.mal_id"
      >
        <NuxtLink
          :to="getStudioSearchLink(studio)"
          class="font-medium text-white transition-colors hover:text-rp-iris"
        >
          {{ studio.name }}
        </NuxtLink>
        <span
          v-if="index < anime.studios.length - 1"
          class="text-rp-muted"
        >,</span
        >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const favoritesStore = useFavoritesStore()
const localePath = useLocalePath()
const { translateType, translateGenreById } = useAnimeTranslations()

const isFavorite = computed(() => favoritesStore.isFavorite(props.anime.mal_id))

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.anime)
}

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
