<template>
  <section class="relative overflow-hidden bg-rp-base">
    <!-- Background Skeleton -->
    <div class="absolute inset-0 bg-rp-surface/20" />
    <div class="absolute inset-0 bg-linear-to-t from-rp-base via-rp-base/80 to-rp-base/40" />

    <!-- Favorite Button Skeleton - Top Right -->
    <div
      class="absolute right-4 top-20 z-30 size-12 animate-pulse rounded-full bg-rp-overlay md:right-6 md:top-24 md:size-14"
    />

    <!-- Content Container - matches Hero.vue padding -->
    <div class="relative z-20 pb-12 pt-24 md:pb-16 md:pt-28">
      <UContainer class="w-full px-4 sm:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-10 lg:gap-14">
          <!-- Poster Skeleton - matches HeroPoster.vue dimensions -->
          <div class="relative mx-auto w-44 shrink-0 md:mx-0 md:w-60 lg:w-72">
            <!-- Glow Effect -->
            <div class="absolute -inset-6 animate-pulse rounded-3xl bg-rp-iris/20 blur-3xl" />
            <div class="absolute -inset-4 animate-pulse rounded-3xl bg-rp-rose/10 blur-2xl" />

            <div class="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/20">
              <div
                :style="{ viewTransitionName: `poster-${animeId}` }"
                class="aspect-3/4 w-full animate-pulse bg-rp-overlay"
              />
            </div>
          </div>

          <!-- Info Skeleton - matches HeroInfo.vue structure -->
          <div class="flex-1 space-y-4 text-center md:text-left">
            <!-- Badges Row -->
            <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <div class="h-7 w-14 animate-pulse rounded-lg bg-rp-iris/50" />
              <div class="h-7 w-12 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-7 w-16 animate-pulse rounded-lg bg-rp-overlay" />
            </div>

            <!-- Title -->
            <div class="mx-auto h-12 w-4/5 animate-pulse rounded-lg bg-rp-overlay sm:h-14 md:mx-0 md:h-16 lg:h-20" />

            <!-- Japanese Title -->
            <div class="mx-auto h-6 w-2/3 animate-pulse rounded-lg bg-rp-overlay md:mx-0 md:h-7" />

            <!-- Quick Stats -->
            <div class="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <div class="h-8 w-20 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-8 w-28 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-8 w-16 animate-pulse rounded-lg bg-rp-overlay" />
              <div class="h-8 w-18 animate-pulse rounded-lg bg-rp-overlay" />
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap justify-center gap-2 md:justify-start">
              <div class="h-7 w-20 animate-pulse rounded-full bg-rp-overlay" />
              <div class="h-7 w-24 animate-pulse rounded-full bg-rp-overlay" />
              <div class="h-7 w-16 animate-pulse rounded-full bg-rp-overlay" />
              <div class="h-7 w-22 animate-pulse rounded-full bg-rp-overlay" />
            </div>

            <!-- Streaming Links -->
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
              <div class="h-5 w-16 animate-pulse rounded bg-rp-overlay/50" />
              <div class="h-12 w-32 animate-pulse rounded-xl bg-rp-overlay" />
              <div class="h-12 w-28 animate-pulse rounded-xl bg-rp-overlay" />
              <div class="h-12 w-24 animate-pulse rounded-xl bg-rp-overlay" />
            </div>

            <!-- Studios -->
            <div class="inline-flex h-9 w-48 animate-pulse rounded-lg bg-rp-overlay" />
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
