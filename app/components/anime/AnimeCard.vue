<template>
  <!-- Mobile: Layout horizontal | Desktop: Layout vertical -->
  <article
    class="group relative cursor-pointer overflow-hidden rounded-lg bg-rp-surface shadow-md border border-rp-overlay transition-all duration-300 hover:border-rp-iris/50 hover:shadow-rp-iris/20 focus-rp sm:rounded-xl sm:shadow-lg md:rounded-2xl md:shadow-2xl"
    :style="{ viewTransitionName: isNavigating ? `anime-card-${anime.mal_id}` : '' }"
    tabindex="0"
    role="article"
    :aria-labelledby="`anime-title-${anime.mal_id}`"
    @click="navigateToDetail"
    @keydown.enter="navigateToDetail"
  >
    <!-- Mobile: Horizontal layout -->
    <div class="flex sm:hidden">
      <!-- Imagen (lado izquierdo) -->
      <div class="relative h-32 w-24 shrink-0 overflow-hidden">
        <img
          :src="anime.images.jpg.large_image_url"
          :alt="$t('anime.coverAlt', { title: anime.title })"
          :style="{ viewTransitionName: isNavigating ? `anime-image-${anime.mal_id}` : '' }"
          class="size-full object-cover"
          loading="lazy"
        >
        <!-- Badge de puntuación -->
        <div
          v-if="anime.score"
          class="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-gradient-rp-score px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg"
        >
          <UIcon name="i-heroicons-star-solid" class="size-2" />
          {{ anime.score.toFixed(1) }}
        </div>
      </div>

      <!-- Contenido (lado derecho) -->
      <div class="flex flex-1 flex-col justify-center gap-1 p-3">
        <h3
          :id="`anime-title-${anime.mal_id}`"
          :style="{ viewTransitionName: isNavigating ? `anime-title-${anime.mal_id}` : '' }"
          class="line-clamp-2 text-sm font-bold text-rp-text"
        >
          {{ anime.title }}
        </h3>

        <!-- Info -->
        <div class="flex items-center gap-2 text-[10px] text-rp-subtle">
          <span v-if="anime.year" class="flex items-center gap-0.5">
            <UIcon name="i-heroicons-calendar" class="size-2.5" />
            {{ anime.year }}
          </span>
          <span v-if="anime.episodes" class="flex items-center gap-0.5">
            <UIcon name="i-heroicons-play" class="size-2.5" />
            {{ anime.episodes }} {{ $t('anime.eps') }}
          </span>
        </div>

        <!-- Géneros -->
        <div class="flex flex-wrap gap-1">
          <span
            v-for="genre in anime.genres?.slice(0, 2)"
            :key="genre.mal_id"
            class="rounded-full bg-rp-overlay/80 px-1.5 py-0.5 text-[9px] text-rp-subtle"
          >
            {{ genre.name }}
          </span>
        </div>

        <!-- Badge "En emisión" -->
        <div
          v-if="anime.airing"
          class="mt-1 inline-flex w-fit items-center rounded-full bg-rp-foam/90 px-1.5 py-0.5 text-[9px] font-semibold text-rp-base"
        >
          {{ $t('anime.airing') }}
        </div>
      </div>
    </div>

    <!-- Desktop: Vertical layout (card clásica) -->
    <div class="relative hidden aspect-[3/4] overflow-hidden sm:block">
      <!-- Imagen con zoom en hover -->
      <img
        :src="anime.images.jpg.large_image_url"
        :alt="$t('anime.coverAlt', { title: anime.title })"
        :style="{ viewTransitionName: isNavigating ? `anime-image-${anime.mal_id}` : '' }"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      >

      <!-- Gradiente oscuro Rosé Pine -->
      <div class="absolute inset-0 bg-gradient-rp-card" />

      <!-- Badge de puntuación (arriba derecha) -->
      <div
        v-if="anime.score"
        class="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-gradient-rp-score px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg md:right-3 md:top-3 md:gap-1 md:px-2.5 md:py-1 md:text-xs"
      >
        <UIcon name="i-heroicons-star-solid" class="size-2.5 md:size-3.5" />
        {{ anime.score.toFixed(1) }}
      </div>

      <!-- Badge "En emisión" (arriba izquierda) -->
      <div
        v-if="anime.airing"
        class="absolute left-2 top-2 rounded-full bg-rp-foam/90 px-1.5 py-0.5 text-[10px] font-semibold text-rp-base backdrop-blur-sm md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-xs"
      >
        {{ $t('anime.airing') }}
      </div>

      <!-- Contenido sobre la imagen (abajo) -->
      <div class="absolute inset-x-0 bottom-0 p-2 md:p-4">
        <!-- Título -->
        <h3
          :id="`anime-title-${anime.mal_id}`"
          :style="{ viewTransitionName: isNavigating ? `anime-title-${anime.mal_id}` : '' }"
          class="line-clamp-2 text-xs font-bold text-rp-text transition-colors group-hover:text-rp-iris md:text-sm lg:text-base"
        >
          {{ anime.title }}
        </h3>

        <!-- Info: año y episodios -->
        <div class="mt-0.5 flex items-center gap-2 text-[9px] text-rp-subtle md:gap-3 md:text-xs">
          <span v-if="anime.year" class="flex items-center gap-0.5 md:gap-1">
            <UIcon name="i-heroicons-calendar" class="size-2.5 md:size-3.5" />
            {{ anime.year }}
          </span>
          <span v-if="anime.episodes" class="flex items-center gap-0.5 md:gap-1">
            <UIcon name="i-heroicons-play" class="size-2.5 md:size-3.5" />
            {{ anime.episodes }} {{ $t('anime.eps') }}
          </span>
        </div>

        <!-- Géneros -->
        <div class="mt-1 flex flex-wrap gap-1 md:mt-2">
          <span
            v-for="genre in anime.genres?.slice(0, 2)"
            :key="genre.mal_id"
            class="rounded-full bg-rp-overlay/80 px-1.5 py-0.5 text-[10px] text-rp-subtle backdrop-blur-sm md:px-2 md:text-xs"
          >
            {{ genre.name }}
          </span>
        </div>
      </div>

      <!-- Overlay en hover con "Ver detalles" - solo en desktop -->
      <div class="absolute inset-0 hidden items-center justify-center bg-rp-iris/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:flex">
        <div class="text-center text-rp-base">
          <UIcon name="i-heroicons-play-circle-solid" class="mb-2 size-12" />
          <p class="text-sm font-semibold">{{ $t('anime.viewDetails') }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const router = useRouter()
const isNavigating = ref(false)

const navigateToDetail = () => {
  isNavigating.value = true
  nextTick(() => {
    router.push(`/anime/${props.anime.mal_id}`)
  })
}
</script>
