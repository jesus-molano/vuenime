<template>
  <div>
    <!-- Hero Section con fondo animado -->
    <section class="relative overflow-hidden border-b border-white/5 pb-8 pt-20 sm:pb-12 sm:pt-24 md:pb-20 md:pt-32">
      <!-- Background gradient animado -->
      <div class="absolute inset-0 bg-linear-to-br from-rp-iris/10 via-transparent to-rp-love/10" />
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rp-iris/5 via-transparent to-transparent"
      />

      <!-- Círculos decorativos (ocultos en mobile) -->
      <div class="absolute -left-32 -top-32 hidden size-64 rounded-full bg-rp-iris/10 blur-3xl md:block" />
      <div class="absolute -bottom-32 -right-32 hidden size-64 rounded-full bg-rp-love/10 blur-3xl md:block" />

      <UContainer class="relative px-4 sm:px-6">
        <div class="mx-auto max-w-3xl text-center">
          <!-- Título con efecto de gradiente -->
          <h1 class="mb-3 text-2xl font-black tracking-tight xs:text-3xl sm:text-4xl md:mb-6 md:text-5xl lg:text-7xl">
            <span class="text-rp-text">{{ $t('home.title') }}</span>
            <br />
            <span class="bg-linear-to-r from-[#c4a7e7] via-[#ebbcba] to-[#eb6f92] bg-clip-text text-transparent">
              {{ $t('home.titleHighlight') }}
            </span>
          </h1>

          <!-- Subtítulo -->
          <p class="mx-auto mb-5 max-w-xl text-xs text-rp-subtle sm:text-sm md:mb-10 md:text-lg">
            {{ $t('home.subtitle') }}
          </p>

          <!-- Search Bar funcional -->
          <form
            role="search"
            class="group relative mx-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 px-4 py-2 backdrop-blur-sm transition-all focus-within:border-rp-iris/50 focus-within:bg-rp-surface/80 hover:border-rp-iris/30 sm:rounded-2xl sm:px-5 sm:py-3"
            @submit.prevent="handleSearch"
          >
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="size-5 shrink-0 text-rp-muted transition-colors group-focus-within:text-rp-iris"
              aria-hidden="true"
            />
            <input
              v-model="searchQuery"
              type="search"
              :placeholder="$t('home.searchPlaceholder')"
              :aria-label="$t('common.search')"
              autocomplete="off"
              class="min-w-0 flex-1 bg-transparent text-sm text-rp-text placeholder-rp-subtle outline-none sm:text-base"
            />
            <button
              type="submit"
              class="shrink-0 rounded-lg bg-rp-iris px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-rp-iris/90 sm:px-4 sm:py-2 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            >
              {{ $t('common.search') }}
            </button>
          </form>

          <!-- Stats rápidos -->
          <div
            class="mt-5 flex items-center justify-center gap-3 text-[10px] sm:mt-8 sm:gap-4 sm:text-xs md:mt-12 md:gap-8 md:text-sm"
          >
            <div class="flex items-center gap-1 md:gap-2">
              <UIcon
                name="i-heroicons-film"
                class="size-3 text-rp-iris sm:size-4 md:size-5"
              />
              <span class="text-rp-subtle">{{ $t('home.stats.titles') }}</span>
            </div>
            <div class="h-3 w-px bg-rp-overlay sm:h-4" />
            <div class="flex items-center gap-1 md:gap-2">
              <UIcon
                name="i-heroicons-arrow-path"
                class="size-3 text-rp-foam sm:size-4 md:size-5"
              />
              <span class="text-rp-subtle">{{ $t('home.stats.updated') }}</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Grid de Animes -->
    <section class="py-6 sm:py-8 md:py-12">
      <UContainer class="px-4 sm:px-6">
        <!-- Section header with counter -->
        <div class="mb-4 flex items-center justify-between sm:mb-6 md:mb-8">
          <div>
            <h2 class="text-lg font-bold text-rp-text sm:text-xl md:text-2xl">{{ $t('home.trending') }}</h2>
            <p class="text-[10px] text-rp-muted sm:text-xs md:text-sm">
              <template v-if="itemsCount > 0 && totalItems > 0">
                {{ $t('home.showingCount', { current: itemsCount, total: totalItems }) }}
              </template>
              <template v-else>
                {{ $t('home.trendingSubtitle') }}
              </template>
            </p>
          </div>
        </div>

        <!-- Loading State con skeletons -->
        <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
        >
          <AnimeCardSkeleton
            v-for="i in PAGINATION.DEFAULT_LIMIT"
            :key="i"
          />
        </div>

        <!-- Initial Error State -->
        <div
          v-else-if="error && itemsCount === 0"
          class="flex flex-col items-center justify-center py-12 md:py-20"
          role="alert"
        >
          <div class="mb-4 rounded-full bg-rp-love/10 p-3 md:p-4">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="size-6 text-rp-love md:size-8"
              aria-hidden="true"
            />
          </div>
          <p class="mb-4 text-sm text-rp-subtle md:text-base">{{ error }}</p>
          <button
            type="button"
            class="rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay md:rounded-xl md:px-6 md:py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
            @click="store.refresh()"
          >
            {{ $t('common.retry') }}
          </button>
        </div>

        <!-- Anime Grid -->
        <div
          v-else
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
        >
          <AnimeCard
            v-for="anime in items"
            :key="anime.mal_id"
            :anime="anime"
          />
        </div>

        <!-- Load More Trigger & Status -->
        <div
          ref="loadMoreTrigger"
          class="flex flex-col items-center justify-center gap-4 py-8"
        >
          <!-- Loading More -->
          <div
            v-if="isLoadingMore"
            class="flex items-center gap-3"
          >
            <div class="size-5 animate-spin rounded-full border-2 border-rp-iris border-t-transparent" />
            <span class="text-sm text-rp-subtle">{{ $t('common.loading') }}</span>
          </div>

          <!-- Load More Error with Retry -->
          <div
            v-else-if="error && itemsCount > 0"
            class="flex flex-col items-center gap-3"
          >
            <p class="text-sm text-rp-love">{{ $t('home.loadMoreError') }}</p>
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
              @click="retryLoadMore"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="size-4"
              />
              {{ $t('common.retry') }}
            </button>
          </div>

          <!-- End of List -->
          <p
            v-else-if="!hasNextPage && itemsCount > 0"
            class="text-sm text-rp-muted"
          >
            {{ $t('home.endOfList') }}
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Back to Top Button -->
    <Transition name="fade-slide">
      <button
        v-show="showBackToTop"
        type="button"
        class="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-rp-surface shadow-lg ring-1 ring-white/10 transition-all hover:bg-rp-overlay hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:bottom-8 md:right-8"
        :aria-label="$t('home.backToTop')"
        @click="scrollToTop"
      >
        <UIcon
          name="i-heroicons-chevron-up"
          class="size-6 text-rp-text"
        />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { PAGINATION } from '~~/shared/constants/api'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const store = useAnimeListStore()

