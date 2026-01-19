<script setup lang="ts">
const toaster = {
  position: 'bottom-right' as const,
  duration: 4000,
  max: 5,
}
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator color="#c4a7e7" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
