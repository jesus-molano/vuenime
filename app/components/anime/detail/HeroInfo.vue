<template>
  <div class="flex flex-1 flex-col justify-between text-center md:text-left">
    <!-- Info Section -->
    <div class="space-y-3">
      <!-- Title -->
      <div>
        <h1 class="text-3xl font-black leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
          {{ anime.title }}
        </h1>
        <p
          v-if="anime.title_japanese && anime.title_japanese !== anime.title"
          class="mt-1 text-base text-white/70 drop-shadow"
        >
          {{ anime.title_japanese }}
        </p>
      </div>

      <!-- Meta Info -->
      <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
        <NuxtLink
          v-if="anime.type"
          :to="typeSearchLink"
          class="rounded-md bg-rp-iris px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-all hover:scale-105"
        >
          {{ translatedType }}
        </NuxtLink>
        <NuxtLink
          v-if="anime.year"
          :to="yearSearchLink"
          class="rounded-md bg-black/50 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-all hover:scale-105"
        >
          {{ anime.year }}
        </NuxtLink>
        <span
          v-if="anime.rating"
          class="rounded-md bg-black/50 px-2.5 py-1 text-xs text-white shadow-sm backdrop-blur-sm"
        >
          {{ anime.rating }}
        </span>
        <span
          v-if="anime.duration"
          class="flex items-center gap-1 text-sm text-white drop-shadow"
        >
          <UIcon
            name="i-heroicons-clock"
            class="size-4 text-rp-foam"
          />
          {{ anime.duration }}
        </span>
        <span
          v-if="anime.episodes"
          class="flex items-center gap-1 text-sm text-white drop-shadow"
        >
          <UIcon
            name="i-heroicons-play-circle"
            class="size-4 text-rp-iris"
          />
          {{ anime.episodes }} {{ $t('anime.eps') }}
        </span>
        <span
          v-if="anime.rank"
          class="flex items-center gap-1 text-sm text-white drop-shadow"
        >
          <UIcon
            name="i-heroicons-trophy"
            class="size-4 text-rp-gold"
          />
          #{{ anime.rank }}
        </span>
        <span
          v-if="anime.popularity"
          class="flex items-center gap-1 text-sm text-white drop-shadow"
        >
          <UIcon
            name="i-heroicons-fire"
            class="size-4 text-rp-love"
          />
          #{{ anime.popularity }}
        </span>
      </div>

      <!-- Genres -->
      <AnimeCardGenres
        v-if="anime.genres?.length"
        :genres="anime.genres"
        size="hero"
        :limit="6"
        linkable
        class="justify-center md:justify-start"
      />

      <!-- Studios + MAL -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70 md:justify-start">
        <div
          v-if="anime.studios?.length"
          class="flex items-center gap-1.5"
        >
          <UIcon
            name="i-heroicons-building-office-2"
            class="size-4"
          />
          <NuxtLink
            v-for="(studio, index) in anime.studios"
            :key="studio.mal_id"
            :to="getStudioSearchLink(studio)"
            class="hover:text-white hover:underline"
          >
            {{ studio.name }}
            <span v-if="index < anime.studios.length - 1">,&nbsp;</span>
          </NuxtLink>
        </div>
        <a
          :href="anime.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 hover:text-white"
        >
          <UIcon
            name="i-simple-icons-myanimelist"
            class="size-4"
          />
          MyAnimeList
        </a>
      </div>
    </div>

    <!-- Actions Section (separated at bottom) -->
    <div class="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
      <!-- Favorite Button -->
      <AnimeCardFavoriteButton
        :is-favorite="isFavorite"
        :is-animating="isAnimating"
        variant="hero"
        @toggle="toggleFavorite"
      />

      <!-- Streaming Links -->
      <AnimeDetailStreamingLinks :anime-id="anime.mal_id" />

      <!-- Trailer Button -->
      <a
        v-if="anime.trailer?.youtube_id"
        :href="`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 rounded-lg bg-black/50 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/60"
      >
        <UIcon
          name="i-heroicons-play-solid"
          class="size-4"
        />
        {{ $t('anime.trailer') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const localePath = useLocalePath()
const { translateType } = useAnimeTranslations()

const animeRef = toRef(props, 'anime')
const { isFavorite, isAnimating, toggleFavorite } = useFavoriteToggle(animeRef)

const translatedType = computed(() => (props.anime.type ? translateType(props.anime.type) : ''))

const typeSearchLink = computed(() => ({
  path: localePath('/search'),
  query: { type: props.anime.type?.toLowerCase() },
}))

const yearSearchLink = computed(() => ({
  path: localePath('/search'),
  query: { year: props.anime.year },
}))

const getStudioSearchLink = (studio: { mal_id: number; name: string }) => ({
  path: localePath('/search'),
  query: { producers: studio.mal_id, name: studio.name },
})
</script>
