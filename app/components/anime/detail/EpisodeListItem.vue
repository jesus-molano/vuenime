<template>
  <div
    class="group flex items-center gap-2 rounded-lg border border-transparent bg-rp-surface p-2 transition-all duration-300 hover:border-rp-iris/30 hover:bg-rp-overlay hover:shadow-lg hover:shadow-rp-iris/5 sm:gap-3 sm:rounded-xl sm:p-3"
    :class="{ 'border-rp-foam/30 bg-rp-foam/5': isWatched }"
  >
    <!-- Watched toggle button -->
    <button
      type="button"
      class="flex size-6 shrink-0 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 sm:size-7"
      :class="
        isWatched
          ? 'bg-rp-foam text-white shadow-md shadow-rp-foam/30 hover:bg-rp-love hover:shadow-rp-love/30'
          : 'bg-rp-overlay text-rp-muted hover:bg-rp-foam hover:text-white hover:shadow-md hover:shadow-rp-foam/30'
      "
      :title="isWatched ? $t('watched.markAsUnwatched') : $t('watched.markAsWatched')"
      @click.stop="$emit('toggleWatched')"
    >
      <UIcon
        :name="isWatched ? 'i-heroicons-check' : 'i-heroicons-eye'"
        class="size-3.5 sm:size-4"
      />
    </button>

    <!-- Episode number badge -->
    <div
      class="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-sm font-bold transition-all duration-300 sm:size-10 sm:rounded-lg sm:text-base"
      :class="
        isWatched
          ? 'bg-rp-foam/20 text-rp-foam'
          : 'bg-linear-to-br from-rp-iris/20 to-rp-iris/5 text-rp-iris group-hover:from-rp-iris group-hover:to-rp-iris/80 group-hover:text-white'
      "
    >
      <span class="relative z-10">{{ episode.mal_id }}</span>
    </div>

    <!-- Episode info -->
    <a
      :href="episode.url"
      target="_blank"
      rel="noopener noreferrer"
      class="min-w-0 flex-1"
    >
      <div class="flex items-center gap-1.5">
        <h4
          class="truncate text-xs font-semibold text-rp-text transition-colors group-hover:text-rp-iris sm:text-sm"
          :class="{ 'text-rp-foam': isWatched }"
        >
          {{ episode.title || $t('anime.episode') + ' ' + episode.mal_id }}
        </h4>
        <!-- Watched badge - mobile -->
        <span
          v-if="isWatched"
          class="shrink-0 text-[10px] font-medium text-rp-foam sm:hidden"
        >
          {{ $t('watched.watched') }}
        </span>
        <!-- Tags - mobile (inline dots) -->
        <div
          v-if="episode.filler || episode.recap"
          class="flex shrink-0 items-center gap-0.5 sm:hidden"
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
      <div class="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-rp-subtle sm:gap-2 sm:text-xs">
        <span
          v-if="episode.aired"
          class="flex items-center gap-0.5 sm:gap-1"
        >
          <UIcon
            name="i-heroicons-calendar"
            class="size-2.5 sm:size-3"
          />
          {{ formattedDate }}
        </span>
        <span
          v-if="episode.score"
          class="flex items-center gap-0.5 sm:gap-1"
        >
          <UIcon
            name="i-heroicons-star-solid"
            class="size-2.5 text-rp-gold sm:size-3"
          />
          {{ episode.score.toFixed(1) }}
        </span>
      </div>
    </a>

    <!-- Tags - desktop -->
    <div class="hidden items-center gap-1 sm:flex">
      <span
        v-if="isWatched"
        class="rounded-full bg-rp-foam/20 px-2 py-0.5 text-[10px] font-medium text-rp-foam"
      >
        {{ $t('watched.watched') }}
      </span>
      <span
        v-if="episode.filler"
        class="rounded-full bg-rp-gold/20 px-2 py-0.5 text-[10px] font-medium text-rp-gold"
      >
        Filler
      </span>
      <span
        v-if="episode.recap"
        class="rounded-full bg-rp-foam/20 px-2 py-0.5 text-[10px] font-medium text-rp-foam"
      >
        Recap
      </span>
    </div>

    <!-- Arrow -->
    <a
      :href="episode.url"
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0"
      :aria-label="$t('anime.watchOnMal', { id: episode.mal_id })"
    >
      <UIcon
        name="i-heroicons-arrow-top-right-on-square"
        class="size-3.5 text-rp-muted opacity-0 transition-all group-hover:text-rp-iris group-hover:opacity-100 sm:size-4"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~~/shared/types/anime'

const props = defineProps<{
  episode: Episode
  isWatched: boolean
}>()

defineEmits<{
  toggleWatched: []
}>()

const { locale } = useI18n()

const formattedDate = computed(() => {
  if (!props.episode.aired) return ''
  try {
    const date = new Date(props.episode.aired)
    return date.toLocaleDateString(locale.value, {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return props.episode.aired
  }
})
</script>
