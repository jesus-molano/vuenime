<template>
  <div class="group/carousel relative">
    <!-- Navigation buttons - hidden on mobile, visible on tablet+ -->
    <button
      v-show="canScrollLeft"
      type="button"
      :aria-label="$t('favorites.prevPage')"
      class="absolute -left-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-rp-overlay/80 bg-rp-surface/95 shadow-lg backdrop-blur-sm transition-all hover:bg-rp-overlay hover:scale-110 hover:border-rp-iris/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris sm:flex md:-left-4 md:size-11"
      @click="scrollLeftFn"
    >
      <UIcon
        name="i-heroicons-chevron-left"
        class="size-5 text-rp-text"
      />
    </button>

    <button
      v-show="canScrollRight"
      type="button"
      :aria-label="$t('favorites.nextPage')"
      class="absolute -right-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-rp-overlay/80 bg-rp-surface/95 shadow-lg backdrop-blur-sm transition-all hover:bg-rp-overlay hover:scale-110 hover:border-rp-iris/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris sm:flex md:-right-4 md:size-11"
      @click="scrollRightFn"
    >
      <UIcon
        name="i-heroicons-chevron-right"
        class="size-5 text-rp-text"
      />
    </button>

    <!-- Scrollable container -->
    <div
      ref="scrollContainer"
      class="carousel-scroll -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-3 sm:px-6 md:gap-4"
      :class="{ 'cursor-grab active:cursor-grabbing': true }"
      @mousedown.prevent="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @scroll="updateScrollState"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollContainer = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeftStart = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const hasDragged = ref(false)

// Cleanup references at scope level
let resizeObserver: ResizeObserver | null = null

const updateScrollState = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

const scrollLeftFn = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.8
  scrollContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

const scrollRightFn = () => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.8
  scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

const startDrag = (e: MouseEvent) => {
  if (!scrollContainer.value) return
  isDragging.value = true
  hasDragged.value = false
  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeftStart.value = scrollContainer.value.scrollLeft
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (startX.value - x) * 1.2
  if (Math.abs(walk) > 5) {
    hasDragged.value = true
  }
  scrollContainer.value.scrollLeft = scrollLeftStart.value + walk
}

const endDrag = () => {
  isDragging.value = false
}

// Prevent click on links when dragging
const handleClick = (e: MouseEvent) => {
  if (hasDragged.value) {
    e.preventDefault()
    e.stopPropagation()
  }
}

onMounted(() => {
  updateScrollState()
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('click', handleClick, true)
    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('click', handleClick, true)
  }
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.carousel-scroll {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.carousel-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
