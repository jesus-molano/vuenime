<template>
  <button
    type="button"
    class="flex items-center justify-center rounded-full outline-none transition-all duration-300"
    :class="[sizeClass, stateClass, focusClass]"
    :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
    :aria-pressed="isFavorite"
    @click.stop.prevent="$emit('toggle')"
  >
    <UIcon
      :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
      :class="[iconClass, { 'animate-heart-beat': isAnimating }]"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
type FavoriteButtonVariant = 'mobile' | 'desktop' | 'hero'

const props = withDefaults(
  defineProps<{
    isFavorite: boolean
    isAnimating?: boolean
    variant?: FavoriteButtonVariant
  }>(),
  {
    isAnimating: false,
    variant: 'desktop',
  }
)

defineEmits<{
  toggle: []
}>()

const sizeClass = computed(() => {
  switch (props.variant) {
    case 'mobile':
      return 'size-7'
    case 'hero':
      return 'size-12'
    default:
      return 'size-10 md:size-11'
  }
})

const iconClass = computed(() => {
  switch (props.variant) {
    case 'mobile':
      return 'size-4'
    case 'hero':
      return 'size-6'
    default:
      return 'size-5 transition-transform duration-300 md:size-6'
  }
})

const focusClass = computed(() => {
  switch (props.variant) {
    case 'mobile':
      return 'focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface'
    case 'hero':
      return 'focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
    default:
      return 'focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus-visible:opacity-100'
  }
})

const stateClass = computed(() => {
  if (props.isFavorite) {
    switch (props.variant) {
      case 'mobile':
        return 'bg-rp-love text-white shadow-lg shadow-rp-love/30'
      case 'hero':
        return 'bg-rp-love text-white shadow-lg hover:scale-110'
      default:
        return 'bg-rp-love text-white shadow-lg shadow-rp-love/40 scale-100 opacity-100'
    }
  }
  switch (props.variant) {
    case 'mobile':
      return 'bg-rp-overlay/80 text-rp-subtle hover:text-rp-love'
    case 'hero':
      return 'bg-black/50 text-white backdrop-blur-sm hover:bg-rp-love hover:scale-110'
    default:
      return 'bg-black/40 text-white opacity-0 hover:bg-rp-love hover:shadow-lg hover:shadow-rp-love/40 group-hover:opacity-100'
  }
})
</script>
