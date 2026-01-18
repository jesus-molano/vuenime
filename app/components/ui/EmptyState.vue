<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="mb-3 rounded-full bg-rp-overlay/50 p-4">
      <UIcon
        :name="icon"
        class="size-8 text-rp-muted"
        aria-hidden="true"
      />
    </div>
    <p class="text-sm text-rp-muted">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  message: string
}>()
</script>
