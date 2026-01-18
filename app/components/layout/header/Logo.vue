<template>
  <NuxtLink
    :to="localePath('/')"
    class="logo-container group flex items-center gap-1.5 rounded-2xl px-3 py-2 backdrop-blur-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:gap-2 md:px-4"
    :class="isScrolled ? 'bg-rp-surface/95 shadow-lg shadow-rp-base/30' : 'bg-rp-surface/50'"
    :aria-label="$t('nav.home')"
  >
    <span class="text-base font-bold md:text-xl">
      <span class="text-rp-text">Vue</span>
      <span class="text-rp-iris">Nime</span>
    </span>
    <NuxtImg
      src="/images/straw-hat.webp"
      alt="Straw Hat Icon"
      aria-hidden="true"
      width="22"
      height="22"
      class="straw-hat -ml-5 -mr-1 rotate-18 -translate-x-1 -translate-y-1.5 drop-shadow-md"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  isScrolled: boolean
}>()

const localePath = useLocalePath()
</script>

<style scoped>
.straw-hat {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover .straw-hat {
  transform: rotate(2deg) translateY(-3px) scale(1.05);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}
</style>
