<template>
  <div
    v-if="streamingLinks.length"
    class="space-y-2 pt-2"
  >
    <!-- Header with icon - mobile only -->
    <div class="flex items-center justify-center gap-2 md:hidden">
      <div class="flex size-8 items-center justify-center rounded-lg bg-rp-iris/30">
        <UIcon
          name="i-heroicons-play-circle-solid"
          class="size-5 text-rp-iris"
        />
      </div>
      <span class="text-sm font-bold text-white">{{ $t('anime.watchOn') }}</span>
    </div>

    <!-- Desktop label -->
    <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-3">
      <span class="hidden text-sm font-semibold text-white md:inline">{{ $t('anime.watchOn') }}:</span>

      <!-- Streaming buttons -->
      <a
        v-for="link in streamingLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:px-4 md:py-2.5 md:text-base"
        :class="getPlatformClasses(link.name)"
      >
        <UIcon
          :name="getPlatformIcon(link.name)"
          class="size-4 md:size-5"
        />
        {{ link.name }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => String(props.animeId))
const { streamingLinks } = useAnimeStreaming(animeIdRef)

// Platform config: icon and brand colors
const platformConfig: Record<string, { icon: string; classes: string }> = {
  crunchyroll: {
    icon: 'i-simple-icons-crunchyroll',
    classes: 'bg-[#F47521] text-white hover:bg-[#ff8533] focus-visible:ring-[#F47521]',
  },
  netflix: {
    icon: 'i-simple-icons-netflix',
    classes: 'bg-[#E50914] text-white hover:bg-[#ff1a1a] focus-visible:ring-[#E50914]',
  },
  hulu: {
    icon: 'i-simple-icons-hulu',
    classes: 'bg-[#1CE783] text-black hover:bg-[#3dffa0] focus-visible:ring-[#1CE783]',
  },
  'amazon prime': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-[#00A8E1] text-white hover:bg-[#1ab8f0] focus-visible:ring-[#00A8E1]',
  },
  'prime video': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-[#00A8E1] text-white hover:bg-[#1ab8f0] focus-visible:ring-[#00A8E1]',
  },
  funimation: {
    icon: 'i-simple-icons-funimation',
    classes: 'bg-[#5B0BB5] text-white hover:bg-[#7a1ed6] focus-visible:ring-[#5B0BB5]',
  },
  'disney+': {
    icon: 'i-simple-icons-disneyplus',
    classes: 'bg-[#113CCF] text-white hover:bg-[#2952e0] focus-visible:ring-[#113CCF]',
  },
  'hbo max': {
    icon: 'i-simple-icons-hbo',
    classes: 'bg-[#B017E6] text-white hover:bg-[#c73df0] focus-visible:ring-[#B017E6]',
  },
  'tubi tv': {
    icon: 'i-heroicons-tv',
    classes: 'bg-[#FA382F] text-white hover:bg-[#ff5349] focus-visible:ring-[#FA382F]',
  },
  hidive: {
    icon: 'i-heroicons-play',
    classes: 'bg-[#00BAFF] text-white hover:bg-[#33c7ff] focus-visible:ring-[#00BAFF]',
  },
}

const defaultConfig = {
  icon: 'i-heroicons-play-circle',
  classes: 'bg-rp-surface text-white hover:bg-rp-overlay focus-visible:ring-rp-iris',
}

const getPlatformIcon = (name: string) => {
  const config = platformConfig[name.toLowerCase()]
  return config?.icon || defaultConfig.icon
}

const getPlatformClasses = (name: string) => {
  const config = platformConfig[name.toLowerCase()]
  return config?.classes || defaultConfig.classes
}
</script>
