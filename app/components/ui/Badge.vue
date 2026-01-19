<template>
  <component
    :is="to ? NuxtLink : 'span'"
    :to="to"
    class="inline-flex items-center gap-1 font-medium transition-all"
    :class="[sizeClasses, variantClasses, { 'hover:scale-105': to }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const NuxtLink = resolveComponent('NuxtLink')

type BadgeVariant = 'iris' | 'love' | 'gold' | 'foam' | 'base' | 'subtle' | 'glass'
type BadgeSize = 'xs' | 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    size?: BadgeSize
    to?: RouteLocationRaw
  }>(),
  {
    variant: 'base',
    size: 'sm',
    to: undefined,
  }
)

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'rounded-full px-2 py-0.5 text-[10px]'
    case 'sm':
      return 'rounded-lg px-2.5 py-1 text-xs'
    case 'md':
      return 'rounded-lg px-3 py-1.5 text-xs'
    default:
      return 'rounded-lg px-2.5 py-1 text-xs'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'iris':
      return 'bg-rp-iris text-rp-base shadow-md'
    case 'love':
      return 'bg-rp-love text-white shadow-md'
    case 'gold':
      return 'bg-rp-gold text-rp-base shadow-md'
    case 'foam':
      return 'bg-rp-foam text-rp-base shadow-md'
    case 'base':
      return 'bg-rp-base text-white shadow-md'
    case 'subtle':
      return 'bg-white/10 text-white/80 backdrop-blur-sm'
    case 'glass':
      return 'bg-black/40 text-white backdrop-blur-md shadow-lg'
    default:
      return 'bg-rp-base text-white shadow-md'
  }
})
</script>
