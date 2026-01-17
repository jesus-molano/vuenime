<template>
  <div class="mb-6 flex items-center gap-3 md:mb-8">
    <div
      class="flex size-10 items-center justify-center rounded-xl md:size-12"
      :class="bgClass"
    >
      <UIcon :name="icon" class="size-5 md:size-6" :class="iconClass" />
    </div>
    <div>
      <h2 class="text-xl font-bold text-rp-text md:text-2xl">{{ title }}</h2>
      <p v-if="subtitle" class="text-sm text-rp-subtle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  title: string
  subtitle?: string
  color?: 'iris' | 'rose' | 'foam' | 'gold'
}>()

const bgClass = computed(() => {
  const colors = {
    iris: 'bg-rp-iris/20',
    rose: 'bg-rp-rose/20',
    foam: 'bg-rp-foam/20',
    gold: 'bg-rp-gold/20',
  }
  return colors[props.color || 'iris']
})

const iconClass = computed(() => {
  const colors = {
    iris: 'text-rp-iris',
    rose: 'text-rp-rose',
    foam: 'text-rp-foam',
    gold: 'text-rp-gold',
  }
  return colors[props.color || 'iris']
})
</script>
