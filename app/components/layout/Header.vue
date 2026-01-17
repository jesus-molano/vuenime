<template>
  <header
    class="fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:top-6"
  >
    <nav
      role="navigation"
      :aria-label="$t('nav.main')"
      class="nav-container flex items-center gap-3 rounded-2xl px-4 py-2.5 backdrop-blur-xl md:gap-4 md:px-5"
      :class="isScrolled ? 'nav-scrolled' : 'nav-top'"
    >
      <NuxtLink
        :to="localePath('/')"
        class="group flex items-center gap-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:gap-2"
        :aria-label="$t('nav.home')"
      >
        <span class="text-base font-bold md:text-lg">
          <span class="text-rp-text">Vue</span>
          <span class="text-rp-iris">Nime</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 32"
          fill="none"
          width="20"
          height="14"
          class="straw-hat w-5 -rotate-12 drop-shadow-md md:w-6"
          aria-hidden="true"
        >
          <ellipse
            cx="24"
            cy="26"
            rx="23"
            ry="5"
            fill="#f6e3ce"
          />
          <ellipse
            cx="24"
            cy="27"
            rx="22"
            ry="4"
            fill="#e8d5b7"
            opacity="0.5"
          />
          <ellipse
            cx="24"
            cy="16"
            rx="14"
            ry="12"
            fill="#f6e3ce"
          />
          <ellipse
            cx="26"
            cy="14"
            rx="10"
            ry="8"
            fill="#ffffff"
            opacity="0.3"
          />
          <rect
            x="10"
            y="20"
            width="28"
            height="5"
            rx="1"
            fill="#eb6f92"
          />
          <rect
            x="10"
            y="23"
            width="28"
            height="2"
            rx="1"
            fill="#d4627f"
          />
        </svg>
      </NuxtLink>

      <div
        class="h-4 w-px bg-white/10"
        aria-hidden="true"
      />

      <div
        ref="menuRef"
        class="flex items-center gap-1 md:gap-2"
        role="group"
        :aria-label="$t('nav.main')"
        @keydown="handleMenuKeydown"
      >
        <UTooltip
          :text="$t('nav.explore')"
          :delay-duration="400"
          :disabled="!isMobile"
        >
          <NuxtLink
            ref="exploreRef"
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
            <span class="hidden sm:inline">{{ $t('nav.explore') }}</span>
            <span class="sr-only sm:hidden">{{ $t('nav.explore') }}</span>
          </NuxtLink>
        </UTooltip>
        <UTooltip
          :text="$t('nav.favorites')"
          :delay-duration="400"
          :disabled="!isMobile"
        >
          <NuxtLink
            ref="favoritesRef"
            :to="localePath('/favorites')"
            class="group flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-love/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
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
            <span class="hidden sm:inline">{{ $t('nav.favorites') }}</span>
            <span class="sr-only sm:hidden">{{ $t('nav.favorites') }}</span>
          </NuxtLink>
        </UTooltip>
      </div>

      <LayoutLangSelector />
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  isScrolled: boolean
}>()

const localePath = useLocalePath()

// Refs for keyboard navigation
const menuRef = ref<HTMLElement | null>(null)
const exploreRef = ref<HTMLElement | null>(null)
const favoritesRef = ref<HTMLElement | null>(null)

// Check if mobile (text is hidden below sm breakpoint - 640px)
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  onUnmounted(() => window.removeEventListener('resize', checkMobile))
})

// Arrow key navigation between menu items (optional enhancement)
const handleMenuKeydown = (e: KeyboardEvent) => {
  const items = [exploreRef.value, favoritesRef.value].filter(Boolean) as HTMLElement[]
  const currentIndex = items.findIndex((item) => item === document.activeElement)

  if (currentIndex === -1) return

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      items[(currentIndex + 1) % items.length]?.focus()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      items[(currentIndex - 1 + items.length) % items.length]?.focus()
      break
  }
}
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
