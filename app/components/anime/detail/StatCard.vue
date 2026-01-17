<template>
  <div
    class="group relative overflow-hidden rounded-2xl p-5 ring-1"
    :class="[gradientClass, ringClass]"
  >
    <!-- Background Icon - more visible -->
    <UIcon
      :name="icon"
      class="absolute -right-3 -top-3 size-24 opacity-[0.15]"
      :class="iconColorClass"
    />

    <div class="relative">
      <div
        class="mb-2 flex items-center gap-2"
        :class="labelClass"
      >
        <UIcon
          :name="icon"
          class="size-4"
        />
        <span class="text-xs font-medium uppercase tracking-wider">{{ label }}</span>
      </div>
      <p class="text-3xl font-black text-rp-text">{{ formattedValue }}</p>
      <p
        v-if="subtitle"
        class="mt-1 text-xs text-rp-subtle"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  value: string | number
  subtitle?: string
  color: 'gold' | 'iris' | 'foam' | 'rose'
  prefix?: string
}>()

const formattedValue = computed(() => {
  if (props.prefix) return `${props.prefix}${props.value}`
  return props.value
})

const gradientClass = computed(() => {
  const colors = {
    gold: 'bg-gradient-to-br from-rp-gold/20 to-rp-gold/5',
    iris: 'bg-gradient-to-br from-rp-iris/20 to-rp-iris/5',
    foam: 'bg-gradient-to-br from-rp-foam/20 to-rp-foam/5',
    rose: 'bg-gradient-to-br from-rp-rose/20 to-rp-rose/5',
  }
  return colors[props.color]
})

const ringClass = computed(() => {
  const colors = {
    gold: 'ring-rp-gold/30',
    iris: 'ring-rp-iris/30',
    foam: 'ring-rp-foam/30',
    rose: 'ring-rp-rose/30',
  }
  return colors[props.color]
})

const labelClass = computed(() => {
  const colors = {
    gold: 'text-rp-gold',
    iris: 'text-rp-iris',
    foam: 'text-rp-foam',
    rose: 'text-rp-rose',
  }
  return colors[props.color]
})

const iconColorClass = computed(() => {
  const colors = {
    gold: 'text-rp-gold',
    iris: 'text-rp-iris',
    foam: 'text-rp-foam',
    rose: 'text-rp-rose',
  }
  return colors[props.color]
})
</script>
