<template>
  <div class="mx-auto flex max-w-md flex-col items-center py-16 text-center">
    <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-rp-surface">
      <UIcon
        name="i-heroicons-heart"
        class="size-12 text-rp-muted"
        aria-hidden="true"
      />
    </div>

    <h2 class="text-xl font-semibold text-rp-text md:text-2xl">
      {{ $t('favorites.emptyTitle') }}
    </h2>

    <p class="mt-2 text-rp-subtle">
      {{ $t('favorites.emptyDesc') }}
    </p>

    <NuxtLink
      :to="localePath('/')"
      class="mt-6 inline-flex items-center gap-2 rounded-xl bg-rp-iris px-6 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
    >
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="size-5"
        aria-hidden="true"
      />
      {{ $t('favorites.exploreAnime') }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
