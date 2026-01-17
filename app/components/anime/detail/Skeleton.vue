<template>
  <section class="relative min-h-svh overflow-hidden bg-rp-base">
    <!-- Background -->
    <div class="absolute inset-0 bg-rp-surface/20" />

    <!-- Content -->
    <div class="relative z-20 flex min-h-svh items-end pb-16 md:items-center md:pb-0">
      <UContainer class="w-full px-4 py-8 sm:px-6 md:py-16">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
          <!-- Poster Skeleton -->
          <div class="relative mx-auto w-40 shrink-0 md:mx-0 md:w-56 lg:w-64">
            <div class="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <div
                :style="{ viewTransitionName: `poster-${animeId}` }"
                class="aspect-3/4 w-full animate-pulse bg-rp-overlay"
              />
            </div>
          </div>

          <!-- Info Skeleton -->
          <div class="flex-1 space-y-4 text-center md:text-left">
            <!-- Badges -->
            <div class="flex justify-center gap-2 md:justify-start">
              <div class="h-6 w-16 animate-pulse rounded-md bg-rp-overlay" />
              <div class="h-6 w-20 animate-pulse rounded-md bg-rp-overlay" />
            </div>

            <!-- Title -->
            <div class="mx-auto h-12 w-3/4 animate-pulse rounded-lg bg-rp-overlay md:mx-0 md:h-14" />

            <!-- Japanese Title -->
            <div class="mx-auto h-6 w-1/2 animate-pulse rounded-lg bg-rp-overlay md:mx-0" />

            <!-- Stats -->
            <div class="flex flex-wrap justify-center gap-4 md:justify-start">
              <div class="h-6 w-20 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-6 w-24 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-6 w-20 animate-pulse rounded-lg bg-rp-overlay" />
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap justify-center gap-2 md:justify-start">
              <div class="h-8 w-20 animate-pulse rounded-full bg-rp-overlay" />
              <div class="h-8 w-24 animate-pulse rounded-full bg-rp-overlay" />
              <div class="h-8 w-16 animate-pulse rounded-full bg-rp-overlay" />
            </div>

            <!-- Synopsis Preview -->
            <div class="hidden space-y-2 md:block">
              <div class="h-4 w-full animate-pulse rounded bg-rp-overlay" />
              <div class="h-4 w-5/6 animate-pulse rounded bg-rp-overlay" />
              <div class="h-4 w-4/6 animate-pulse rounded bg-rp-overlay" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-center gap-3 pt-2 md:justify-start">
              <div class="h-12 w-36 animate-pulse rounded-xl bg-rp-overlay" />
              <div class="h-12 w-36 animate-pulse rounded-xl bg-rp-overlay" />
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  animeId: string
}>()
</script>
