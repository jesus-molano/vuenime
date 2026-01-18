<template>
  <UiCarouselSection
    icon="i-heroicons-rocket-launch"
    icon-bg-class="bg-rp-love/10"
    icon-class="text-rp-love"
    :title="$t('home.upcomingAnime')"
    :subtitle="$t('home.upcomingSubtitle')"
    :is-loading="isLoading"
    :is-empty="false"
  >
    <div
      v-for="anime in animeList"
      :key="anime.mal_id"
      class="w-28 shrink-0 snap-start xs:w-32 sm:w-36 md:w-40 lg:w-44"
    >
      <AnimeCarouselCard :anime="anime" />
    </div>
  </UiCarouselSection>
</template>

<script setup lang="ts">
const { animeList, isLoading } = useUpcomingSeason()
</script>
