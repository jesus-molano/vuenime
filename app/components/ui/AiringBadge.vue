<template>
  <div
    class="rounded-full bg-rp-foam font-bold text-rp-base shadow-lg"
    :class="[sizeClasses, positionClasses]"
  >
    {{ $t('anime.airing') }}
  </div>
</template>

<script setup lang="ts">
type AiringBadgeSize = 'xs' | 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    size?: AiringBadgeSize
    position?: 'static' | 'top-left' | 'top-right'
  }>(),
  {
    size: 'sm',
    position: 'static',
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-1.5 py-0.5 text-[9px]'
    case 'sm':
      return 'px-2 py-1 text-[10px] md:text-xs'
    case 'md':
      return 'px-2.5 py-1 text-xs'
    default:
      return 'px-2 py-1 text-[10px] md:text-xs'
  }
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top-left':
      return 'absolute left-2.5 top-2.5 md:left-3 md:top-3'
    case 'top-right':
      return 'absolute right-2.5 top-2.5 md:right-3 md:top-3'
    default:
      return ''
  }
})
</script>
