<template>
  <div
    class="fixed inset-x-0 z-50 flex justify-center md:hidden"
    :style="{ bottom: `calc(${footerHeight}px + max(1rem, env(safe-area-inset-bottom, 0px)))` }">
    <Transition name="dock-slide">
      <nav
        v-if="isVisible"
        role="navigation"
        :aria-label="$t('nav.main')"
        class="flex items-center gap-1.5 rounded-2xl border border-rp-overlay/50 bg-rp-surface/95 p-2 shadow-2xl shadow-rp-base/50 backdrop-blur-xl">
        <UTooltip :text="$t('nav.explore')" side="top" :delay-duration="300">
          <NuxtLink
            to="/"
            :aria-label="$t('nav.explore')"
            :aria-current="$route.path === '/' ? 'page' : undefined"
            class="nav-link-explore group relative flex items-center justify-center rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            :class="$route.path === '/'
              ? 'bg-rp-gold/20 text-rp-gold'
              : 'text-rp-subtle hover:bg-rp-gold/10 hover:text-rp-gold'
            ">
            <UIcon name="i-heroicons-fire-solid" class="nav-icon-fire size-6" aria-hidden="true" />
          </NuxtLink>
        </UTooltip>

        <UTooltip :text="$t('common.search')" side="top" :delay-duration="300">
          <button
            type="button"
            :aria-label="$t('common.search')"
            class="group flex items-center justify-center rounded-xl bg-linear-to-r from-rp-iris to-rp-love p-3 text-white shadow-lg shadow-rp-iris/30 transition-all hover:shadow-rp-iris/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            @click="$emit('toggleSearch')">
            <UIcon name="i-heroicons-magnifying-glass" class="size-6" aria-hidden="true" />
          </button>
        </UTooltip>

        <UTooltip :text="$t('nav.favorites')" side="top" :delay-duration="300">
          <NuxtLink
            to="/favorites"
            :aria-label="$t('nav.favorites')"
            :aria-current="$route.path === '/favorites' ? 'page' : undefined"
            class="nav-link-favorites group relative flex items-center justify-center rounded-xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
            :class="$route.path === '/favorites'
              ? 'bg-rp-love/20 text-rp-love'
              : 'text-rp-subtle hover:bg-rp-love/10 hover:text-rp-love'
            ">
            <span class="nav-icon-favorites relative flex size-6 items-center justify-center" aria-hidden="true">
              <UIcon name="i-heroicons-heart" class="absolute size-6 transition-all group-hover:opacity-0" />
              <UIcon
                name="i-heroicons-heart-solid"
                class="nav-icon-heart absolute size-6 opacity-0 transition-all group-hover:opacity-100" />
            </span>
          </NuxtLink>
        </UTooltip>
      </nav>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean
  footerHeight: number
}>()

defineEmits<{
  toggleSearch: []
}>()
</script>

<style scoped>
.dock-slide-enter-active,
.dock-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-slide-enter-from,
.dock-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fire {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 2px #f6c177);
  }

  25% {
    transform: scale(1.15) rotate(-5deg);
    filter: drop-shadow(0 0 6px #f6c177);
  }

  50% {
    transform: scale(1.2) rotate(3deg);
    filter: drop-shadow(0 0 8px #eb6f92);
  }

  75% {
    transform: scale(1.15) rotate(-3deg);
    filter: drop-shadow(0 0 6px #f6c177);
  }
}

.nav-link-explore:hover .nav-icon-fire {
  animation: fire 0.4s ease-in-out infinite;
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.2);
  }

  50% {
    transform: scale(1.1);
  }

  75% {
    transform: scale(1.25);
  }
}

.group:hover .nav-icon-heart {
  animation: heartbeat 0.6s ease-in-out infinite;
  filter: drop-shadow(0 0 4px #eb6f92);
}

.nav-icon-favorites::before,
.nav-icon-favorites::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #eb6f92;
  opacity: 0;
  pointer-events: none;
}

.group:hover .nav-icon-favorites::before {
  top: 0;
  right: 0;
  animation: particle1 0.8s ease-out infinite;
}

.group:hover .nav-icon-favorites::after {
  top: 0;
  left: 0;
  animation: particle2 0.8s ease-out 0.2s infinite;
}

@keyframes particle1 {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(6px, -8px) scale(0);
  }
}

@keyframes particle2 {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-6px, -8px) scale(0);
  }
}
</style>
