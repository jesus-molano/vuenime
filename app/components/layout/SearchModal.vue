<template>
  <UiModal
    v-model:open="modelValue"
    :show-close-button="false"
    aria-labelled-by="search-modal-label"
    container-class="items-start pt-[12vh]"
    content-class="max-w-2xl"
  >
    <span
      id="search-modal-label"
      class="sr-only"
    >
      {{ $t('common.search') }}
    </span>

    <form
      class="flex items-center gap-3 border-b border-rp-overlay/50 px-5 py-4"
      @submit.prevent="handleSearch"
    >
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="size-6 text-rp-iris"
        aria-hidden="true"
      />
      <input
        ref="inputRef"
        v-model="query"
        type="search"
        :placeholder="$t('home.searchPlaceholder')"
        :aria-label="$t('common.search')"
        autocomplete="off"
        class="flex-1 bg-transparent text-lg text-rp-text placeholder-rp-subtle outline-none"
      />
      <kbd
        class="rounded-lg bg-rp-overlay px-2.5 py-1 text-xs font-medium text-rp-text"
        aria-hidden="true"
      >
        ESC
      </kbd>
    </form>

    <div class="max-h-[60vh] overflow-y-auto">
      <!-- Quick Actions -->
      <div
        class="border-b border-rp-overlay/30 p-4"
        role="menu"
        :aria-label="$t('search.quickActions')"
      >
        <p
          id="quick-actions-label"
          class="mb-3 text-xs font-semibold uppercase tracking-wider text-rp-subtle"
        >
          {{ $t('search.quickActions') }}
        </p>
        <div
          class="grid grid-cols-2 gap-2"
          aria-labelledby="quick-actions-label"
        >
          <button
            type="button"
            role="menuitem"
            class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            @click="navigateTo('/')"
          >
            <UIcon
              name="i-heroicons-fire"
              class="size-5 text-rp-gold"
              aria-hidden="true"
            />
            <span class="text-sm font-medium text-rp-text">{{ $t('nav.explore') }}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            @click="navigateTo('/favorites')"
          >
            <UIcon
              name="i-heroicons-heart"
              class="size-5 text-rp-love"
              aria-hidden="true"
            />
            <span class="text-sm font-medium text-rp-text">{{ $t('nav.favorites') }}</span>
          </button>
        </div>
      </div>

      <!-- Recent Searches -->
      <div
        v-if="history.length > 0"
        class="border-b border-rp-overlay/30 p-4"
      >
        <div class="mb-3 flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
            {{ $t('search.recentSearches') }}
          </p>
          <button
            type="button"
            class="text-xs text-rp-muted transition-colors hover:text-rp-love"
            @click="clearHistory"
          >
            {{ $t('search.clear') }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="term in history"
            :key="term"
            type="button"
            class="group flex items-center gap-1.5 rounded-lg bg-rp-overlay/40 px-3 py-1.5 text-sm text-rp-text transition-all hover:bg-rp-iris/20 hover:text-rp-iris"
            @click="searchTerm(term)"
          >
            <UIcon
              name="i-heroicons-clock"
              class="size-3.5 text-rp-muted group-hover:text-rp-iris"
            />
            {{ term }}
            <button
              type="button"
              class="ml-1 rounded p-0.5 text-rp-muted opacity-0 transition-all hover:bg-rp-love/20 hover:text-rp-love group-hover:opacity-100"
              @click.stop="removeFromHistory(term)"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="size-3"
              />
            </button>
          </button>
        </div>
      </div>

      <!-- Top Anime -->
      <div class="p-4">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wider text-rp-subtle">
            {{ $t('search.popularAnime') }}
          </p>
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-rp-iris transition-colors hover:text-rp-iris/80"
            @click="navigateTo('/search')"
          >
            {{ $t('nav.explore') }}
            <UIcon
              name="i-heroicons-arrow-right"
              class="size-3"
            />
          </button>
        </div>

        <!-- Loading state -->
        <div
          v-if="isLoadingTopAnime"
          class="space-y-2"
        >
          <div
            v-for="i in 5"
            :key="i"
            class="flex animate-pulse items-center gap-3 rounded-xl bg-rp-overlay/30 p-2"
          >
            <div class="size-10 rounded-lg bg-rp-overlay" />
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 w-3/4 rounded bg-rp-overlay" />
              <div class="h-2.5 w-1/4 rounded bg-rp-overlay" />
            </div>
          </div>
        </div>

        <!-- Top anime list -->
        <div
          v-else
          class="space-y-1"
        >
          <button
            v-for="(anime, index) in topAnime"
            :key="anime.mal_id"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-rp-overlay/50"
            @click="goToAnime(anime.mal_id)"
          >
            <div class="relative size-10 shrink-0 overflow-hidden rounded-lg bg-rp-overlay">
              <img
                v-if="anime.images?.webp?.small_image_url"
                :src="anime.images.webp.small_image_url"
                :alt="anime.title"
                class="size-full object-cover"
                loading="lazy"
              />
              <span
                class="absolute bottom-0 left-0 rounded-tr-md bg-rp-gold/90 px-1 py-0.5 text-[10px] font-bold text-rp-base"
              >
                {{ index + 1 }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-rp-text">
                {{ anime.title }}
              </p>
              <div class="flex items-center gap-2 text-xs text-rp-subtle">
                <span
                  v-if="anime.score"
                  class="flex items-center gap-0.5"
                >
                  <UIcon
                    name="i-heroicons-star-solid"
                    class="size-3 text-rp-gold"
                  />
                  {{ anime.score }}
                </span>
                <span v-if="anime.type">{{ anime.type }}</span>
              </div>
            </div>
            <UIcon
              name="i-heroicons-chevron-right"
              class="size-4 text-rp-muted"
            />
          </button>
        </div>
      </div>

      <!-- Browse by Genre -->
      <div class="border-t border-rp-overlay/30 p-4">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
          {{ $t('anime.genres') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="genre in popularGenres"
            :key="genre.value"
            type="button"
            class="rounded-lg bg-rp-overlay/40 px-3 py-1.5 text-sm text-rp-text transition-all hover:bg-rp-foam/20 hover:text-rp-foam"
            @click="searchByGenre(genre.value)"
          >
            {{ genre.label }}
          </button>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types'
import { animeApi } from '~/services/api/anime'

const modelValue = defineModel<boolean>({ default: false })

const router = useRouter()
const localePath = useLocalePath()
const { searchQuery } = useSearch()
const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const topAnime = ref<Anime[]>([])
const isLoadingTopAnime = ref(false)

const popularGenres = [
  { value: '1', label: 'Action' },
  { value: '22', label: 'Romance' },
  { value: '4', label: 'Comedy' },
  { value: '10', label: 'Fantasy' },
  { value: '2', label: 'Adventure' },
  { value: '24', label: 'Sci-Fi' },
]

// Load top anime when modal opens
watch(modelValue, async (open) => {
  if (open) {
    query.value = searchQuery.value
    nextTick(() => inputRef.value?.focus())

    // Load top anime if not already loaded
    if (topAnime.value.length === 0 && !isLoadingTopAnime.value) {
      isLoadingTopAnime.value = true
      try {
        const response = await animeApi.getTopAnime({ limit: 5 })
        topAnime.value = response.data || []
      } catch {
        // Silently fail - the section will just be empty
      } finally {
        isLoadingTopAnime.value = false
      }
    }
  }
})

function handleSearch() {
  modelValue.value = false
  const trimmedQuery = query.value.trim()
  if (trimmedQuery) {
    addToHistory(trimmedQuery)
    searchQuery.value = trimmedQuery
    router.push({ path: localePath('/search'), query: { q: trimmedQuery } })
  } else {
    router.push(localePath('/search'))
  }
}

function searchTerm(term: string) {
  query.value = term
  handleSearch()
}

function searchByGenre(genreId: string) {
  modelValue.value = false
  router.push({ path: localePath('/search'), query: { genres: genreId } })
}

function goToAnime(malId: number) {
  modelValue.value = false
  router.push(localePath(`/anime/${malId}`))
}

function navigateTo(path: string) {
  modelValue.value = false
  router.push(localePath(path))
}
</script>
