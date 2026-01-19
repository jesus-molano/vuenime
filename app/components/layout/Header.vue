<template>
  <header class="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-4 md:top-6 md:px-6">
    <!-- Logo -->
    <LayoutHeaderLogo :is-scrolled="isScrolled" />

    <div class="flex items-center gap-2 md:gap-3">
      <!-- Navbar pill -->
      <nav
        role="navigation"
        :aria-label="$t('nav.main')"
        class="nav-container flex items-center gap-1 rounded-2xl px-3 py-2 backdrop-blur-xl md:gap-2 md:px-4 md:py-2.5"
        :class="isScrolled ? 'nav-scrolled' : 'nav-top'"
      >
        <!-- Nav links (desktop only) -->
        <LayoutHeaderNav />

        <!-- Auth + Language -->
        <LayoutHeaderActions />
      </nav>

      <!-- Search button (tablet+ only) -->
      <LayoutSearchPill @click="$emit('search')" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  isScrolled: boolean
}>()

defineEmits<{
  search: []
}>()
</script>

<style scoped>
.nav-container {
  transition:
    background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-top {
  background-color: transparent;
  box-shadow: none;
}

.nav-scrolled {
  background-color: rgb(25 23 36 / 0.95);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
