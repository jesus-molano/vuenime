<template>
  <header class="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-4 md:top-6 md:px-6">
    <!-- Logo (izquierda) - con fondo para contraste -->
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

    <div class="flex items-center gap-2 md:gap-3">
      <!-- Navbar pill -->
      <nav
        role="navigation"
        :aria-label="$t('nav.main')"
        class="nav-container flex items-center gap-1 rounded-2xl px-3 py-2 backdrop-blur-xl md:gap-2 md:px-4 md:py-2.5"
        :class="isScrolled ? 'nav-scrolled' : 'nav-top'"
      >
        <!-- Nav links hidden on mobile - MobileDock handles them -->
        <NuxtLink
          :to="localePath('/')"
          class="nav-link-explore group hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:flex"
          :class="$route.path === localePath('/') ? 'bg-rp-gold/10 text-rp-gold' : 'text-white hover:text-rp-gold'"
          :aria-current="$route.path === localePath('/') ? 'page' : undefined"
        >
          <UIcon
            name="i-heroicons-fire-solid"
            class="nav-icon-fire size-4"
            aria-hidden="true"
          />
          <span>{{ $t('nav.explore') }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/favorites')"
          class="group hidden items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-love/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:flex"
          :class="
            $route.path === localePath('/favorites') ? 'bg-rp-love/10 text-rp-love' : 'text-white hover:text-rp-love'
          "
          :aria-current="$route.path === localePath('/favorites') ? 'page' : undefined"
        >
          <span
            class="nav-icon-favorites relative flex size-4 items-center justify-center"
            aria-hidden="true"
          >
            <UIcon
              name="i-heroicons-heart"
              class="absolute size-4 transition-all group-hover:opacity-0"
            />
            <UIcon
              name="i-heroicons-heart-solid"
              class="nav-icon-heart absolute size-4 opacity-0 transition-all group-hover:opacity-100"
            />
          </span>
          <span>{{ $t('nav.favorites') }}</span>
        </NuxtLink>

        <UiRandomAnimeButton
          variant="nav"
          :show-label="true"
          class="hidden md:flex"
        />

        <AuthButton />

        <div
          class="h-4 w-px bg-white/10"
          aria-hidden="true"
        />

        <LayoutLangSelector />
      </nav>

      <!-- Search button (tablet+ only, MobileDock handles mobile) -->
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

const localePath = useLocalePath()
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

.straw-hat {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover .straw-hat {
  transform: rotate(2deg) translateY(-3px) scale(1.05);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
}

/* Uses global animations from main.css */
.nav-link-explore:hover .nav-icon-fire {
  animation: nav-fire 0.4s ease-in-out infinite;
}

.group:hover .nav-icon-heart {
  animation: nav-heartbeat 0.6s ease-in-out infinite;
  filter: drop-shadow(0 0 4px rgb(var(--rp-love)));
}

.nav-icon-favorites::before,
.nav-icon-favorites::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgb(var(--rp-love));
  opacity: 0;
  pointer-events: none;
}

.group:hover .nav-icon-favorites::before {
  top: 0;
  right: 0;
  animation: nav-particle-right 0.8s ease-out infinite;
}

.group:hover .nav-icon-favorites::after {
  top: 0;
  left: 0;
  animation: nav-particle-left 0.8s ease-out 0.2s infinite;
}
</style>
