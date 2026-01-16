<template>
  <div class="min-h-screen bg-rp-base">
    <!-- Header flotante centrado - píldora siempre, borde solo al scroll -->
    <header
      class="fixed left-1/2 z-50 -translate-x-1/2 top-4 md:top-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    >
      <nav
        class="flex items-center gap-3 rounded-2xl bg-rp-surface/80 px-4 py-2.5 shadow-2xl shadow-rp-base/50 backdrop-blur-xl transition-all duration-500 md:gap-4 md:px-5"
        :class="[
          isScrolled
            ? 'border border-rp-overlay/50'
            : 'border border-transparent'
        ]"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="group flex items-center gap-1.5 md:gap-2">
          <span class="text-base font-bold md:text-lg">
            <span class="text-rp-text">Vue</span><span class="text-rp-iris">Nime</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 32"
            fill="none"
            class="w-5 -rotate-12 drop-shadow-md transition-transform group-hover:rotate-0 group-hover:scale-110 md:w-6"
            aria-hidden="true"
          >
            <ellipse cx="24" cy="26" rx="23" ry="5" fill="#f6e3ce"/>
            <ellipse cx="24" cy="27" rx="22" ry="4" fill="#e8d5b7" opacity="0.5"/>
            <ellipse cx="24" cy="16" rx="14" ry="12" fill="#f6e3ce"/>
            <ellipse cx="26" cy="14" rx="10" ry="8" fill="#ffffff" opacity="0.3"/>
            <rect x="10" y="20" width="28" height="5" rx="1" fill="#eb6f92"/>
            <rect x="10" y="23" width="28" height="2" rx="1" fill="#d4627f"/>
          </svg>
        </NuxtLink>

        <!-- Separator -->
        <div class="h-5 w-px bg-rp-overlay/50" />

        <!-- Nav Links - Desktop siempre visible, mobile oculto cuando scroll (hay dock) -->
        <div
          class="flex items-center gap-1 md:gap-2"
          :class="isScrolled ? 'hidden md:flex' : 'flex'"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-overlay/50"
            :class="$route.path === '/' ? 'text-rp-text bg-rp-overlay/30' : 'text-rp-subtle hover:text-rp-text'"
          >
            <UIcon name="i-heroicons-fire" class="size-4" />
            <span class="hidden sm:inline">{{ $t('nav.explore') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/favorites"
            class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all hover:bg-rp-overlay/50"
            :class="$route.path === '/favorites' ? 'text-rp-love bg-rp-love/10' : 'text-rp-subtle hover:text-rp-love'"
          >
            <UIcon name="i-heroicons-heart" class="size-4" />
            <span class="hidden sm:inline">{{ $t('nav.favorites') }}</span>
          </NuxtLink>
        </div>

        <!-- Separator -->
        <div class="h-5 w-px bg-rp-overlay/50" />

        <!-- Language Selector -->
        <div class="relative">
          <button
            class="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-medium text-rp-subtle transition-all hover:bg-rp-overlay/50 hover:text-rp-text"
            @click="isLangMenuOpen = !isLangMenuOpen"
          >
            <UIcon name="i-heroicons-language" class="size-4" />
            <span class="text-xs font-bold">{{ currentLocaleCode }}</span>
            <UIcon
              name="i-heroicons-chevron-down"
              class="size-3 transition-transform"
              :class="isLangMenuOpen ? 'rotate-180' : ''"
            />
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="isLangMenuOpen"
              class="absolute right-0 top-full mt-2 min-w-36 overflow-hidden rounded-xl border border-rp-overlay/50 bg-rp-surface/95 p-1 shadow-xl backdrop-blur-xl"
            >
              <button
                v-for="loc in availableLocales"
                :key="loc.code"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-rp-overlay/50"
                :class="locale === loc.code ? 'text-rp-iris bg-rp-iris/10' : 'text-rp-text'"
                @click="switchLocale(loc.code as 'en' | 'es' | 'ja')"
              >
                <span class="w-6 text-xs font-bold uppercase text-rp-muted">{{ loc.code }}</span>
                <span>{{ loc.name }}</span>
                <UIcon
                  v-if="locale === loc.code"
                  name="i-heroicons-check"
                  class="ml-auto size-4 text-rp-iris"
                />
              </button>
            </div>
          </Transition>
        </div>
      </nav>
    </header>

    <!-- Floating Search Pill - Desktop only, aparece al scroll, sube sobre footer -->
    <Transition name="search-slide">
      <div
        v-if="isScrolled && !isSearchOpen"
        class="fixed left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-300 md:block"
        :style="{ bottom: `calc(${footerHeight + 24}px)` }"
      >
        <button
          class="group flex items-center gap-3 rounded-2xl border border-rp-overlay/50 bg-rp-surface/95 px-5 py-3 shadow-2xl shadow-rp-base/50 backdrop-blur-xl transition-all hover:border-rp-iris/50 hover:shadow-rp-iris/20"
          @click="toggleSearch"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="size-5 text-rp-muted transition-colors group-hover:text-rp-iris" />
          <span class="text-sm text-rp-subtle">{{ $t('home.searchPlaceholder') }}</span>
          <kbd class="rounded-lg bg-rp-overlay px-2 py-0.5 text-xs font-medium text-rp-text">⌘K</kbd>
        </button>
      </div>
    </Transition>

    <!-- Search Modal/Overlay -->
    <Transition name="search-modal">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-[60] flex items-start justify-center bg-rp-base/90 pt-[12vh] backdrop-blur-md"
        @click.self="toggleSearch"
      >
        <div class="w-full max-w-2xl px-4">
          <div class="overflow-hidden rounded-2xl border border-rp-overlay/50 bg-rp-surface shadow-2xl shadow-rp-iris/10">
            <!-- Search Input -->
            <form class="flex items-center gap-3 border-b border-rp-overlay/50 px-5 py-4" @submit.prevent="handleModalSearch">
              <UIcon name="i-heroicons-magnifying-glass" class="size-6 text-rp-iris" />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="$t('home.searchPlaceholder')"
                class="flex-1 bg-transparent text-lg text-rp-text placeholder-rp-muted outline-none"
                @keydown.escape="toggleSearch"
              >
              <kbd class="rounded-lg bg-rp-overlay px-2.5 py-1 text-xs font-medium text-rp-text">ESC</kbd>
            </form>

            <!-- Quick Actions -->
            <div class="p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-rp-subtle">{{ $t('search.quickActions') }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60"
                  @click="navigateTo('/'); toggleSearch()"
                >
                  <UIcon name="i-heroicons-fire" class="size-5 text-rp-gold" />
                  <span class="text-sm font-medium text-rp-text">{{ $t('nav.explore') }}</span>
                </button>
                <button
                  class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60"
                  @click="navigateTo('/favorites'); toggleSearch()"
                >
                  <UIcon name="i-heroicons-heart" class="size-5 text-rp-love" />
                  <span class="text-sm font-medium text-rp-text">{{ $t('nav.favorites') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Dock Navigation - Mobile only, aparece al scroll, sube sobre footer -->
    <!-- Usa safe-area-inset-bottom + padding para evitar la barra de navegación y notch -->
    <Transition name="dock-slide">
      <nav
        v-if="isScrolled"
        class="fixed left-1/2 z-50 -translate-x-1/2 transition-all duration-300 md:hidden"
        :style="{ bottom: `calc(${footerHeight}px + max(1rem, env(safe-area-inset-bottom, 0px)))` }"
      >
        <div class="flex items-center gap-1.5 rounded-2xl border border-rp-overlay/50 bg-rp-surface/95 p-2 shadow-2xl shadow-rp-base/50 backdrop-blur-xl">
          <NuxtLink
            to="/"
            class="group relative flex items-center justify-center rounded-xl p-3 transition-all"
            :class="$route.path === '/' ? 'bg-rp-iris/20 text-rp-iris' : 'text-rp-subtle hover:bg-rp-overlay/50 hover:text-rp-text'"
          >
            <UIcon name="i-heroicons-fire" class="size-6" />
          </NuxtLink>

          <button
            class="group flex items-center justify-center rounded-xl bg-gradient-to-r from-rp-iris to-rp-love p-3 text-white shadow-lg shadow-rp-iris/30 transition-all hover:shadow-rp-iris/50 active:scale-95"
            @click="toggleSearch"
          >
            <UIcon name="i-heroicons-magnifying-glass" class="size-6" />
          </button>

          <NuxtLink
            to="/favorites"
            class="group relative flex items-center justify-center rounded-xl p-3 transition-all"
            :class="$route.path === '/favorites' ? 'bg-rp-love/20 text-rp-love' : 'text-rp-subtle hover:bg-rp-overlay/50 hover:text-rp-love'"
          >
            <UIcon name="i-heroicons-heart" class="size-6" />
          </NuxtLink>
        </div>
      </nav>
    </Transition>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer minimalista -->
    <footer ref="footerRef" class="border-t border-rp-overlay/30 py-6 pb-8">
      <UContainer>
        <div class="flex flex-col items-center gap-3 px-4 md:gap-4 md:px-0">
          <div class="flex flex-wrap items-center justify-center gap-1 text-xs text-rp-subtle md:gap-2 md:text-sm">
            <span>{{ $t('footer.builtWith') }}</span>
            <span class="text-rp-muted">•</span>
            <span>{{ $t('footer.dataFrom') }}</span>
            <a
              href="https://jikan.moe"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-rp-foam transition-colors hover:text-rp-pine"
            >
              Jikan API
            </a>
          </div>
          <div class="flex items-center gap-1 text-xs text-rp-subtle">
            <span>Made with</span>
            <UIcon name="i-heroicons-heart-solid" class="size-3 text-rp-love" />
            <span>by</span>
            <span class="font-medium text-rp-iris">Jesús</span>
          </div>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { isSearchOpen, searchQuery, toggleSearch } = useSearch()
const { locale, locales, setLocale } = useI18n()

const isScrolled = ref(false)
const footerHeight = ref(0)
const isLangMenuOpen = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)

// Language selector
interface LocaleConfig {
  code: string
  name: string
}

const availableLocales = computed(() => {
  return locales.value.map((loc) => {
    if (typeof loc === 'string') {
      return { code: loc, name: loc }
    }
    return loc as LocaleConfig
  })
})

const currentLocaleCode = computed(() => {
  return locale.value.toUpperCase()
})

const switchLocale = (code: 'en' | 'es' | 'ja') => {
  setLocale(code)
  isLangMenuOpen.value = false
}

// Close language menu when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    isLangMenuOpen.value = false
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100

  // Calcular cuánto del footer es visible para mover el dock hacia arriba
  if (footerRef.value) {
    const footerRect = footerRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const visibleHeight = Math.max(0, windowHeight - footerRect.top)
    footerHeight.value = Math.min(visibleHeight, footerRect.height)
  }
}

// Focus input when search opens
watch(isSearchOpen, (open) => {
  if (open) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})

const navigateTo = (path: string) => {
  router.push(path)
}

const handleModalSearch = () => {
  if (searchQuery.value.trim()) {
    toggleSearch()
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}

// Keyboard shortcut Cmd+K (Mac) / Ctrl+K (Windows)
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
  window.addEventListener('click', handleClickOutside)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Search slide from bottom */
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-slide-enter-from,
.search-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}

/* Dock slide from bottom */
.dock-slide-enter-active,
.dock-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-slide-enter-from,
.dock-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}

/* Search modal */
.search-modal-enter-active,
.search-modal-leave-active {
  transition: all 0.3s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

.search-modal-enter-active > div > div,
.search-modal-leave-active > div > div {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-modal-enter-from > div > div,
.search-modal-leave-to > div > div {
  transform: scale(0.95) translateY(-20px);
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
