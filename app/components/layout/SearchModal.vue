<template>
  <Transition name="search-modal">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('common.search')"
      class="fixed inset-0 z-60 flex items-start justify-center bg-rp-base/90 pt-[12vh] backdrop-blur-md"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div class="w-full max-w-2xl px-4">
        <div class="overflow-hidden rounded-2xl border border-rp-overlay/50 bg-rp-surface shadow-2xl shadow-rp-iris/10">
          <form
            class="flex items-center gap-3 border-b border-rp-overlay/50 px-5 py-4"
            @submit.prevent="handleSearch"
          >
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="size-6 text-rp-iris"
              aria-hidden="true"
            />
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              :placeholder="$t('home.searchPlaceholder')"
              :aria-label="$t('common.search')"
              autocomplete="off"
              class="flex-1 bg-transparent text-lg text-rp-text placeholder-rp-subtle outline-none"
            />
            <kbd
              class="rounded-lg bg-rp-overlay px-2.5 py-1 text-xs font-medium text-rp-text"
              aria-hidden="true"
            >
              ESC
            </kbd>
          </form>

          <div
            class="p-4"
            role="menu"
            :aria-label="$t('search.quickActions')"
          >
            <p
              id="quick-actions-label"
              class="mb-3 text-xs font-semibold uppercase tracking-wider text-rp-subtle"
            >
              {{ $t('search.quickActions') }}
            </p>
            <div
              class="grid grid-cols-2 gap-2"
              aria-labelledby="quick-actions-label"
            >
              <button
                type="button"
                role="menuitem"
                class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
                @click="navigateAndClose('/')"
              >
                <UIcon
                  name="i-heroicons-fire"
                  class="size-5 text-rp-gold"
                  aria-hidden="true"
                />
                <span class="text-sm font-medium text-rp-text">{{ $t('nav.explore') }}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                class="flex items-center gap-3 rounded-xl bg-rp-overlay/30 px-4 py-3 text-left transition-all hover:bg-rp-overlay/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
                @click="navigateAndClose('/favorites')"
              >
                <UIcon
                  name="i-heroicons-heart"
                  class="size-5 text-rp-love"
                  aria-hidden="true"
                />
                <span class="text-sm font-medium text-rp-text">{{ $t('nav.favorites') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const localePath = useLocalePath()
const { searchQuery } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      query.value = searchQuery.value
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  }
)

const handleSearch = () => {
  emit('close')
  if (query.value.trim()) {
    searchQuery.value = query.value.trim()
    router.push({ path: localePath('/search'), query: { q: query.value.trim() } })
  } else {
    router.push(localePath('/search'))
  }
}

const navigateAndClose = (path: string) => {
  router.push(localePath(path))
  emit('close')
}
</script>

<style scoped>
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
</style>
