<template>
  <div
    class="fixed inset-x-0 z-40 hidden justify-center md:flex"
    :style="{ bottom: `calc(${footerHeight + 24}px)` }"
  >
    <Transition name="search-slide">
      <button
        v-if="isVisible"
        class="group flex items-center gap-3 rounded-2xl border border-rp-overlay/50 bg-rp-surface/95 px-5 py-3 shadow-2xl shadow-rp-base/50 backdrop-blur-xl transition-all hover:border-rp-iris/50 hover:shadow-rp-iris/20"
        @click="$emit('click')"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="size-5 text-rp-muted transition-colors group-hover:text-rp-iris"
        />
        <span class="text-sm text-rp-subtle">{{
          $t('home.searchPlaceholder')
        }}</span>
        <kbd class="rounded-lg bg-rp-overlay px-2 py-0.5 text-xs font-medium text-rp-text"
          >&#8984;K</kbd
        >
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean
  footerHeight: number
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
