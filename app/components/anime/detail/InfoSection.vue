<template>
  <section class="bg-rp-surface/30 py-12 md:py-20">
    <UContainer class="px-4 sm:px-6">
      <AnimeDetailSectionHeader
        icon="i-heroicons-information-circle-solid"
        :title="$t('anime.details')"
        color="foam"
      />

      <!-- Info Grid -->
      <div class="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimeDetailInfoCard
          v-if="anime.type"
          icon="i-heroicons-tv"
          :label="$t('anime.type')"
          :value="anime.type"
        />
        <AnimeDetailInfoCard
          v-if="anime.episodes"
          icon="i-heroicons-play"
          :label="$t('anime.episodes')"
          :value="anime.episodes"
        />
        <AnimeDetailInfoCard
          v-if="anime.status"
          icon="i-heroicons-signal"
          :label="$t('anime.status')"
          :value="anime.status"
        />
        <AnimeDetailInfoCard
          v-if="anime.season && anime.year"
          icon="i-heroicons-calendar"
          :label="$t('anime.season')"
          :value="`${anime.season} ${anime.year}`"
          value-class="capitalize"
        />
        <AnimeDetailInfoCard
          v-if="anime.aired?.string"
          icon="i-heroicons-calendar-days"
          :label="$t('anime.aired')"
          :value="anime.aired.string"
        />
        <AnimeDetailInfoCard
          v-if="anime.duration"
          icon="i-heroicons-clock"
          :label="$t('anime.duration')"
          :value="anime.duration"
        />
        <AnimeDetailInfoCard
          v-if="anime.source"
          icon="i-heroicons-book-open"
          :label="$t('anime.source')"
          :value="anime.source"
        />
        <AnimeDetailInfoCard
          v-if="anime.rating"
          icon="i-heroicons-shield-check"
          :label="$t('anime.rating')"
          :value="anime.rating"
        />
      </div>

      <!-- Stats Cards -->
      <div class="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimeDetailStatCard
          v-if="anime.score"
          icon="i-heroicons-star-solid"
          :label="$t('anime.score')"
          :value="anime.score.toFixed(2)"
          :subtitle="anime.scored_by ? `${formatNumber(anime.scored_by)} ${$t('anime.votes')}` : undefined"
          color="gold"
        />
        <AnimeDetailStatCard
          v-if="anime.rank"
          icon="i-heroicons-trophy"
          :label="$t('anime.rank')"
          :value="anime.rank"
          prefix="#"
          color="iris"
        />
        <AnimeDetailStatCard
          v-if="anime.popularity"
          icon="i-heroicons-chart-bar"
          :label="$t('anime.popularity')"
          :value="anime.popularity"
          prefix="#"
          color="foam"
        />
        <AnimeDetailStatCard
          v-if="anime.members"
          icon="i-heroicons-user-group"
          :label="$t('anime.members')"
          :value="formatNumber(anime.members)"
          color="rose"
        />
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

defineProps<{
  anime: Anime
}>()
</script>
