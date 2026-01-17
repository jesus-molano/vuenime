<template>
  <!-- Wrapper con perspective para el efecto 3D -->
  <div
    ref="wrapperRef"
    class="group card-perspective relative"
    @mouseenter="onCardHover"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Card con efecto 3D - agrupa borde y contenido -->
    <div
      ref="cardRef"
      class="card-3d relative rounded-2xl transition-transform duration-200 ease-out"
      :style="cardTransform"
    >
      <!-- Borde brillante que sigue el cursor con colores de la imagen (solo desktop) -->
      <div
        class="card-border pointer-events-none absolute -inset-px overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 max-sm:hidden"
        :class="{ 'opacity-100': isHovering }"
      >
        <img
          :src="anime.images.webp.large_image_url"
          alt=""
          class="size-full scale-105 object-cover blur-xl brightness-150 saturate-200 select-none"
          :style="borderMaskStyle"
          aria-hidden="true"
          draggable="false"
        />
      </div>

      <!-- Card inner content -->
      <div
        class="card-inner relative overflow-hidden rounded-2xl border border-white/8 bg-rp-surface/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-400 group-hover:border-white/15 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rp-iris has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-rp-base"
      >
        <!-- Mobile: Horizontal layout - toda la card es clickeable -->
        <NuxtLink
          :to="animeLink"
          :view-transition="true"
          class="flex sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
          :aria-labelledby="`anime-title-mobile-${anime.mal_id}`"
        >
          <!-- Imagen (lado izquierdo) -->
          <div class="relative h-32 w-24 shrink-0 overflow-hidden">
            <img
              :src="anime.images.webp.large_image_url"
              :alt="$t('anime.coverAlt', { title: anime.title })"
              :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
              class="size-full object-cover select-none"
              loading="lazy"
              draggable="false"
            />
            <!-- Badge de puntuación -->
            <div
              v-if="anime.score"
              class="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg backdrop-blur-sm"
            >
              <UIcon
                name="i-heroicons-star-solid"
                class="size-2 text-rp-gold"
              />
              {{ anime.score.toFixed(1) }}
            </div>
          </div>

          <!-- Contenido (lado derecho) -->
          <div class="flex flex-1 flex-col justify-center gap-1.5 p-3">
            <div class="flex items-start justify-between gap-2">
              <h3
                :id="`anime-title-mobile-${anime.mal_id}`"
                class="line-clamp-2 flex-1 text-sm font-bold text-rp-text"
              >
                {{ anime.title }}
              </h3>
              <!-- Mobile favorite button -->
              <button
                type="button"
                class="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
                :class="
                  isFavorite
                    ? 'bg-rp-love text-white shadow-lg shadow-rp-love/30'
                    : 'bg-rp-overlay/80 text-rp-subtle hover:text-rp-love'
                "
                :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
                :aria-pressed="isFavorite"
                @click.stop.prevent="toggleFavorite"
              >
                <UIcon
                  :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
                  class="size-4"
                  :class="{ 'animate-heart-beat': isAnimating }"
                  aria-hidden="true"
                />
              </button>
            </div>

            <!-- Info -->
            <div class="flex items-center gap-2 text-[10px] text-rp-subtle">
              <span
                v-if="anime.year"
                class="flex items-center gap-0.5"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="size-2.5"
                />
                {{ anime.year }}
              </span>
              <span
                v-if="anime.episodes"
                class="flex items-center gap-0.5"
              >
                <UIcon
                  name="i-heroicons-play"
                  class="size-2.5"
                />
                {{ anime.episodes }} {{ $t('anime.eps') }}
              </span>
            </div>

            <!-- Géneros -->
            <div class="flex flex-wrap gap-1">
              <span
                v-for="genre in anime.genres?.slice(0, 2)"
                :key="genre.mal_id"
                class="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-rp-subtle"
              >
                {{ getGenreName(genre) }}
              </span>
            </div>

            <!-- Badge "En emisión" -->
            <div
              v-if="anime.airing"
              class="mt-0.5 inline-flex w-fit items-center rounded-full bg-rp-foam/90 px-1.5 py-0.5 text-[9px] font-semibold text-rp-base"
            >
              {{ $t('anime.airing') }}
            </div>
          </div>
        </NuxtLink>

        <!-- Desktop: Vertical layout con efecto 3D -->
        <div class="relative hidden aspect-[3/4.2] overflow-hidden sm:block">
          <!-- Imagen -->
          <NuxtLink
            :to="animeLink"
            :view-transition="true"
            class="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
            :aria-labelledby="`anime-title-desktop-${anime.mal_id}`"
          >
            <img
              :src="anime.images.webp.large_image_url"
              :alt="$t('anime.coverAlt', { title: anime.title })"
              :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
              class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
              draggable="false"
              loading="lazy"
            />
          </NuxtLink>

          <!-- Gradient overlay -->
          <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

          <!-- Glare effect -->
          <div
            class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            :style="glareStyle"
          />

          <!-- Badge de puntuación -->
          <div
            v-if="anime.score"
            class="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md md:right-3 md:top-3"
          >
            <UIcon
              name="i-heroicons-star-solid"
              class="size-3.5 text-rp-gold"
            />
            {{ anime.score.toFixed(1) }}
          </div>

          <!-- Badge "En emisión" -->
          <div
            v-if="anime.airing"
            class="absolute left-2.5 top-2.5 rounded-full bg-rp-foam px-2 py-1 text-[10px] font-bold text-rp-base shadow-lg md:left-3 md:top-3 md:text-xs"
          >
            {{ $t('anime.airing') }}
          </div>

          <!-- Contenido sobre la imagen (abajo) -->
          <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 md:gap-2 md:p-4">
            <!-- Título -->
            <h3
              :id="`anime-title-desktop-${anime.mal_id}`"
              class="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-lg transition-colors duration-300 group-hover:text-rp-iris md:text-base"
            >
              {{ anime.title }}
            </h3>

            <!-- Info: año y episodios -->
            <div class="flex items-center gap-3 text-[10px] text-white/70 md:text-xs">
              <span
                v-if="anime.year"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="size-3 md:size-3.5"
                />
                {{ anime.year }}
              </span>
              <span
                v-if="anime.episodes"
                class="flex items-center gap-1"
              >
                <UIcon
                  name="i-heroicons-play"
                  class="size-3 md:size-3.5"
                />
                {{ anime.episodes }} {{ $t('anime.eps') }}
              </span>
            </div>

            <!-- Géneros -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="genre in anime.genres?.slice(0, 2)"
                :key="genre.mal_id"
                class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm md:px-2.5 md:text-xs"
              >
                {{ getGenreName(genre) }}
              </span>
            </div>
          </div>

          <!-- Favorite button -->
          <button
            type="button"
            class="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full outline-none backdrop-blur-md transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 focus-visible:opacity-100 md:bottom-4 md:right-4 md:size-11"
            :class="
              isFavorite
                ? 'bg-rp-love text-white shadow-lg shadow-rp-love/40 scale-100 opacity-100'
                : 'bg-black/40 text-white opacity-0 hover:bg-rp-love hover:shadow-lg hover:shadow-rp-love/40 group-hover:opacity-100'
            "
            :aria-label="isFavorite ? $t('anime.removeFavorite') : $t('anime.addFavorite')"
            :aria-pressed="isFavorite"
            @click.stop.prevent="toggleFavorite"
          >
            <UIcon
              :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              class="size-5 transition-transform duration-300 md:size-6"
              :class="{ 'animate-heart-beat': isAnimating }"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Anime } from '~~/shared/types/anime'
