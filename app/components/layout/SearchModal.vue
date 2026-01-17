<template>
  <UiModal
    v-model:open="modelValue"
    :show-close-button="false"
    aria-labelled-by="search-modal-label"
    container-class="items-start pt-[12vh]"
    content-class="max-w-2xl"
  >
    <span
      id="search-modal-label"
      class="sr-only"
    >
      {{ $t('common.search') }}
    </span>

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
          @click="navigateTo('/')"
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
          @click="navigateTo('/favorites')"
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
  </UiModal>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false })

const router = useRouter()
const localePath = useLocalePath()
const { searchQuery } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')

watch(modelValue, (open) => {
  if (open) {
    query.value = searchQuery.value
    nextTick(() => inputRef.value?.focus())
  }
})

function handleSearch() {
  modelValue.value = false
  if (query.value.trim()) {
    searchQuery.value = query.value.trim()
    router.push({ path: localePath('/search'), query: { q: query.value.trim() } })
  } else {
    router.push(localePath('/search'))
  }
}

function navigateTo(path: string) {
  modelValue.value = false
  router.push(localePath(path))
}
</script>
