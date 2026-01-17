<template>
  <!-- Wrapper con perspective para el efecto 3D -->
  <div
    ref="wrapperRef"
    class="group card-perspective relative"
    @mouseenter="onCardHover"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Card con efecto 3D -->
    <div
      ref="cardRef"
      class="card-3d relative rounded-2xl transition-transform duration-200 ease-out"
      :style="cardTransform"
    >
      <!-- Borde brillante (solo desktop) -->
      <div
        class="card-border pointer-events-none absolute -inset-px overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 max-sm:hidden"
        :class="{ 'opacity-100': isHovering }"
      >
        <NuxtImg
          :src="anime.images.webp.large_image_url"
          alt=""
          class="size-full scale-105 object-cover blur-xl brightness-150 saturate-200 select-none"
          :style="borderMaskStyle"
          aria-hidden="true"
          draggable="false"
          loading="lazy"
        />
      </div>

      <!-- Card inner content -->
      <div
        class="card-inner relative overflow-hidden rounded-2xl border border-white/8 bg-rp-surface/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-400 group-hover:border-white/15 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] has-focus-visible:ring-2 has-focus-visible:ring-rp-iris has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-rp-base"
      >
        <!-- Mobile: Horizontal layout -->
        <NuxtLink
          :to="animeLink"
          :view-transition="true"
          class="flex sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
          :aria-labelledby="`anime-title-mobile-${anime.mal_id}`"
        >
          <!-- Imagen -->
          <div class="relative h-32 w-24 shrink-0 overflow-hidden">
            <NuxtImg
              :src="anime.images.webp.large_image_url"
              :alt="$t('anime.coverAlt', { title: anime.title })"
              :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
              class="size-full object-cover select-none"
              loading="lazy"
              draggable="false"
              placeholder
            />
            <UiScoreBadge
              v-if="anime.score"
              :score="anime.score"
              size="xs"
              class="absolute right-1.5 top-1.5"
            />
          </div>

          <!-- Contenido -->
          <div class="flex flex-1 flex-col justify-center gap-1.5 p-3">
            <div class="flex items-start justify-between gap-2">
              <h3
                :id="`anime-title-mobile-${anime.mal_id}`"
                class="line-clamp-2 flex-1 text-sm font-bold text-rp-text"
              >
                {{ anime.title }}
              </h3>
              <AnimeCardFavoriteButton
                :is-favorite="isFavorite"
                :is-animating="isAnimating"
                variant="mobile"
                @toggle="toggleFavorite"
              />
            </div>

            <AnimeCardInfo
              :year="anime.year"
              :episodes="anime.episodes"
              size="xs"
            />
            <AnimeCardGenres
              :genres="anime.genres"
              size="xs"
            />
            <UiAiringBadge
              v-if="anime.airing"
              size="xs"
              class="mt-0.5 w-fit"
            />
          </div>
        </NuxtLink>

        <!-- Desktop: Vertical layout -->
        <div class="relative hidden aspect-[3/4.2] overflow-hidden sm:block">
          <NuxtLink
            :to="animeLink"
            :view-transition="true"
            class="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
            :aria-labelledby="`anime-title-desktop-${anime.mal_id}`"
          >
            <NuxtImg
              :src="anime.images.webp.large_image_url"
              :alt="$t('anime.coverAlt', { title: anime.title })"
              :style="{ viewTransitionName: `poster-${anime.mal_id}` }"
              class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
              draggable="false"
              loading="lazy"
              placeholder
            />
          </NuxtLink>

          <!-- Gradient overlay -->
          <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

          <!-- Glare effect -->
          <div
            class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            :style="glareStyle"
          />

          <!-- Badges -->
          <UiScoreBadge
            v-if="anime.score"
            :score="anime.score"
            size="sm"
            position="top-right"
          />
          <UiAiringBadge
            v-if="anime.airing"
            size="sm"
            position="top-left"
          />

          <!-- Contenido sobre la imagen -->
          <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 md:gap-2 md:p-4">
            <h3
              :id="`anime-title-desktop-${anime.mal_id}`"
              class="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-lg transition-colors duration-300 group-hover:text-rp-iris md:text-base"
            >
              {{ anime.title }}
            </h3>

            <AnimeCardInfo
              :year="anime.year"
              :episodes="anime.episodes"
              size="sm"
            />
            <AnimeCardGenres
              :genres="anime.genres"
              size="sm"
            />
          </div>

          <!-- Favorite button -->
          <AnimeCardFavoriteButton
            :is-favorite="isFavorite"
            :is-animating="isAnimating"
            variant="desktop"
            class="absolute bottom-3 right-3 md:bottom-4 md:right-4"
            @toggle="toggleFavorite"
          />
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

// Favorites
const animeRef = toRef(props, 'anime')
const cardRefForAnimation = computed(() => (props.animateOnRemove ? wrapperRef.value : null))
const { isFavorite, isAnimating, toggleFavorite } = useFavoriteToggle(animeRef, cardRefForAnimation)

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
