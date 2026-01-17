<template>
  <div class="group rounded-2xl bg-rp-base/50 p-5 ring-1 ring-white/5 transition-all hover:ring-rp-iris/30">
    <div class="mb-2 flex items-center gap-2 text-rp-muted">
      <UIcon
        :name="icon"
        class="size-4"
      />
      <span class="text-xs font-medium uppercase tracking-wider">{{ label }}</span>
    </div>
    <p
      class="text-lg font-semibold text-rp-text"
      :class="valueClass"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  valueClass?: string
}>()
</script>