import type { FavoriteAnime } from '~/types/favorites'

const props = withDefaults(
  defineProps<{
    anime: Anime | FavoriteAnime
    /** Animate card out when removing from favorites (only use in favorites page) */
    animateOnRemove?: boolean
  }>(),
  {
    animateOnRemove: false,
  }
)

// Wrapper ref for remove animation
const wrapperRef = ref<HTMLElement | null>(null)

// 3D Tilt Effect
const { cardRef, isHovering, cardTransform, glareStyle, borderMaskStyle, handleMouseMove, handleMouseLeave } =
  useCard3DTilt({ maxRotation: 6, minWidth: 640 })

// Favorites - only pass wrapper ref if animateOnRemove is true
const animeRef = toRef(props, 'anime')
const cardRefForAnimation = computed(() => (props.animateOnRemove ? wrapperRef.value : null))
const { isFavorite, isAnimating, toggleFavorite } = useFavoriteToggle(animeRef, cardRefForAnimation)

// Translations
const { translateGenreById } = useAnimeTranslations()
const getGenreName = (genre: { mal_id: number; name: string }) => {
  return translateGenreById(genre.mal_id) || genre.name
}

// Locale-aware link
const localePath = useLocalePath()
const animeLink = computed(() => localePath(`/anime/${props.anime.mal_id}`))

// Prefetch data on hover (desktop only)
const onCardHover = () => {
  prefetchAnimeDetail(props.anime.mal_id)
}
</script>

<style scoped>
.card-perspective {
  perspective: 1200px;
}

.card-border {
  z-index: 0;
}

.card-3d {
  z-index: 1;
}

.card-inner {
  isolation: isolate;
}

@keyframes heart-beat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .card-3d,
  .card-border,
  .card-inner {
    transition: none !important;
  }
  .card-3d {
    transform: none !important;
  }
}
</style>
