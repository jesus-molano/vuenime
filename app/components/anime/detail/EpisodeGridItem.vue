<template>
  <div
    class="group relative flex flex-col items-center justify-center rounded-lg border border-transparent bg-rp-surface p-2 text-center transition-all duration-300 hover:border-rp-iris/30 hover:bg-rp-overlay hover:shadow-lg hover:shadow-rp-iris/5 sm:rounded-xl sm:p-3"
    :class="{ 'border-rp-foam/30 bg-rp-foam/5': isWatched }"
  >
    <!-- Watched toggle button (top-left) -->
    <button
      type="button"
      class="absolute left-1 top-1 z-10 flex size-5 items-center justify-center rounded transition-all duration-200 hover:scale-110 sm:left-1.5 sm:top-1.5 sm:size-6"
      :class="
        isWatched
          ? 'bg-rp-foam text-white shadow-md shadow-rp-foam/30 hover:bg-rp-love hover:shadow-rp-love/30'
          : 'bg-rp-overlay/80 text-rp-muted opacity-0 group-hover:opacity-100 hover:bg-rp-foam hover:text-white hover:shadow-md hover:shadow-rp-foam/30'
      "
      :title="isWatched ? $t('watched.markAsUnwatched') : $t('watched.markAsWatched')"
      @click.stop="$emit('toggleWatched')"
    >
      <UIcon
        :name="isWatched ? 'i-heroicons-check' : 'i-heroicons-eye'"
        class="size-3 sm:size-3.5"
      />
    </button>

    <!-- Episode number -->
    <a
      :href="episode.url"
      target="_blank"
      rel="noopener noreferrer"
      class="flex flex-col items-center"
      :aria-label="$t('anime.watchOnMal', { id: episode.mal_id })"
    >
      <div
        class="mb-1 flex size-8 items-center justify-center rounded-md text-sm font-bold transition-all duration-300 group-hover:scale-110 sm:mb-2 sm:size-10 sm:rounded-lg sm:text-lg"
        :class="
          isWatched
            ? 'bg-rp-foam/20 text-rp-foam'
            : 'bg-linear-to-br from-rp-iris/20 to-rp-iris/5 text-rp-iris group-hover:from-rp-iris group-hover:to-rp-iris/80 group-hover:text-white'
        "
      >
        {{ episode.mal_id }}
      </div>

      <!-- Title -->
      <h4
        class="line-clamp-1 text-[10px] font-medium transition-colors sm:line-clamp-2 sm:text-xs"
        :class="isWatched ? 'text-rp-foam' : 'text-rp-text group-hover:text-rp-iris'"
      >
        {{ episode.title || $t('anime.episode') + ' ' + episode.mal_id }}
      </h4>
    </a>

    <!-- Badges (top-right) -->
    <div
      v-if="episode.filler || episode.recap"
      class="absolute right-1 top-1 flex gap-0.5 sm:right-1.5 sm:top-1.5"
    >
      <span
        v-if="episode.filler"
        class="size-1.5 rounded-full bg-rp-gold"
        title="Filler"
      />
      <span
        v-if="episode.recap"
        class="size-1.5 rounded-full bg-rp-foam"
        title="Recap"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/types/anime'

defineProps<{
  episode: Episode
  isWatched: boolean
}>()

defineEmits<{
  toggleWatched: []
}>()
</script>
