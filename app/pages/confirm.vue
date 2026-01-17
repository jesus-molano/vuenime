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
const AUTH_REDIRECT_KEY = 'auth_redirect_path'

const user = useSupabaseUser()
const localePath = useLocalePath()

function getRedirectPath(): string {
  if (import.meta.client) {
    const path = localStorage.getItem(AUTH_REDIRECT_KEY)
    localStorage.removeItem(AUTH_REDIRECT_KEY)
    return path || localePath('/')
  }
  return localePath('/')
}

watch(
  user,
  (newUser) => {
    if (newUser) {
      navigateTo(getRedirectPath())
    }
  },
  { immediate: true }
)
</script>
