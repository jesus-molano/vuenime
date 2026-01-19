<template>
  <div class="hidden items-center gap-1 md:flex md:gap-2">
    <NuxtLink
      :to="localePath('/')"
      class="nav-link-explore group flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
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
      class="group flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-love/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
      :class="$route.path === localePath('/favorites') ? 'bg-rp-love/10 text-rp-love' : 'text-white hover:text-rp-love'"
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
    />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>

<style scoped>
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
