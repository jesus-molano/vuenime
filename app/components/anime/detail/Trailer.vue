<template>
  <section class="bg-rp-surface/30 py-6 sm:py-8">
    <UContainer class="px-4 sm:px-6">
      <div class="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <!-- Trailer Column -->
        <div
          v-scroll-reveal.fade-up
          class="lg:col-span-3"
        >
          <div class="mb-3 flex items-center gap-2 sm:mb-4">
            <div class="flex size-8 items-center justify-center rounded-lg bg-rp-iris/10 sm:size-10">
              <UIcon
                name="i-heroicons-play-circle-solid"
                class="size-4 text-rp-iris sm:size-5"
                aria-hidden="true"
              />
            </div>
            <h2 class="text-lg font-bold text-rp-text sm:text-xl">
              {{ $t('anime.trailer') }}
            </h2>
          </div>

          <!-- Video Player -->
          <div
            v-if="hasTrailer"
            class="relative aspect-video overflow-hidden rounded-xl bg-rp-surface shadow-lg ring-1 ring-white/10"
          >
            <iframe
              :src="playerVideoUrl"
              :title="$t('anime.trailer')"
              class="size-full"
              allowfullscreen
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <!-- No Trailer State -->
          <div
            v-else
            class="flex aspect-video flex-col items-center justify-center rounded-xl bg-rp-surface/50 text-center"
          >
            <UIcon
              name="i-heroicons-video-camera-slash"
              class="size-10 text-rp-muted"
              aria-hidden="true"
            />
            <p class="mt-2 text-sm text-rp-subtle">{{ $t('anime.noTrailer') }}</p>
          </div>
        </div>

        <!-- Stats Sidebar -->
        <div class="lg:col-span-2">
          <div class="mb-3 flex items-center gap-2 sm:mb-4">
            <div class="flex size-8 items-center justify-center rounded-lg bg-rp-foam/10 sm:size-10">
              <UIcon
                name="i-heroicons-chart-bar-solid"
                class="size-4 text-rp-foam sm:size-5"
                aria-hidden="true"
              />
            </div>
            <h2 class="text-lg font-bold text-rp-text sm:text-xl">
              {{ $t('anime.details') }}
            </h2>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <AnimeDetailStatCard
              v-if="anime.score"
              v-scroll-reveal.scale="0"
              icon="i-heroicons-star-solid"
              :label="$t('anime.score')"
              :value="anime.score.toFixed(2)"
              :subtitle="anime.scored_by ? `${formatNumber(anime.scored_by)} ${$t('anime.votes')}` : undefined"
              color="gold"
            />
            <AnimeDetailStatCard
              v-if="anime.rank"
              v-scroll-reveal.scale="50"
              icon="i-heroicons-trophy"
              :label="$t('anime.rank')"
              :value="anime.rank"
              prefix="#"
              color="iris"
            />
            <AnimeDetailStatCard
              v-if="anime.popularity"
              v-scroll-reveal.scale="100"
              icon="i-heroicons-chart-bar"
              :label="$t('anime.popularity')"
              :value="anime.popularity"
              prefix="#"
              color="foam"
            />
            <AnimeDetailStatCard
              v-if="anime.members"
              v-scroll-reveal.scale="150"
              icon="i-heroicons-user-group"
              :label="$t('anime.members')"
              :value="formatNumber(anime.members)"
              color="rose"
            />
          </div>

          <!-- Additional Info -->
          <div class="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
            <AnimeDetailInfoCard
              v-if="anime.status"
              v-scroll-reveal.fade-up="200"
              icon="i-heroicons-signal"
              :label="$t('anime.status')"
              :value="anime.status"
            />
            <AnimeDetailInfoCard
              v-if="anime.source"
              v-scroll-reveal.fade-up="250"
              icon="i-heroicons-book-open"
              :label="$t('anime.source')"
              :value="anime.source"
            />
            <AnimeDetailInfoCard
              v-if="anime.aired?.string"
              v-scroll-reveal.fade-up="300"
              icon="i-heroicons-calendar-days"
              :label="$t('anime.aired')"
              :value="anime.aired.string"
            />
            <AnimeDetailInfoCard
              v-if="anime.season && anime.year"
              v-scroll-reveal.fade-up="350"
              icon="i-heroicons-calendar"
              :label="$t('anime.season')"
              :value="`${anime.season} ${anime.year}`"
              value-class="capitalize"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { Anime, AnimeTrailer } from '~~/shared/types/anime'

const props = defineProps<{
  trailer?: AnimeTrailer | null
  anime: Anime
}>()

// Extract youtube ID from embed_url if youtube_id is not available
const extractYoutubeId = (embedUrl: string): string | null => {
  const match = embedUrl.match(/\/embed\/([^?]+)/)
  return match?.[1] ?? null
}

// Get the youtube ID from youtube_id or extract from embed_url
const youtubeId = computed(() => {
  if (props.trailer?.youtube_id) {
    return props.trailer.youtube_id
  }
  if (props.trailer?.embed_url) {
    return extractYoutubeId(props.trailer.embed_url)
  }
  return null
})

// Check if we have a valid trailer
const hasTrailer = computed(() => !!youtubeId.value)

// Player video - with controls for user interaction
const playerVideoUrl = computed(() => {
  if (!youtubeId.value) return ''
  return `https://www.youtube.com/embed/${youtubeId.value}?rel=0&modestbranding=1`
})
</script>
