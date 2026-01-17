<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Header -->
    <section class="relative overflow-hidden bg-rp-base pb-8 pt-24 md:pb-12 md:pt-32">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-linear-to-b from-rp-love/10 via-rp-base to-rp-base" />

      <UContainer class="relative z-10 px-4 sm:px-6">
        <div class="mx-auto max-w-4xl text-center">
          <!-- Icon -->
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/20 md:size-20">
            <UIcon name="i-heroicons-heart-solid" class="size-8 text-rp-love md:size-10" />
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-rp-text md:text-4xl lg:text-5xl">
            {{ $t('favorites.title') }}
          </h1>

          <!-- Subtitle -->
          <p class="mx-auto mt-3 max-w-2xl text-rp-subtle md:mt-4 md:text-lg">
            {{ $t('favorites.subtitle') }}
          </p>

          <!-- Stats -->
          <div v-if="favoritesCount > 0" class="mt-6 flex justify-center gap-6">
            <div class="rounded-xl bg-rp-surface px-4 py-2">
              <span class="text-lg font-bold text-rp-love md:text-xl">{{ favoritesCount }}</span>
              <span class="ml-2 text-sm text-rp-subtle">{{ $t('favorites.animeCount') }}</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content -->
    <section class="pb-16 md:pb-24">
      <UContainer class="px-4 sm:px-6">
        <!-- Empty State -->
        <div
          v-if="favoritesCount === 0"
          class="mx-auto flex max-w-md flex-col items-center py-16 text-center"
        >
          <div class="mb-6 flex size-24 items-center justify-center rounded-full bg-rp-surface">
            <UIcon name="i-heroicons-heart" class="size-12 text-rp-muted" />
          </div>
          <h2 class="text-xl font-semibold text-rp-text md:text-2xl">
            {{ $t('favorites.emptyTitle') }}
          </h2>
          <p class="mt-2 text-rp-subtle">
            {{ $t('favorites.emptyDesc') }}
          </p>
          <NuxtLink
            to="/"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-rp-iris px-6 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/80"
          >
            <UIcon name="i-heroicons-magnifying-glass" class="size-5" />
            {{ $t('favorites.exploreAnime') }}
          </NuxtLink>
        </div>

        <!-- Favorites Grid -->
        <template v-else>
          <!-- Sort Controls -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
            <p class="text-sm text-rp-subtle">
              {{ $t('favorites.showing', { count: favoritesCount }) }}
            </p>
            <div class="flex gap-2">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                class="rounded-lg px-3 py-1.5 text-sm transition-all"
                :class="sortBy === option.value
                  ? 'bg-rp-iris text-rp-base'
                  : 'bg-rp-surface text-rp-subtle hover:bg-rp-overlay hover:text-rp-text'"
                @click="sortBy = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            <FavoriteCard
              v-for="anime in displayedFavorites"
              :key="anime.mal_id"
              :anime="anime"
              @remove="handleRemove"
            />
          </div>

          <!-- Clear All Button -->
          <div class="mt-12 text-center">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-rp-surface px-4 py-2 text-sm text-rp-subtle transition-all hover:bg-rp-love/20 hover:text-rp-love"
              @click="showClearConfirm = true"
            >
              <UIcon name="i-heroicons-trash" class="size-4" />
              {{ $t('favorites.clearAll') }}
            </button>
          </div>
        </template>
      </UContainer>
    </section>

    <!-- Clear Confirmation Modal -->
    <UModal v-model:open="showClearConfirm">
      <template #content>
        <div class="p-6 text-center">
          <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/20">
            <UIcon name="i-heroicons-exclamation-triangle" class="size-8 text-rp-love" />
          </div>
          <h3 class="text-lg font-semibold text-rp-text">
            {{ $t('favorites.clearConfirmTitle') }}
          </h3>
          <p class="mt-2 text-sm text-rp-subtle">
            {{ $t('favorites.clearConfirmDesc') }}
          </p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              class="rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay"
              @click="showClearConfirm = false"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              class="rounded-lg bg-rp-love px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rp-love/80"
              @click="handleClearAll"
            >
              {{ $t('favorites.clearAll') }}
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FavoriteAnime } from '~/stores/favorites'

const { t } = useI18n()
const favoritesStore = useFavoritesStore()
const { favorites, favoritesCount } = storeToRefs(favoritesStore)

const showClearConfirm = ref(false)
const sortBy = ref<'recent' | 'score' | 'title'>('recent')

const sortOptions = computed(() => [
  { value: 'recent' as const, label: t('favorites.sortRecent') },
  { value: 'score' as const, label: t('favorites.sortScore') },
  { value: 'title' as const, label: t('favorites.sortTitle') },
])

const displayedFavorites = computed(() => {
  switch (sortBy.value) {
    case 'score':
      return favoritesStore.sortFavoritesByScore()
    case 'title':
      return favoritesStore.sortFavoritesByTitle()
    default:
      return favoritesStore.sortedFavorites
  }
})

const handleRemove = (malId: number) => {
  favoritesStore.removeFavorite(malId)
}

const handleClearAll = () => {
  favoritesStore.clearFavorites()
  showClearConfirm.value = false
}

useSeoMeta({
  title: () => `${t('favorites.title')} | VueNime`,
  description: () => t('favorites.subtitle'),
})
</script>
