<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Error State -->
    <div
      v-if="error && !anime && errorInfo"
      class="flex min-h-screen items-center justify-center"
      role="alert"
    >
      <div class="max-w-md px-4 text-center">
        <!-- Image for 404 -->
        <NuxtImg
          v-if="errorInfo.image"
          :src="errorInfo.image"
          alt=""
          class="mx-auto mb-6 h-48 w-auto object-contain sm:h-56"
          loading="eager"
        />
        <!-- Icon for other errors -->
        <div
          v-else
          class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
          :class="errorInfo.color"
        >
          <UIcon
            :name="errorInfo.icon"
            class="size-8"
            :class="errorInfo.iconColor"
            aria-hidden="true"
          />
        </div>
        <h1 class="mb-2 text-xl font-bold text-rp-text">{{ errorInfo.title }}</h1>
        <p class="mb-6 text-sm text-rp-subtle">{{ errorInfo.description }}</p>
        <UiErrorActions
          show-retry
          @retry="refresh()"
        />
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
const { t } = useI18n()
const { loadingAnime, rateLimited, serviceUnavailable, animeNotFound } = useNotifications()

const animeId = computed(() => route.params.id as string)
const { anime, isLoading, error, refresh } = useAnimeDetail(animeId)

// Determine error type for specific messaging
const errorInfo = computed(() => {
  if (!error.value) return null

  const fetchError = error.value as { statusCode?: number; data?: { statusCode?: number } }
  const statusCode = fetchError.statusCode ?? fetchError.data?.statusCode

  if (statusCode === 404) {
    return {
      image: '/images/fail.webp',
      icon: 'i-heroicons-magnifying-glass',
      title: t('notifications.notFound'),
      description: t('notifications.notFoundDesc'),
      color: 'bg-rp-iris/10',
      iconColor: 'text-rp-iris',
    }
  }

  if (statusCode === 429) {
    return {
      icon: 'i-heroicons-clock',
      title: t('notifications.rateLimited'),
      description: t('notifications.rateLimitedDesc'),
      color: 'bg-rp-gold/10',
      iconColor: 'text-rp-gold',
    }
  }

  if (statusCode && statusCode >= 502 && statusCode <= 504) {
    return {
      icon: 'i-heroicons-server-stack',
      title: t('notifications.serviceUnavailable'),
      description: t('notifications.serviceUnavailableDesc'),
      color: 'bg-rp-love/10',
      iconColor: 'text-rp-love',
    }
  }

  // Generic error
  return {
    icon: 'i-heroicons-exclamation-triangle',
    title: t('common.error'),
    description: t('error.pageNotFound'),
    color: 'bg-rp-love/10',
    iconColor: 'text-rp-love',
  }
})

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
}, { immediate: true })

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
