<template>
  <div ref="selectorRef" class="relative">
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :aria-label="$t('lang.selector')"
      class="flex items-center gap-1.5 rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 px-2.5 py-1.5 text-sm font-medium text-rp-text transition-all hover:border-rp-iris/50 hover:bg-rp-overlay/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base"
      @click="isOpen = !isOpen"
      @keydown.escape="isOpen = false"
    >
      <span class="text-xs font-bold uppercase" aria-hidden="true">{{ locale }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="size-3.5 text-rp-subtle transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
        aria-hidden="true"
      />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        role="menu"
        :aria-label="$t('lang.selector')"
        class="absolute right-0 top-full z-50 mt-2 min-w-40 overflow-hidden rounded-xl border border-rp-overlay bg-rp-surface p-1.5 shadow-2xl"
        @keydown.escape="isOpen = false"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          type="button"
          role="menuitem"
          :aria-current="locale === loc.code ? 'true' : undefined"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
          :class="
            locale === loc.code
              ? 'bg-rp-iris/20 text-rp-iris'
              : 'text-rp-text hover:bg-rp-overlay'
          "
          @click="switchLocale(loc.code)"
        >
          <span class="w-7 text-xs font-bold uppercase">{{ loc.code }}</span>
          <span class="font-medium">{{ loc.name }}</span>
          <UIcon
            v-if="locale === loc.code"
            name="i-heroicons-check"
            class="ml-auto size-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { LocaleCode } from '~/stores/preferences'

const { locale, locales, setLocale: setI18nLocale } = useI18n()
const preferencesStore = usePreferencesStore()

const isOpen = ref(false)
const selectorRef = ref<HTMLElement | null>(null)

interface LocaleConfig {
  code: LocaleCode
  name: string
}

const availableLocales = computed<LocaleConfig[]>(() => {
  return locales.value.map((loc) => {
    if (typeof loc === 'string') {
      return { code: loc as LocaleCode, name: loc }
    }
    return { code: loc.code as LocaleCode, name: loc.name || loc.code }
  })
})

const switchLocale = (code: LocaleCode) => {
  setI18nLocale(code)
  preferencesStore.setLocale(code)
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

const handleClickOutside = (e: MouseEvent) => {
  if (selectorRef.value && !selectorRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