const { items, isLoading, isLoadingMore, hasNextPage, error, totalItems, itemsCount, lastScrollPosition } =
  storeToRefs(store)

const searchQuery = ref('')
const loadMoreTrigger = ref<HTMLElement | null>(null)
const showBackToTop = ref(false)

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: localePath('/search'), query: { q: searchQuery.value.trim() } })
  } else {
    router.push(localePath('/search'))
  }
}

// Retry load more after error
const retryLoadMore = () => {
  store.clearError()
  store.loadMore()
}

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Track scroll for back to top button and save position
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
  store.saveScrollPosition(window.scrollY)
}

// Sync page with URL
const syncPageToUrl = () => {
  const page = store.currentPage
  if (page > 1) {
    router.replace({ query: { ...route.query, page: String(page) } })
  } else {
    const { page: _, ...rest } = route.query
    router.replace({ query: rest })
  }
}

// Watch for page changes to sync URL
watch(() => store.currentPage, syncPageToUrl)

// Initialize
onMounted(async () => {
  // Fetch data if needed
  await store.fetchInitialData()

  // Restore scroll position
  if (lastScrollPosition.value > 0) {
    nextTick(() => {
      window.scrollTo(0, lastScrollPosition.value)
    })
  }

  // Setup scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Setup IntersectionObserver for infinite scroll
  if (loadMoreTrigger.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage.value && !isLoadingMore.value && !error.value) {
          store.loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(loadMoreTrigger.value)

    onUnmounted(() => {
      observer.disconnect()
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

useSeoMeta({
  title: `VueNime - ${t('home.title')} ${t('home.titleHighlight')}`,
  description: t('home.subtitle'),
  ogTitle: `VueNime - ${t('home.title')} ${t('home.titleHighlight')}`,
  ogDescription: t('home.subtitle'),
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
