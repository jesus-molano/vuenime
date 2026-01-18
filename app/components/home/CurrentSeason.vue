<template>
  <UiCarouselSection
    :icon="seasonIcon"
    icon-bg-class="bg-rp-iris/10"
    icon-class="text-rp-iris"
    :title="$t('home.currentSeason')"
    :subtitle="formattedSeason"
    capitalize
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
const { t } = useI18n()

const { animeList, isLoading, seasonName } = useCurrentSeason()

const seasonIcon = computed(() => {
  const icons: Record<string, string> = {
    winter: 'i-heroicons-sparkles',
    spring: 'i-heroicons-sun',
    summer: 'i-heroicons-fire',
    fall: 'i-heroicons-cloud',
  }
  return icons[seasonName.value.season] || 'i-heroicons-calendar'
})

const formattedSeason = computed(() => {
  const seasonNames: Record<string, string> = {
    winter: t('seasons.winter'),
    spring: t('seasons.spring'),
    summer: t('seasons.summer'),
    fall: t('seasons.fall'),
  }
  return `${seasonNames[seasonName.value.season] || seasonName.value.season} ${seasonName.value.year}`
})
</script>
