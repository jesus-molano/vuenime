<template>
  <article class="flex flex-col items-center text-center">
    <!-- Character Image (Circle) with expand on hover/tap -->
    <button
      type="button"
      class="group relative mb-2 size-16 cursor-pointer overflow-hidden rounded-full bg-rp-overlay ring-2 ring-rp-surface transition-all duration-200 hover:ring-rp-iris/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris sm:size-20 md:size-24"
      :aria-label="$t('detail.viewCharacter', { name: character.character.name })"
      @click="openCard"
    >
      <NuxtImg
        :src="character.character.images.webp?.image_url || character.character.images.jpg.image_url"
        :alt="character.character.name"
        class="size-full object-cover transition-transform duration-200 group-hover:scale-110"
        loading="lazy"
        placeholder
      />
    </button>
    <!-- Info -->
    <h4 class="line-clamp-2 text-[11px] font-medium leading-tight text-rp-text sm:text-xs">
      {{ character.character.name }}
    </h4>
    <!-- Voice Actor (Japanese) -->
    <p
      v-if="japaneseVA"
      class="mt-0.5 line-clamp-1 text-[10px] text-rp-muted"
    >
      {{ japaneseVA.person.name }}
    </p>

    <!-- Expanded Modal (Card Style) -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isExpanded"
          class="fixed inset-0 z-50 flex items-center justify-center bg-rp-base/80 p-4 backdrop-blur-sm"
          @click="closeCard"
        >
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="scale-90 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-90 opacity-0"
          >
            <div
              v-if="isExpanded"
              class="card-3d-wrapper"
              style="perspective: 1000px"
            >
              <div
                ref="cardRef"
                class="relative w-52 overflow-hidden rounded-2xl border border-white/15 transition-transform duration-200 ease-out sm:w-64 md:w-72"
                style="touch-action: none"
                :style="[
                  cardTransform,
                  { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(196, 167, 231, 0.15)' },
                ]"
                @click.stop
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
                @touchstart.passive="handleTouchStart"
                @touchmove.prevent="handleTouchMove"
                @touchend.passive="handleTouchEnd"
              >
                <!-- Full character image (poster style) -->
                <div class="relative aspect-[3/4] w-full overflow-hidden bg-rp-overlay">
                  <NuxtImg
                    :src="character.character.images.webp?.image_url || character.character.images.jpg.image_url"
                    :alt="character.character.name"
                    class="size-full object-cover select-none"
                    draggable="false"
                  />
                  <!-- Glare effect -->
                  <div
                    class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                    :class="{ 'opacity-100': isHovering }"
                    :style="glareStyle"
                  />
                  <!-- Shine effect overlay -->
                  <div
                    v-if="showShine"
                    class="card-shine pointer-events-none absolute inset-0 z-10"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </article>
</template>

<script setup lang="ts">
import type { Character } from '~~/shared/types'

const props = defineProps<{
  character: Character
}>()

const isExpanded = ref(false)
const japaneseVA = computed(() => props.character.voice_actors.find((va) => va.language === 'Japanese'))

// Detect mobile device (touch support)
const isMobileDevice = ref(false)
onMounted(() => {
  isMobileDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

// Use enhanced 3D tilt composable
const {
  cardRef,
  isHovering,
  showShine,
  cardTransform,
  glareStyle,
  handleMouseMove,
  handleMouseLeave,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  enableGyroscopeListener,
  cleanup,
  triggerShine,
} = useCard3DTilt({
  maxRotation: 12,
  minWidth: 0, // Enable on all screen sizes for modal
  enableTouch: true,
  enableGyroscope: true,
  enableShine: true,
})

// Open card and request gyroscope permission (must be in user gesture)
const openCard = async () => {
  isExpanded.value = true
  triggerShine()

  if (isMobileDevice.value) {
    await enableGyroscopeListener()
  }
}

const closeCard = () => {
  isExpanded.value = false
  cleanup()
}

// Watch for modal close
watch(isExpanded, (expanded) => {
  if (!expanded) {
    cleanup()
  }
})

// Escape key handler at scope level
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isExpanded.value) {
    closeCard()
  }
}

// Close modal on escape key
onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
  cleanup()
})
</script>

<style scoped>
.card-shine {
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.03) 42%,
    rgba(255, 255, 255, 0.08) 44%,
    rgba(255, 255, 255, 0.15) 46%,
    rgba(255, 255, 255, 0.25) 48%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.25) 52%,
    rgba(255, 255, 255, 0.15) 54%,
    rgba(255, 255, 255, 0.08) 56%,
    rgba(255, 255, 255, 0.03) 58%,
    transparent 60%,
    transparent 100%
  );
  background-size: 300% 100%;
  animation: shine-sweep 0.8s ease-in-out;
}

@keyframes shine-sweep {
  0% {
    background-position: 150% 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    background-position: -50% 0;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-shine {
    animation: none;
  }
}
</style>
