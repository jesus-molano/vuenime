<template>
  <div class="min-h-screen bg-rp-base">
    <LayoutHeader
      :is-scrolled="isScrolled"
      @search="toggleSearch"
    />

    <LayoutSearchModal v-model="isSearchOpen" />

    <LayoutMobileDock
      :footer-height="footerHeight"
      :visible="isDockVisible"
      @toggle-search="toggleSearch"
    />

    <main>
      <slot />
    </main>

    <LayoutFooter @height-change="footerHeight = $event" />
  </div>
</template>

<script setup lang="ts">
import { rafThrottle } from '~/utils/throttle'

const { isSearchOpen, toggleSearch } = useSearch()

const isScrolled = ref(false)
const footerHeight = ref(0)

// Dock visibility - Safari-style hide on scroll down, show on scroll up
const lastScrollY = ref(0)
const isDockVisible = ref(true)

const updateScrollState = () => {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > 100

  // Keep dock visible when footer is visible (footerHeight > 0)
  // Otherwise, show on scroll up or near top
  isDockVisible.value = footerHeight.value > 0 || currentScrollY < lastScrollY.value || currentScrollY < 100
  lastScrollY.value = currentScrollY
}

// Throttle scroll handler to once per animation frame
const handleScroll = rafThrottle(updateScrollState)

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    toggleSearch()
  }
  if (e.key === 'Escape' && isSearchOpen.value) {
    toggleSearch()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  updateScrollState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  handleScroll.cancel()
})
</script>
