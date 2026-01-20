<template>
  <footer
    ref="footerRef"
    class="border-t border-white/5 py-6 pb-8"
    role="contentinfo"
  >
    <UContainer>
      <div class="flex flex-col items-center gap-3 px-4 md:gap-4 md:px-0">
        <div class="flex flex-wrap items-center justify-center gap-1 text-xs text-rp-subtle md:gap-2 md:text-sm">
          <span>{{ $t('footer.builtWith') }}</span>
          <span
            class="text-rp-muted"
            aria-hidden="true"
          >
            &#8226;
          </span>
          <span>{{ $t('footer.dataFrom') }}</span>
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-rp-foam transition-colors hover:text-rp-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-foam focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base rounded"
          >
            Jikan API
            <span class="sr-only">(opens in new tab)</span>
          </a>
        </div>
        <div class="flex items-center gap-1 text-xs text-rp-subtle">
          <span>Made with</span>
          <UIcon
            name="i-heroicons-heart-solid"
            class="size-3 text-rp-love"
            aria-label="love"
          />
          <span>by</span>
          <span class="font-medium text-rp-iris">Jesus</span>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import { rafThrottle } from '~/utils/throttle'

const footerRef = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  heightChange: [height: number]
}>()

const calculateHeight = () => {
  if (footerRef.value) {
    const footerRect = footerRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const visibleHeight = Math.max(0, windowHeight - footerRect.top)
    emit('heightChange', Math.min(visibleHeight, footerRect.height))
  }
}

// Throttle scroll handler to prevent jank on mobile
const handleScroll = rafThrottle(calculateHeight)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  calculateHeight()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  handleScroll.cancel()
})
</script>
