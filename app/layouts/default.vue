<template>
  <div class="min-h-screen bg-rp-base">
    <LayoutHeader :is-scrolled="isScrolled" />

    <LayoutSearchPill
      :is-scrolled="isScrolled"
      :footer-height="footerHeight"
      @click="toggleSearch"
    />

    <LayoutSearchModal v-model="isSearchOpen" />

    <LayoutMobileDock
      :is-visible="isScrolled"
      :footer-height="footerHeight"
      @toggle-search="toggleSearch"
    />

    <main>
      <slot />
    </main>

    <LayoutFooter @height-change="footerHeight = $event" />
  </div>
</template>

<script setup lang="ts">
const { isSearchOpen, toggleSearch } = useSearch()

const isScrolled = ref(false)
const footerHeight = ref(0)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

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
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
