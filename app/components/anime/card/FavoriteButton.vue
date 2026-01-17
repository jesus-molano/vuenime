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
type FavoriteButtonVariant = 'mobile' | 'desktop'

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

const sizeClass = computed(() => (props.variant === 'mobile' ? 'size-7' : 'size-10 md:size-11'))

const iconClass = computed(() =>
  props.variant === 'mobile' ? 'size-4' : 'size-5 transition-transform duration-300 md:size-6'
)

const focusClass = computed(() =>
  props.variant === 'mobile'
    ? 'focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface'
    : 'focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus-visible:opacity-100'
)

const stateClass = computed(() => {
  if (props.isFavorite) {
    return props.variant === 'mobile'
      ? 'bg-rp-love text-white shadow-lg shadow-rp-love/30'
      : 'bg-rp-love text-white shadow-lg shadow-rp-love/40 scale-100 opacity-100'
  }
  return props.variant === 'mobile'
    ? 'bg-rp-overlay/80 text-rp-subtle hover:text-rp-love'
    : 'bg-black/40 text-white opacity-0 hover:bg-rp-love hover:shadow-lg hover:shadow-rp-love/40 group-hover:opacity-100'
})
</script>
