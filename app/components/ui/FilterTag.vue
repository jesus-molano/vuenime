<template>
  <span
    class="flex items-center gap-1 rounded-full px-3 py-1 text-sm"
    :class="variantClasses"
  >
    <slot />
    <button
      type="button"
      class="ml-1 rounded-full p-0.5 transition-colors"
      :class="buttonClasses"
      @click="$emit('remove')"
    >
      <UIcon
        name="i-heroicons-x-mark"
        class="size-3"
      />
    </button>
  </span>
</template>

<script setup lang="ts">
type FilterTagVariant = 'iris' | 'foam' | 'gold' | 'love'

const props = withDefaults(
  defineProps<{
    variant?: FilterTagVariant
  }>(),
  {
    variant: 'iris',
  }
)

defineEmits<{
  remove: []
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'iris':
      return 'bg-rp-iris/20 text-rp-iris'
    case 'foam':
      return 'bg-rp-foam/20 text-rp-foam'
    case 'gold':
      return 'bg-rp-gold/20 text-rp-gold'
    case 'love':
      return 'bg-rp-love/20 text-rp-love'
    default:
      return 'bg-rp-iris/20 text-rp-iris'
  }
})

const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'iris':
      return 'hover:bg-rp-iris/30'
    case 'foam':
      return 'hover:bg-rp-foam/30'
    case 'gold':
      return 'hover:bg-rp-gold/30'
    case 'love':
      return 'hover:bg-rp-love/30'
    default:
      return 'hover:bg-rp-iris/30'
  }
})
</script>
