<template>
  <UiCarouselSection
    icon="i-heroicons-calendar-days"
    icon-bg-class="bg-rp-foam/10"
    icon-class="text-rp-foam"
    :title="$t('home.todaySchedule')"
    :subtitle="formattedDay"
    capitalize
    :is-loading="isLoading"
    :is-empty="animeList.length === 0"
    empty-icon="i-heroicons-calendar"
    :empty-message="$t('home.noAiringToday')"
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

const { today, animeList, isLoading } = useSchedule()

const formattedDay = computed(() => {
  const dayNames: Record<string, string> = {
    sunday: t('days.sunday'),
    monday: t('days.monday'),
    tuesday: t('days.tuesday'),
    wednesday: t('days.wednesday'),
    thursday: t('days.thursday'),
    friday: t('days.friday'),
    saturday: t('days.saturday'),
  }
  return dayNames[today.value] || today.value
})
</script>
