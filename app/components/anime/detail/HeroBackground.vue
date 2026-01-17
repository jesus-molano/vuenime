<template>
  <div class="absolute inset-0 z-0">
    <!-- Video Background (desktop only) -->
    <iframe
      v-if="youtubeId && isDesktop"
      :src="videoUrl"
      class="pointer-events-none absolute -inset-10 size-[calc(100%+80px)] scale-105 object-cover opacity-50"
      allow="autoplay; encrypted-media"
      frameborder="0"
      loading="lazy"
    />

    <!-- Static Image (mobile, or fallback) -->
    <NuxtImg
      :src="backgroundImage"
      :alt="title"
      class="size-full scale-110 object-cover"
      :class="[hasTrailerImage ? 'blur-sm' : 'blur-2xl', youtubeId && isDesktop ? 'opacity-30' : 'opacity-100']"
      loading="lazy"
    />

    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-rp-base/60" />

    <!-- Cinematic Gradients -->
    <div class="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-rp-base from-10% via-rp-base/90 to-transparent" />
    <div class="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-rp-base to-transparent" />
    <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-rp-base to-transparent" />
  </div>
</template>

<script setup lang="ts">
import type { AnimeTrailer } from '~~/shared/types/anime'

const props = defineProps<{
  imageUrl: string
  title: string
  trailer?: AnimeTrailer | null
}>()

// Check if desktop (md breakpoint = 768px)
const isDesktop = ref(false)

onMounted(() => {
  const checkDesktop = () => {
    isDesktop.value = window.innerWidth >= 768
  }
  checkDesktop()
  window.addEventListener('resize', checkDesktop)
  onUnmounted(() => window.removeEventListener('resize', checkDesktop))
})

// Extract youtube ID from embed_url if youtube_id is not available
const extractYoutubeId = (embedUrl: string): string | null => {
  const match = embedUrl.match(/\/embed\/([^?]+)/)
  return match?.[1] ?? null
}

// Get the youtube ID
const youtubeId = computed(() => {
  if (props.trailer?.youtube_id) {
    return props.trailer.youtube_id
  }
  if (props.trailer?.embed_url) {
    return extractYoutubeId(props.trailer.embed_url)
  }
  return null
})

// Video URL with autoplay, muted, loop
const videoUrl = computed(() => {
  if (!youtubeId.value) return ''
  return `https://www.youtube.com/embed/${youtubeId.value}?autoplay=1&mute=1&loop=1&playlist=${youtubeId.value}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1`
})

// Use trailer image if available, otherwise use poster
const hasTrailerImage = computed(() => !!props.trailer?.images?.maximum_image_url)

const backgroundImage = computed(() => {
  if (props.trailer?.images?.maximum_image_url) {
    return props.trailer.images.maximum_image_url
  }
  if (props.trailer?.images?.large_image_url) {
    return props.trailer.images.large_image_url
  }
  return props.imageUrl
})
</script>
