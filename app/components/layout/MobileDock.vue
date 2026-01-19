<template>
  <div
    class="fixed inset-x-0 z-50 flex justify-center transition-transform duration-300 ease-out md:hidden"
    :class="{ 'translate-y-[calc(100%+2rem)]': !visible }"
    :style="{ bottom: `calc(${footerHeight}px + max(1rem, env(safe-area-inset-bottom, 0px)))` }"
  >
    <nav
      role="navigation"
      :aria-label="$t('nav.main')"
      class="flex items-center gap-1.5 rounded-2xl border border-rp-overlay/50 bg-rp-surface/95 p-2 shadow-2xl shadow-rp-base/50 backdrop-blur-xl"
    >
      <UTooltip
        :text="$t('nav.explore')"
        side="top"
        :delay-duration="300"
      >
        <NuxtLink
          :to="localePath('/')"
          :aria-label="$t('nav.explore')"
          :aria-current="$route.path === '/' ? 'page' : undefined"
          class="nav-link-explore group relative flex items-center justify-center rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          :class="
            $route.path === '/' ? 'bg-rp-gold/20 text-rp-gold' : 'text-rp-subtle hover:bg-rp-gold/10 hover:text-rp-gold'
          "
        >
          <UIcon
            name="i-heroicons-fire-solid"
            class="nav-icon-fire size-6"
            aria-hidden="true"
          />
        </NuxtLink>
      </UTooltip>

      <UiRandomAnimeButton variant="dock" />

      <UTooltip
        :text="$t('common.search')"
        side="top"
        :delay-duration="300"
      >
        <button
          type="button"
          :aria-label="$t('common.search')"
          class="group flex items-center justify-center rounded-xl p-3 text-rp-subtle transition-all hover:bg-rp-iris/10 hover:text-rp-iris active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          @click="$emit('toggleSearch')"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="size-6"
            aria-hidden="true"
          />
        </button>
      </UTooltip>

      <UTooltip
        :text="$t('nav.favorites')"
        side="top"
        :delay-duration="300"
      >
        <NuxtLink
          :to="localePath('/favorites')"
          :aria-label="$t('nav.favorites')"
          :aria-current="$route.path === '/favorites' ? 'page' : undefined"
          class="nav-link-favorites group relative flex items-center justify-center rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          :class="
            $route.path === '/favorites'
              ? 'bg-rp-love/20 text-rp-love'
              : 'text-rp-subtle hover:bg-rp-love/10 hover:text-rp-love'
          "
        >
          <span
            class="nav-icon-favorites relative flex size-6 items-center justify-center"
            aria-hidden="true"
          >
            <UIcon
              name="i-heroicons-heart"
              class="absolute size-6 transition-all group-hover:opacity-0"
            />
            <UIcon
              name="i-heroicons-heart-solid"
              class="nav-icon-heart absolute size-6 opacity-0 transition-all group-hover:opacity-100"
            />
          </span>
        </NuxtLink>
      </UTooltip>
    </nav>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  footerHeight: number
  visible: boolean
}>()

defineEmits<{
  toggleSearch: []
}>()

const localePath = useLocalePath()
</script>

<style scoped>
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
