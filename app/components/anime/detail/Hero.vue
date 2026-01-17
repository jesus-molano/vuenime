<template>
  <section class="relative overflow-hidden bg-rp-base">
    <!-- Background with video trailer if available -->
    <AnimeDetailHeroBackground
      :image-url="anime.images.webp.large_image_url"
      :title="anime.title"
      :trailer="anime.trailer"
    />

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

defineProps<{
  anime: Anime
}>()
</script>
