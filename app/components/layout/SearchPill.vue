<template>
  <!-- Tablet (md-lg): Bottom-right -->
  <button
    type="button"
    :aria-label="$t('common.search')"
    class="group fixed bottom-6 right-6 z-40 hidden items-center gap-1.5 rounded-xl border border-rp-overlay/50 bg-rp-surface/95 px-3 py-2 shadow-xl shadow-rp-base/40 backdrop-blur-xl transition-all duration-300 hover:border-rp-iris/50 hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:flex lg:hidden"
    @click="$emit('click')"
  >
    <UIcon
      name="i-heroicons-magnifying-glass"
      class="size-4 text-white/80 transition-colors group-hover:text-rp-iris"
      aria-hidden="true"
    />
    <kbd
      class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white/90"
      aria-hidden="true"
    >
      ⌘K
    </kbd>
  </button>

  <!-- Desktop (lg+): Top-right, aligned with navbar -->
  <button
    type="button"
    :aria-label="$t('common.search')"
    class="group fixed right-6 top-7 z-40 hidden items-center gap-1.5 rounded-xl border border-rp-overlay/50 bg-rp-surface/90 px-2.5 py-2 shadow-lg shadow-rp-base/30 backdrop-blur-xl transition-all duration-300 hover:border-rp-iris/50 hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base lg:flex"
    @click="$emit('click')"
  >
    <UIcon
      name="i-heroicons-magnifying-glass"
      class="size-3.5 text-white/80 transition-colors group-hover:text-rp-iris"
      aria-hidden="true"
    />
    <!-- Text container with grid animation -->
    <div
      class="search-text-container grid transition-all duration-300 ease-out"
      :class="isScrolled ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'"
    >
      <span class="overflow-hidden whitespace-nowrap text-xs text-white/90">
        {{ $t('home.searchPlaceholder') }}
      </span>
    </div>
    <kbd
      class="rounded bg-white/20 px-1 py-0.5 text-[10px] font-medium text-white/90"
      aria-hidden="true"
    >
      ⌘K
    </kbd>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isScrolled: boolean
  footerHeight: number
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.search-text-container {
  transition: grid-template-columns 0.3s ease-out;
}

.search-text-container > span {
  min-width: 0;
}
</style>
