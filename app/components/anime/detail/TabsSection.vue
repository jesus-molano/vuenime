<template>
  <section
    v-scroll-reveal.fade-up
    class="py-4 sm:py-6 md:py-8"
  >
    <UContainer class="px-3 sm:px-6">
      <!-- Tabs Navigation -->
      <AnimeDetailTabsNavigation
        v-model="activeTab"
        :tabs="tabs"
      />

      <!-- Tab Content - Only active tab is mounted, KeepAlive preserves state -->
      <div class="mt-4 sm:mt-6">
        <KeepAlive>
          <Transition
            name="tab-fade"
            mode="out-in"
          >
            <component
              :is="tabComponents[activeTab]"
              :key="activeTab"
              :anime-id="animeId"
              :active="true"
            />
          </Transition>
        </KeepAlive>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import type { Tab } from './TabsNavigation.vue'

const { animeId } = defineProps<{
  animeId: string | number
}>()

const { t } = useI18n()

const tabs = computed<Tab[]>(() => [
  { id: 'characters', label: t('detail.characters'), icon: 'i-heroicons-users' },
  { id: 'recommendations', label: t('detail.recommendations'), icon: 'i-heroicons-hand-thumb-up' },
  { id: 'reviews', label: t('detail.reviews'), icon: 'i-heroicons-chat-bubble-left-right' },
  { id: 'news', label: t('detail.news'), icon: 'i-heroicons-newspaper' },
])

const activeTab = ref('characters')

const tabComponents: Record<string, ReturnType<typeof resolveComponent>> = {
  characters: resolveComponent('AnimeDetailCharactersTab'),
  recommendations: resolveComponent('AnimeDetailRecommendationsTab'),
  reviews: resolveComponent('AnimeDetailReviewsTab'),
  news: resolveComponent('AnimeDetailNewsTab'),
}
</script>

<style scoped>
.tab-fade-enter-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.tab-fade-leave-active {
  transition: opacity 0.15s ease-in;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-fade-leave-to {
  opacity: 0;
}
</style>
