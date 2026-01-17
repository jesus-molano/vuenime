<template>
  <section class="relative overflow-hidden bg-rp-base">
    <!-- Background with video trailer if available -->
    <AnimeDetailHeroBackground
      :image-url="anime.images.webp.large_image_url"
      :title="anime.title"
      :trailer="anime.trailer"
    />

    <!-- Favorite Button - Top Right -->
    <button
      type="button"
      :aria-pressed="isFavorite"
      class="absolute right-4 top-20 z-30 flex size-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:right-6 md:top-24 md:size-14"
      :class="
        isFavorite
          ? 'bg-rp-love text-white focus-visible:ring-rp-love'
          : 'bg-rp-base/80 text-white backdrop-blur-sm hover:bg-rp-love focus-visible:ring-rp-iris'
      "
      :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
      @click="toggleFavorite"
    >
      <UIcon
        :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
        class="size-6 md:size-7"
        aria-hidden="true"
      />
    </button>

    <!-- Content Container -->
    <div class="relative z-20 pb-12 pt-24 md:pb-16 md:pt-28">
      <UContainer class="w-full px-4 sm:px-6">
        <div class="flex flex-col gap-6 md:flex-row md:items-start md:gap-10 lg:gap-14">
          <AnimeDetailHeroPoster :anime="anime" />
          <AnimeDetailHeroInfo :anime="anime" />
        </div>
      </UContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.anime.mal_id))

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.anime)
}
</script>
