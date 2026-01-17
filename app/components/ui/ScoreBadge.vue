<template>
  <div
    class="flex items-center gap-1 rounded-full backdrop-blur-md"
    :class="[sizeClasses, positionClasses]"
  >
    <UIcon
      name="i-heroicons-star-solid"
      class="text-rp-gold"
      :class="iconSizeClass"
    />
    <span class="font-bold text-white">{{ formattedScore }}</span>
  </div>
</template>

<script setup lang="ts">
type ScoreBadgeSize = 'xs' | 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    score: number
    size?: ScoreBadgeSize
    position?: 'static' | 'top-right' | 'top-left'
  }>(),
  {
    size: 'sm',
    position: 'static',
  }
)

const formattedScore = computed(() => props.score.toFixed(1))

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-1.5 py-0.5 text-[9px] bg-black/60'
    case 'sm':
      return 'px-2 py-1 text-xs bg-black/40 shadow-lg'
    case 'md':
      return 'px-2.5 py-1.5 text-sm bg-black/70'
    default:
      return 'px-2 py-1 text-xs bg-black/40 shadow-lg'
  }
})

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'size-2'
    case 'sm':
      return 'size-3.5'
    case 'md':
      return 'size-4'
    default:
      return 'size-3.5'
  }
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-right':
      return 'absolute right-2.5 top-2.5 md:right-3 md:top-3'
    case 'top-left':
      return 'absolute left-2.5 top-2.5 md:left-3 md:top-3'
    default:
      return ''
  }
})
</script>
