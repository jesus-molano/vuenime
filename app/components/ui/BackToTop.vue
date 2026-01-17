<template>
  <Transition name="fade-slide">
    <button
      v-show="isVisible"
      type="button"
      class="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-rp-surface shadow-lg ring-1 ring-white/10 transition-all hover:bg-rp-overlay hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:bottom-8 md:right-8"
      :aria-label="$t('home.backToTop')"
      @click="scrollToTop"
    >
      <UIcon
        name="i-heroicons-chevron-up"
        class="size-6 text-rp-text"
      />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const { isVisible, scrollToTop } = useBackToTop()
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
