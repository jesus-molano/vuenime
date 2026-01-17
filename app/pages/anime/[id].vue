<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Error State -->
    <div v-if="error && !anime" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/10">
          <UIcon name="i-heroicons-exclamation-triangle" class="size-8 text-rp-love" />
        </div>
        <p class="mb-4 text-rp-subtle">{{ $t('common.error') }}</p>
        <button
          class="rounded-xl bg-rp-surface px-6 py-3 font-medium text-rp-text transition-all hover:bg-rp-overlay"
          @click="refresh()"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="anime">
      <AnimeDetailHero :anime="anime" />
      <AnimeDetailInfoSection :anime="anime" />
      <AnimeDetailSynopsis
        :title="$t('anime.synopsis')"
        :text="anime.synopsis"
        icon="i-heroicons-document-text"
        color="rose"
      />
      <AnimeDetailTrailer :trailer="anime.trailer" />
    </template>

    <!-- Loading Skeleton -->
    <template v-else-if="isLoading">
      <AnimeDetailSkeleton :anime-id="animeId" />
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const animeId = computed(() => route.params.id as string)
const { anime, isLoading, error, refresh } = useAnimeDetail(animeId)

useSeoMeta({
  title: () => anime.value ? `${anime.value.title} | VueNime` : 'Loading... | VueNime',
  description: () => anime.value?.synopsis?.slice(0, 160) || '',
  ogTitle: () => anime.value?.title || 'VueNime',
  ogDescription: () => anime.value?.synopsis?.slice(0, 160) || '',
  ogImage: () => anime.value?.images.jpg.large_image_url || '',
})
</script>
