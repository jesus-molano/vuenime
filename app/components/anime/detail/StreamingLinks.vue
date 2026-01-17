<template>
  <div
    v-if="streamingLinks.length"
    class="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start"
  >
    <span class="text-sm font-semibold text-white/70">{{ $t('anime.watchOn') }}:</span>
    <a
      v-for="link in streamingLinks"
      :key="link.url"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center gap-2 rounded-xl bg-rp-base px-4 py-3 font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
    >
      <UIcon
        :name="getStreamingIcon(link.name)"
        class="size-5 transition-transform group-hover:scale-110"
      />
      {{ link.name }}
      <UIcon
        name="i-heroicons-arrow-top-right-on-square"
        class="size-3.5 text-rp-muted"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => String(props.animeId))
const { streamingLinks } = useAnimeStreaming(animeIdRef)

// Platform icons mapping
const platformIcons: Record<string, string> = {
  crunchyroll: 'i-simple-icons-crunchyroll',
  netflix: 'i-simple-icons-netflix',
  hulu: 'i-simple-icons-hulu',
  'amazon prime': 'i-simple-icons-primevideo',
  'prime video': 'i-simple-icons-primevideo',
  funimation: 'i-simple-icons-funimation',
  'disney+': 'i-simple-icons-disneyplus',
  'hbo max': 'i-simple-icons-hbo',
  'tubi tv': 'i-heroicons-tv',
  hidive: 'i-heroicons-play',
  vrv: 'i-heroicons-play-circle',
}

const getStreamingIcon = (name: string) => {
  const normalizedName = name.toLowerCase()
  return platformIcons[normalizedName] || 'i-heroicons-play-circle'
}
</script>
