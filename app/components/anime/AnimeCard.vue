<template>
  <!-- Wrapper con perspective para el efecto 3D -->
  <div
    class="group card-perspective relative"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Card con efecto 3D -->
    <div
      ref="cardRef"
      class="card-3d rounded-lg bg-rp-surface shadow-md border border-rp-overlay sm:rounded-xl sm:shadow-lg md:rounded-2xl md:shadow-2xl"
      :style="cardTransform"
    >
      <!-- Mobile: Horizontal layout (sin efecto 3D) -->
      <div class="flex overflow-hidden rounded-lg sm:hidden">
        <!-- Imagen (lado izquierdo) -->
        <div class="relative h-32 w-24 shrink-0 overflow-hidden">
          <NuxtLink
            :to="`/anime/${anime.mal_id}`"
            :view-transition="true"
            class="block size-full"
          >
            <img
              :src="anime.images.webp.large_image_url"
              :alt="$t('anime.coverAlt', { title: anime.title })"
              :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
              class="size-full object-cover"
              loading="lazy"
            >
          </NuxtLink>
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
          <div class="flex items-start justify-between gap-2">
            <NuxtLink :to="`/anime/${anime.mal_id}`" :view-transition="true" class="flex-1">
              <h3
                :id="`anime-title-${anime.mal_id}`"
                class="line-clamp-2 text-sm font-bold text-rp-text"
              >
                {{ anime.title }}
              </h3>
            </NuxtLink>
            <!-- Mobile favorite button -->
            <button
              class="flex size-7 shrink-0 items-center justify-center rounded-full transition-all"
              :class="isFavorite ? 'bg-rp-love text-white' : 'bg-rp-overlay text-rp-subtle'"
              :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
              @click.stop.prevent="toggleFavorite"
            >
              <UIcon
                :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                class="size-4"
                :class="{ 'animate-heart-beat': isAnimating }"
              />
            </button>
          </div>

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

      <!-- Desktop: Vertical layout con efecto 3D -->
      <div class="relative hidden aspect-3/4 overflow-hidden rounded-xl sm:block md:rounded-2xl">
        <!-- Imagen con zoom en hover -->
        <NuxtLink :to="`/anime/${anime.mal_id}`" :view-transition="true" class="block size-full">
          <img
            :src="anime.images.webp.large_image_url"
            :alt="$t('anime.coverAlt', { title: anime.title })"
            :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
            class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          >
        </NuxtLink>

        <!-- Gradiente oscuro Rosé Pine -->
        <div class="pointer-events-none absolute inset-0 bg-gradient-rp-card" />

        <!-- Glare effect -->
        <div
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          :style="glareStyle"
        />

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

        <!-- Favorite button -->
        <button
          class="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full bg-rp-base/70 text-white opacity-0 transition-all duration-300 hover:bg-rp-love hover:scale-110 group-hover:opacity-100 md:bottom-3 md:right-3 md:size-10"
          :class="{ '!bg-rp-love !opacity-100': isFavorite }"
          :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
          @click.stop.prevent="toggleFavorite"
        >
          <UIcon
            :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            class="size-4 transition-transform duration-300 md:size-5"
            :class="{ 'animate-heart-beat': isAnimating }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'

const props = defineProps<{
  anime: Anime
}>()

const favoritesStore = useFavoritesStore()

// 3D Tilt Effect
const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const glareX = ref(50)
const glareY = ref(50)
const isHovering = ref(false)

const cardTransform = computed(() => ({
  transform: isHovering.value
    ? `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(1.02, 1.02, 1.02)`
    : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
}))

const glareStyle = computed(() => ({
  background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
}))

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || window.innerWidth < 640) return

  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Rotación máxima de 8 grados
  rotateY.value = ((x - centerX) / centerX) * 8
  rotateX.value = -((y - centerY) / centerY) * 8

  // Posición del glare
  glareX.value = (x / rect.width) * 100
  glareY.value = (y / rect.height) * 100

  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
  rotateX.value = 0
  rotateY.value = 0
}

// Favorites
const isFavorite = computed(() => favoritesStore.isFavorite(props.anime.mal_id))
const isAnimating = ref(false)

const toggleFavorite = () => {
  isAnimating.value = true
  favoritesStore.toggleFavorite({
    mal_id: props.anime.mal_id,
    title: props.anime.title,
    images: props.anime.images,
    score: props.anime.score,
    year: props.anime.year,
    episodes: props.anime.episodes,
    genres: props.anime.genres,
    airing: props.anime.airing,
  })

  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}
</script>

<style scoped>
.card-perspective {
  perspective: 1000px;
}

.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
}

.card-3d:hover {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(196, 167, 231, 0.15);
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.animate-heart-beat {
  animation: heart-beat 0.3s ease-in-out 2;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .card-3d {
    transition: none;
    transform: none !important;
  }
}
</style>
