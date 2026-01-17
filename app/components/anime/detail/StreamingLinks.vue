<template>
  <div
    v-if="streamingLinks.length"
    class="flex flex-wrap items-center gap-2"
  >
    <a
      v-for="link in streamingLinks"
      :key="link.url"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
      :class="getPlatformClasses(link.name)"
    >
      <UIcon
        :name="getPlatformIcon(link.name)"
        class="size-4"
      />
      {{ link.name }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { getStreamingPlatformConfig } from '~~/shared/constants/streaming'

const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => String(props.animeId))
const { streamingLinks } = useAnimeStreaming(animeIdRef)

const getPlatformIcon = (name: string) => getStreamingPlatformConfig(name).icon
const getPlatformClasses = (name: string) => getStreamingPlatformConfig(name).classes
</script>
