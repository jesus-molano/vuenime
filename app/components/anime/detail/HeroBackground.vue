<template>
  <div class="absolute inset-0 z-0">
    <!-- Background Image -->
    <NuxtImg
      :src="imageUrl"
      :alt="title"
      class="size-full scale-105 object-cover blur-lg"
      loading="lazy"
    />

    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/60" />

    <!-- Cinematic gradients -->
    <div class="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-rp-base via-rp-base/80 to-transparent" />
    <div class="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-rp-base to-transparent" />
    <div class="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-rp-base/80 to-transparent" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imageUrl: string
  title: string
}>()
</script>
