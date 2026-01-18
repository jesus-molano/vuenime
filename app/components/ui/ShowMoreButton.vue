<template>
  <button
    v-if="show"
    type="button"
    class="flex w-full items-center justify-center gap-2 rounded-lg border border-rp-overlay/50 bg-rp-surface/50 py-2.5 text-sm font-medium text-rp-text transition-colors hover:border-rp-iris/30 hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
    @click="$emit('click')"
  >
    <UIcon
      name="i-heroicons-chevron-down"
      class="size-4"
    />
    {{ $t('home.viewMore') }} ({{ count }})
  </button>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  count: number
}>()

defineEmits<{
  click: []
}>()
</script>
