<template>
  <div />
</template>

<script setup lang="ts">
// Redirect to home - this page exists only to prevent Vue Router warnings
// from @nuxtjs/supabase module's internal route resolution
const localePath = useLocalePath()
navigateTo(localePath('/'), { replace: true })
</script>
