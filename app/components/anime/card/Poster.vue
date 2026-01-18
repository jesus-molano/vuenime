<template>
  <div class="relative overflow-hidden" :class="containerClass">
    <NuxtImg
      :src="imageUrl"
      :alt="$t('anime.coverAlt', { title })"
      :style="imageStyle"
      class="size-full object-cover select-none"
      :class="imageClass"
      :loading="loading"
      :draggable="false"
      placeholder
    />
    <UiScoreBadge
      v-if="score"
      :score="score"
      :size="badgeSize"
      :position="scorePosition"
      :class="badgeClass"
    />
    <UiAiringBadge
      v-if="airing"
      :size="badgeSize"
      :position="airingPosition"
      :class="badgeClass"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageUrl: string
  title: string
  score?: number | null
  airing?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Container CSS class */
  containerClass?: string
  /** Image CSS class */
  imageClass?: string
  /** Badge CSS class */
  badgeClass?: string
  /** Custom image style (for view transitions) */
  imageStyle?: Record<string, string>
  /** Loading strategy */
  loading?: 'lazy' | 'eager'
  /** Score badge position */
  scorePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Airing badge position */
  airingPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const props = withDefaults(defineProps<Props>(), {
  score: null,
  airing: false,
  size: 'md',
  containerClass: '',
  imageClass: '',
  badgeClass: '',
  imageStyle: () => ({}),
  loading: 'lazy',
  scorePosition: 'top-right',
  airingPosition: 'top-left',
})

const badgeSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'xs'
    case 'lg':
      return 'md'
    default:
      return 'sm'
  }
})
</script>
