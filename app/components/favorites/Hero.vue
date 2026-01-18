<template>
  <section class="relative overflow-hidden bg-rp-base pb-6 pt-36 sm:pb-8 sm:pt-40 md:pb-10 md:pt-44 lg:pt-48">
    <!-- Subtle background glow -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-1/4 top-0 h-96 w-1/2 rounded-full bg-rp-love/5 blur-3xl" />
      <div class="absolute -right-1/4 bottom-0 h-96 w-1/2 rounded-full bg-rp-iris/5 blur-3xl" />
    </div>

    <UContainer class="relative z-10 px-4 sm:px-6">
      <div class="mx-auto max-w-2xl text-center">
        <!-- Title with Naruto sitting on it -->
        <div class="relative inline-block">
          <!-- Naruto sitting just above the title -->
          <div
            v-scroll-reveal.fade-up
            class="absolute z-20 -right-8 -top-11 sm:-right-12 sm:-top-18 md:-right-12 md:-top-21 lg:-right-14 lg:-top-25"
          >
            <NuxtImg
              src="/images/fav.webp"
              alt=""
              aria-hidden="true"
              class="h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] sm:h-24 md:h-28 lg:h-34"
              loading="eager"
            />
          </div>

          <h1
            v-scroll-reveal.fade-up="100"
            class="relative text-3xl font-bold tracking-tight text-rp-text sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {{ $t('favorites.title') }}
          </h1>
        </div>

        <!-- Subtitle -->
        <p
          v-scroll-reveal.fade-up="200"
          class="mt-3 text-sm text-rp-subtle sm:text-base md:mt-4 md:text-lg"
        >
          {{ $t('favorites.subtitle') }}
        </p>

        <!-- Stats (client-side only) -->
        <ClientOnly>
          <!-- Loading skeleton -->
          <div
            v-if="isSyncing"
            class="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3"
          >
            <div class="h-8 w-32 animate-pulse rounded-full bg-rp-surface/80 ring-1 ring-rp-overlay/30" />
            <div class="h-8 w-28 animate-pulse rounded-full bg-rp-surface/80 ring-1 ring-rp-overlay/30" />
          </div>

          <!-- Stats -->
          <div
            v-else-if="favoritesCount > 0"
            v-scroll-reveal.fade-up="300"
            class="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3"
          >
            <div
              class="flex items-center gap-1.5 rounded-full bg-rp-surface/80 px-3 py-1.5 text-xs ring-1 ring-rp-love/20 backdrop-blur-sm sm:text-sm"
            >
              <UIcon
                name="i-heroicons-heart-solid"
                class="size-3.5 text-rp-love sm:size-4"
              />
              <span class="font-medium text-rp-text">{{ favoritesCount }}</span>
              <span class="text-rp-subtle">{{ $t('favorites.animeCount') }}</span>
            </div>

            <div
              v-if="topGenre"
              class="flex items-center gap-1.5 rounded-full bg-rp-surface/80 px-3 py-1.5 text-xs ring-1 ring-rp-gold/20 backdrop-blur-sm sm:text-sm"
            >
              <UIcon
                name="i-heroicons-star-solid"
                class="size-3.5 text-rp-gold sm:size-4"
              />
              <span class="text-rp-subtle">Top:</span>
              <span class="font-medium text-rp-text">{{ topGenre }}</span>
            </div>
          </div>

          <!-- SSR fallback -->
          <template #fallback>
            <div class="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3">
              <div class="h-8 w-32 animate-pulse rounded-full bg-rp-surface/80 ring-1 ring-rp-overlay/30" />
              <div class="h-8 w-28 animate-pulse rounded-full bg-rp-surface/80 ring-1 ring-rp-overlay/30" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const favoritesStore = useFavoritesStore()
const { favoritesCount, isLoading } = storeToRefs(favoritesStore)

// Show loading if syncing with Supabase
const isSyncing = computed(() => isLoading.value)

// Calculate top genre from favorites
const topGenre = computed(() => {
  const allFavorites = favoritesStore.sortedByRecent
  if (allFavorites.length === 0) return null

  const genreCounts: Record<string, number> = {}
  allFavorites.forEach((anime) => {
    anime.genres?.forEach((genre) => {
      genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1
    })
  })

  const entries = Object.entries(genreCounts)
  if (entries.length === 0) return null

  entries.sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || null
})
</script>
