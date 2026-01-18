<template>
  <section class="relative overflow-hidden pb-8 pt-20 sm:pb-12 sm:pt-24 md:pb-20 md:pt-32">
    <!-- Animated background -->
    <HomeHeroBackground />

    <UContainer class="relative z-10 px-4 sm:px-6">
      <div class="mx-auto max-w-3xl text-center">
        <!-- Title with gradient effect -->
        <h1
          v-scroll-reveal.fade-up
          class="mb-3 text-2xl font-black tracking-tight xs:text-3xl sm:text-4xl md:mb-6 md:text-5xl lg:text-7xl"
        >
          <span class="text-rp-text">{{ $t('home.title') }}</span>
          <br />
          <span class="bg-linear-to-r from-[#c4a7e7] via-[#ebbcba] to-[#eb6f92] bg-clip-text text-transparent">
            {{ $t('home.titleHighlight') }}
          </span>
        </h1>

        <!-- Subtitle -->
        <p
          v-scroll-reveal.fade-up="100"
          class="mx-auto mb-5 max-w-xl text-xs text-rp-subtle sm:text-sm md:mb-10 md:text-lg"
        >
          {{ $t('home.subtitle') }}
        </p>

        <!-- Search Bar -->
        <form
          v-scroll-reveal.fade-up="200"
          role="search"
          class="group relative mx-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-rp-overlay/50 bg-rp-surface/50 px-4 py-2 backdrop-blur-sm transition-all focus-within:border-rp-iris/50 focus-within:bg-rp-surface/80 hover:border-rp-iris/30 sm:rounded-2xl sm:px-5 sm:py-3"
          @submit.prevent="handleSearch"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="size-5 shrink-0 text-rp-muted transition-colors group-focus-within:text-rp-iris"
            aria-hidden="true"
          />
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="$t('home.searchPlaceholder')"
            :aria-label="$t('common.search')"
            autocomplete="off"
            class="min-w-0 flex-1 bg-transparent text-sm text-rp-text placeholder-rp-subtle outline-none sm:text-base"
          />
          <button
            type="submit"
            class="shrink-0 rounded-lg bg-rp-iris px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-rp-iris/90 sm:px-4 sm:py-2 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          >
            {{ $t('common.search') }}
          </button>
        </form>

        <!-- Quick stats -->
        <div
          v-scroll-reveal.fade-up="300"
          class="mt-5 flex items-center justify-center gap-3 text-[10px] sm:mt-8 sm:gap-4 sm:text-xs md:mt-12 md:gap-8 md:text-sm"
        >
          <div class="flex items-center gap-1 md:gap-2">
            <UIcon
              name="i-heroicons-film"
              class="size-3 text-rp-iris sm:size-4 md:size-5"
            />
            <span class="text-rp-subtle">{{ $t('home.stats.titles') }}</span>
          </div>
          <div class="h-3 w-px bg-rp-overlay sm:h-4" />
          <div class="flex items-center gap-1 md:gap-2">
            <UIcon
              name="i-heroicons-arrow-path"
              class="size-3 text-rp-foam sm:size-4 md:size-5"
            />
            <span class="text-rp-subtle">{{ $t('home.stats.updated') }}</span>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const router = useRouter()
const localePath = useLocalePath()

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: localePath('/search'), query: { q: searchQuery.value.trim() } })
  } else {
    router.push(localePath('/search'))
  }
}
</script>
