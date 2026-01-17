<template>
  <section class="bg-rp-base py-16 md:py-24">
    <UContainer class="px-4 sm:px-6">
      <AnimeDetailSectionHeader
        icon="i-heroicons-play-circle-solid"
        :title="$t('anime.trailer')"
        :subtitle="hasTrailer ? $t('anime.watchTrailerDesc') : $t('anime.noTrailerDesc')"
        color="iris"
      />

      <!-- Main Video Player -->
      <div v-if="hasTrailer" class="relative mx-auto max-w-5xl">
        <!-- Glow effect -->
        <div class="absolute -inset-4 rounded-3xl bg-rp-iris/20 blur-2xl" />

        <div class="relative aspect-video overflow-hidden rounded-2xl bg-rp-surface shadow-2xl ring-1 ring-white/20">
          <iframe
            :src="playerVideoUrl"
            class="size-full"
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>

      <!-- No Trailer State -->
      <div v-else class="mx-auto flex max-w-md flex-col items-center py-8 text-center">
        <div class="flex size-20 items-center justify-center rounded-full bg-rp-surface">
          <UIcon name="i-heroicons-video-camera-slash" class="size-10 text-rp-muted" />
        </div>
        <p class="mt-4 text-rp-subtle">{{ $t('anime.noTrailer') }}</p>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { AnimeTrailer } from '~~/shared/types/anime'

const props = defineProps<{
  trailer?: AnimeTrailer | null
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
