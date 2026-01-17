<template>
  <div class="flex min-h-[50vh] items-center justify-center">
    <div class="text-center">
      <Icon
        name="heroicons:arrow-path"
        class="size-8 animate-spin text-rp-iris"
      />
      <p class="mt-4 text-rp-subtle">{{ $t('auth.confirming') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const localePath = useLocalePath()

watch(
  user,
  (newUser) => {
    if (newUser) {
      navigateTo(localePath('/'))
    }
  },
  { immediate: true }
)
</script>
