<template>
  <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
    <!-- Retry button (optional) -->
    <button
      v-if="showRetry"
      type="button"
      class="flex items-center gap-2 rounded-xl border border-rp-overlay bg-rp-surface/50 px-6 py-3 font-medium text-rp-text backdrop-blur-sm transition-all hover:border-rp-iris/50 hover:bg-rp-surface"
      @click="$emit('retry')"
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ $t('common.retry') }}
    </button>

    <!-- Go Home button -->
    <component
      :is="useEvents ? 'button' : NuxtLink"
      :to="useEvents ? undefined : localePath('/')"
      :type="useEvents ? 'button' : undefined"
      class="group flex items-center gap-2 rounded-xl bg-rp-iris px-6 py-3 font-medium text-white shadow-lg shadow-rp-iris/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rp-iris/30"
      @click="useEvents ? $emit('goHome') : undefined"
    >
      <svg
        class="size-5 transition-transform group-hover:-translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ $t('common.backHome') }}
    </component>

    <!-- Go Back button (optional) -->
    <button
      v-if="showBack"
      type="button"
      class="flex items-center gap-2 rounded-xl border border-rp-overlay bg-rp-surface/50 px-6 py-3 font-medium text-rp-text backdrop-blur-sm transition-all hover:border-rp-iris/50 hover:bg-rp-surface"
      @click="handleGoBack"
    >
      <svg
        class="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ $t('error.goBack') }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showRetry?: boolean
  showBack?: boolean
  /** Use event emits instead of direct navigation (for error.vue clearError handling) */
  useEvents?: boolean
}>()

const emit = defineEmits<{
  retry: []
  goHome: []
  goBack: []
}>()

const localePath = useLocalePath()
const router = useRouter()
const NuxtLink = resolveComponent('NuxtLink')

const handleGoBack = () => {
  if (props.useEvents) {
    emit('goBack')
    return
  }

  if (window.history.length > 2) {
    router.back()
  } else {
    navigateTo(localePath('/'))
  }
}
</script>
