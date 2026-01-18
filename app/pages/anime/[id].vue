<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Error State -->
    <div
      v-if="error && !anime"
      class="flex min-h-screen items-center justify-center"
      role="alert"
    >
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/10">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="size-8 text-rp-love"
            aria-hidden="true"
          />
        </div>
        <p class="mb-4 text-rp-subtle">{{ $t('common.error') }}</p>
        <button
          type="button"
          class="rounded-xl bg-rp-surface px-6 py-3 font-medium text-rp-text transition-all hover:bg-rp-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
          @click="refresh()"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
    </div>

    <!-- Content with fade transition -->
    <Transition
      name="content-fade"
      mode="out-in"
    >
      <div
        v-if="anime"
        key="content"
      >
        <AnimeDetailHero :anime="anime" />
        <AnimeDetailContentGrid
          :synopsis="anime.synopsis"
          :anime-id="animeId"
          :total-episodes="anime.episodes"
          :anime-title="anime.title"
        />
        <AnimeDetailTrailer
          :trailer="anime.trailer"
          :anime="anime"
        />
        <AnimeDetailTabsSection :anime-id="animeId" />
      </div>

      <!-- Loading Skeleton -->
      <div
        v-else-if="isLoading"
        key="skeleton"
      >
        <AnimeDetailSkeleton :anime-id="animeId" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { loadingAnime, rateLimited, serviceUnavailable, animeNotFound } = useNotifications()

const animeId = computed(() => route.params.id as string)
const { anime, isLoading, error, refresh } = useAnimeDetail(animeId)

// Show loading toast only if it takes longer than 3 seconds
let loadingTimeout: ReturnType<typeof setTimeout> | null = null
let dismissToast: (() => void) | null = null

watch(isLoading, (loading) => {
  if (loading && !anime.value) {
    loadingTimeout = setTimeout(() => {
      if (isLoading.value) {
        dismissToast = loadingAnime()
      }
    }, 3000)
  } else {
    // Loading finished - dismiss toast and clear timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout)
      loadingTimeout = null
    }
    if (dismissToast) {
      dismissToast()
      dismissToast = null
    }
  }
})

// Show themed error notifications
watch(error, (err) => {
  if (!err) return

  // useFetch error can have statusCode at different levels
  const fetchError = err as { statusCode?: number; data?: { statusCode?: number } }
  const statusCode = fetchError.statusCode ?? fetchError.data?.statusCode

  if (statusCode === 429) {
    rateLimited()
  } else if (statusCode === 503 || statusCode === 502 || statusCode === 504) {
    serviceUnavailable()
  } else if (statusCode === 404) {
    animeNotFound()
  }
})

onUnmounted(() => {
  if (loadingTimeout) clearTimeout(loadingTimeout)
  if (dismissToast) dismissToast()
})

useSeoMeta({
  title: () => (anime.value ? `${anime.value.title} | VueNime` : 'Loading... | VueNime'),
  description: () => anime.value?.synopsis?.slice(0, 160) || '',
  ogTitle: () => anime.value?.title || 'VueNime',
  ogDescription: () => anime.value?.synopsis?.slice(0, 160) || '',
  ogImage: () => anime.value?.images.jpg.large_image_url || '',
})
</script>

<style scoped>
.content-fade-enter-active {
  transition: opacity 0.3s ease-out;
}

.content-fade-leave-active {
  transition: opacity 0.15s ease-in;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}
</style>
