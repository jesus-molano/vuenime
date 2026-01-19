<template>
  <div
    ref="wrapperRef"
    class="group card-perspective relative"
    @mouseenter="onCardHover"
    @mousemove="handleMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      ref="cardRef"
      class="card-3d relative rounded-2xl transition-transform duration-200 ease-out"
      :style="cardTransform"
    >
      <!-- Glow border (desktop only) -->
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

      <div
        class="card-inner relative overflow-hidden rounded-2xl border border-white/8 bg-rp-surface/95 backdrop-blur-sm transition-[box-shadow,border-color] duration-400 group-hover:border-white/15 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] has-focus-visible:ring-2 has-focus-visible:ring-rp-iris has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-rp-base"
      >
        <AnimeCardMobile
          :anime="anime"
          :anime-link="animeLink"
          :is-favorite="isFavorite"
          :is-animating="isAnimating"
          @toggle-favorite="toggleFavorite"
        />

        <AnimeCardDesktop
          :anime="anime"
          :anime-link="animeLink"
          :is-favorite="isFavorite"
          :is-animating="isAnimating"
          :poster-style="posterStyle"
          :glare-style="glareStyle"
          @toggle-favorite="toggleFavorite"
        />
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
  { animateOnRemove: false }
)

const wrapperRef = ref<HTMLElement | null>(null)

const { cardRef, isHovering, cardTransform, glareStyle, borderMaskStyle, handleMouseMove, handleMouseLeave } =
  useCard3DTilt({ maxRotation: 6, minWidth: 640 })

const animeRef = toRef(props, 'anime')
const cardRefForAnimation = computed(() => (props.animateOnRemove ? wrapperRef.value : null))
const { isFavorite, isAnimating, toggleFavorite } = useFavoriteToggle(animeRef, cardRefForAnimation)

const localePath = useLocalePath()
const animeLink = computed(() => localePath(`/anime/${props.anime.mal_id}`))

const { posterStyle } = usePosterTransition(() => props.anime.mal_id)

const onCardHover = () => prefetchAnimeDetail(props.anime.mal_id)

const onMouseLeave = () => {
  cancelPrefetchAnimeDetail(props.anime.mal_id)
  handleMouseLeave()
}
</script>

<style scoped>
.card-perspective {
  perspective: 1200px;
  contain: layout style;
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
