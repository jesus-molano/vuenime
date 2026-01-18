<template>
  <div class="flex flex-col" :class="containerClass">
    <h3
      :id="titleId"
      class="font-bold text-rp-text"
      :class="[titleClass, lineClampClass]"
    >
      {{ title }}
    </h3>

    <AnimeCardInfo
      v-if="showInfo"
      :year="year"
      :episodes="episodes"
      :size="size"
      class="mt-1"
    />

    <AnimeCardGenres
      v-if="genres && genres.length > 0"
      :genres="genres"
      :size="size"
      class="mt-1"
    />

    <UiAiringBadge
      v-if="airing && showAiringInline"
      :size="size"
      class="mt-1 w-fit"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { AnimeGenre } from '~~/shared/types/anime'

interface Props {
  title: string
  titleId?: string
  year?: number | null
  episodes?: number | null
  genres?: AnimeGenre[] | null
  airing?: boolean
  /** Size variant for badges and info */
  size?: 'xs' | 'sm' | 'md'
  /** Show year and episodes info */
  showInfo?: boolean
  /** Show airing badge inline (for mobile) */
  showAiringInline?: boolean
  /** Number of lines to clamp title */
  lineClamp?: 1 | 2 | 3
  /** Container CSS class */
  containerClass?: string
  /** Title CSS class */
  titleClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleId: undefined,
  year: null,
  episodes: null,
  genres: null,
  airing: false,
  size: 'sm',
  showInfo: true,
  showAiringInline: false,
  lineClamp: 2,
  containerClass: '',
  titleClass: '',
})

const lineClampClass = computed(() => {
  switch (props.lineClamp) {
    case 1:
      return 'line-clamp-1'
    case 3:
      return 'line-clamp-3'
    default:
      return 'line-clamp-2'
  }
})
</script>
