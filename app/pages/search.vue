<template>
  <div class="min-h-screen py-6 pt-20 sm:py-8 sm:pt-24 md:py-12 md:pt-32">
    <UContainer class="px-4 sm:px-6">
      <!-- Search Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="mb-2 text-xl font-bold text-rp-text sm:text-2xl md:text-3xl">
          {{ $t('search.resultsFor') }}
          <span class="text-rp-iris">"{{ query }}"</span>
        </h1>
        <p v-if="!isLoading && searchResults" class="text-sm text-rp-subtle">
          {{ searchResults.pagination?.items?.total || 0 }} {{ $t('search.resultsFound') }}
        </p>
      </div>

      <!-- Search Input -->
      <form
        @submit.prevent="handleSearch"
        class="mb-6 flex items-center gap-2 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 px-4 py-2 backdrop-blur-sm transition-all focus-within:border-rp-iris/50 focus-within:bg-rp-surface/80 sm:mb-8 sm:rounded-2xl sm:px-5 sm:py-3"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="size-5 shrink-0 text-rp-muted" />
        <input
          v-model="searchInput"
          type="text"
          :placeholder="$t('home.searchPlaceholder')"
          class="min-w-0 flex-1 bg-transparent text-sm text-rp-text placeholder-rp-muted outline-none sm:text-base"
        />
        <button
          v-if="searchInput"
          type="button"
          @click="searchInput = ''"
          class="shrink-0 rounded-lg p-1 text-rp-muted transition-colors hover:bg-rp-overlay/50 hover:text-rp-text"
        >
          <UIcon name="i-heroicons-x-mark" class="size-4" />
        </button>
        <button
          type="submit"
          :disabled="!searchInput.trim()"
          class="shrink-0 rounded-lg bg-rp-iris px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-rp-iris/90 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 sm:py-2 sm:text-sm"
        >
          {{ $t('common.search') }}
        </button>
      </form>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 md:pb-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
        <AnimeCardSkeleton v-for="i in 12" :key="i" />
      </div>

      <!-- No Results -->
      <div v-else-if="!searchResults?.data?.length" class="flex flex-col items-center justify-center py-12 md:py-20">
        <div class="mb-4 rounded-full bg-rp-overlay/50 p-4">
          <UIcon name="i-heroicons-magnifying-glass" class="size-8 text-rp-muted" />
        </div>
        <p class="mb-2 text-lg font-medium text-rp-text">{{ $t('common.noResults') }}</p>
        <p class="text-sm text-rp-subtle">{{ $t('search.tryDifferent') }}</p>
      </div>

      <!-- Results Grid -->
      <div v-else class="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 md:pb-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6">
        <AnimeCard
          v-for="anime in searchResults.data"
          :key="anime.mal_id"
          :anime="anime"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { AnimeListResponse } from '~~/shared/types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const query = computed(() => (route.query.q as string) || '')
const searchInput = ref(query.value)

const searchResults = ref<AnimeListResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const fetchSearchResults = async (q: string) => {
  if (!q.trim()) return

  isLoading.value = true
  error.value = null

  try {
    const data = await $fetch<AnimeListResponse>('/api/jikan/anime', {
      query: { q, limit: 24 }
    })
    searchResults.value = data
  } catch (err) {
    error.value = t('common.error')
    console.error('Search error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  if (searchInput.value.trim()) {
    router.push({ path: '/search', query: { q: searchInput.value.trim() } })
  }
}

// Watch for query changes
watch(query, (newQuery) => {
  searchInput.value = newQuery
  if (newQuery) {
    fetchSearchResults(newQuery)
  }
}, { immediate: true })

useSeoMeta({
  title: () => `${query.value} - ${t('common.search')} | VueNime`,
  description: () => `${t('search.resultsFor')} "${query.value}"`,
})
</script>
