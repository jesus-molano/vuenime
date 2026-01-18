<template>
  <div class="mb-6 flex flex-wrap items-center justify-end gap-4 md:mb-8 md:justify-between">
    <p class="hidden text-sm text-rp-subtle md:block">
      {{ $t('favorites.showing', { count: favoritesCount }) }}
    </p>

    <div class="flex items-center gap-3">
      <!-- Clear All Button -->
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-rp-love/10 px-3 py-2 text-sm text-rp-love transition-all hover:bg-rp-love/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
        @click="$emit('clear')"
      >
        <UIcon
          name="i-heroicons-trash"
          class="size-4"
          aria-hidden="true"
        />
        <span class="hidden sm:inline">{{ $t('favorites.clearAll') }}</span>
      </button>

      <!-- Sort Buttons with Animated Indicator -->
      <div
        ref="sortContainerRef"
        class="relative flex rounded-xl bg-rp-surface/80 p-1 ring-1 ring-rp-overlay/50 backdrop-blur-sm"
        role="group"
        :aria-label="$t('favorites.sortLabel')"
      >
        <!-- Animated background indicator -->
        <div
          class="sort-indicator absolute inset-y-1 rounded-lg bg-linear-to-r from-rp-iris to-rp-love shadow-lg shadow-rp-iris/25 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          :style="indicatorStyle"
        />

        <UTooltip
          v-for="option in sortOptions"
          :key="option.value"
          :text="option.label"
          :delay-duration="200"
        >
          <button
            :data-sort="option.value"
            type="button"
            :aria-pressed="sortBy === option.value"
            :aria-label="option.label"
            class="sort-button relative z-10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            :class="sortBy === option.value ? 'text-white' : 'text-rp-subtle hover:text-rp-text'"
            @click="preferencesStore.setFavoritesSortBy(option.value)"
          >
            <UIcon
              :name="option.icon"
              class="size-4 transition-transform duration-200"
              :class="sortBy === option.value ? 'scale-110' : 'scale-100'"
              aria-hidden="true"
            />
            <span class="hidden xs:inline">{{ option.label }}</span>
          </button>
        </UTooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  clear: []
}>()

const { t } = useI18n()
const favoritesStore = useFavoritesStore()
const preferencesStore = usePreferencesStore()
const { favoritesCount } = storeToRefs(favoritesStore)
const { favoritesSortBy: sortBy } = storeToRefs(preferencesStore)

const sortContainerRef = ref<HTMLElement | null>(null)
const indicatorReady = ref(false)

onMounted(() => {
  nextTick(() => {
    indicatorReady.value = true
  })
})

const sortOptions = computed(() => [
  { value: 'recent' as const, label: t('favorites.sortRecent'), icon: 'i-heroicons-clock' },
  { value: 'score' as const, label: t('favorites.sortScore'), icon: 'i-heroicons-star' },
  { value: 'title' as const, label: t('favorites.sortTitle'), icon: 'i-heroicons-bars-arrow-down' },
])

const indicatorStyle = computed(() => {
  if (!indicatorReady.value || !sortContainerRef.value) {
    return { left: '4px', width: '0px', opacity: '0' }
  }

  const activeButton = sortContainerRef.value.querySelector(`[data-sort="${sortBy.value}"]`) as HTMLElement | null

  if (!activeButton) {
    return { left: '4px', width: '0px', opacity: '0' }
  }

  return {
    left: `${activeButton.offsetLeft}px`,
    width: `${activeButton.offsetWidth}px`,
    opacity: '1',
  }
})
</script>

<style scoped>
.sort-indicator {
  will-change: left, width;
}

.sort-indicator::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(to right, var(--rp-iris), var(--rp-love));
  opacity: 0.4;
  filter: blur(8px);
  z-index: -1;
}

.sort-button:not([aria-pressed='true']):hover {
  background: rgba(110, 106, 134, 0.15);
}

.sort-button[aria-pressed='true'] .size-4 {
  animation: pulse-icon 0.3s ease-out;
}

@keyframes pulse-icon {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
