<template>
  <div
    id="tabpanel-characters"
    role="tabpanel"
    aria-labelledby="tab-characters"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-6 lg:grid-cols-8"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="flex animate-pulse flex-col items-center"
      >
        <div class="mb-2 size-16 rounded-full bg-rp-overlay sm:size-20 md:size-24" />
        <div class="h-2.5 w-14 rounded bg-rp-overlay sm:w-16" />
        <div class="mt-1 h-2 w-10 rounded bg-rp-overlay sm:w-12" />
      </div>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="characters.length === 0"
      icon="i-heroicons-users"
      :message="$t('detail.noCharacters')"
    />

    <!-- Characters Grid -->
    <div
      v-else
      class="space-y-4 pb-20 sm:space-y-6 sm:pb-0"
    >
      <!-- Main Characters -->
      <div v-if="mainCharacters.length > 0">
        <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-rp-muted sm:mb-3 sm:text-xs">
          {{ $t('detail.mainRole') }}
        </h3>
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">
          <AnimeDetailCharacterCard
            v-for="character in mainCharacters"
            :key="character.character.mal_id"
            :character="character"
          />
        </div>
      </div>

      <!-- Supporting Characters -->
      <div v-if="supportingCharacters.length > 0">
        <h3 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-rp-muted sm:mb-3 sm:text-xs">
          {{ $t('detail.supportingRole') }}
        </h3>
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">
          <AnimeDetailCharacterCard
            v-for="character in displayedItems"
            :key="character.character.mal_id"
            :character="character"
          />
        </div>

        <UiShowMoreButton
          class="mt-4"
          :show="hasMore"
          :count="remainingCount"
          @click="loadMore"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animeId: string | number
}>()

const animeIdRef = computed(() => props.animeId)
const { characters, mainCharacters, supportingCharacters, isLoading } = useAnimeCharacters(animeIdRef)

const { displayedItems, hasMore, remainingCount, loadMore } = useShowMore(supportingCharacters, {
  initialCount: 10,
  pageSize: 10,
})
</script>
