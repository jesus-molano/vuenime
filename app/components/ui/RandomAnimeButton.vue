<template>
  <UTooltip
    :text="isLoading ? $t('nav.discovering') : $t('nav.randomAnime')"
    side="bottom"
    :delay-duration="300"
  >
    <button
      type="button"
      :aria-label="$t('nav.randomAnime')"
      :disabled="isLoading"
      class="group flex items-center justify-center rounded-xl p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-foam focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base disabled:cursor-not-allowed disabled:opacity-50"
      :class="[
        variant === 'nav'
          ? 'text-white hover:bg-rp-foam/10 hover:text-rp-foam'
          : 'text-rp-subtle hover:bg-rp-foam/10 hover:text-rp-foam',
      ]"
      @click="handleClick"
    >
      <UIcon
        :name="isLoading ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'"
        :class="[
          variant === 'nav' ? 'size-4' : 'size-6',
          isLoading && 'animate-spin',
          !isLoading && 'group-hover:animate-pulse',
        ]"
        aria-hidden="true"
      />
      <span
        v-if="showLabel"
        class="ml-1.5 text-sm font-medium"
      >
        {{ isLoading ? $t('nav.discovering') : $t('nav.randomAnime') }}
      </span>
    </button>
  </UTooltip>
</template>

<script setup lang="ts">
import { animeApi } from '~/services/api'

withDefaults(
  defineProps<{
    variant?: 'nav' | 'dock'
    showLabel?: boolean
  }>(),
  {
    variant: 'nav',
    showLabel: false,
  }
)

const route = useRoute()
const localePath = useLocalePath()
const isLoading = ref(false)

const MAX_RETRIES = 3

const fetchRandomAnime = async (retryCount = 0): Promise<void> => {
  try {
    const response = await animeApi.getRandom()
    if (response?.data?.mal_id) {
      const newId = response.data.mal_id
      const currentId = route.params.id
      const targetPath = localePath(`/anime/${newId}`)

      // If we're on an anime detail page and got the same anime, try again (max 3 times)
      if (currentId && String(currentId) === String(newId) && retryCount < MAX_RETRIES) {
        return fetchRandomAnime(retryCount + 1)
      }

      await navigateTo(targetPath)
    }
  } catch (error) {
    console.error('Failed to fetch random anime:', error)
  }
}

const handleClick = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await fetchRandomAnime()
  } finally {
    isLoading.value = false
  }
}
</script>
