import { rafThrottle } from '~/utils/throttle'

interface UseBackToTopOptions {
  /** Scroll threshold to show the button */
  threshold?: number
}

export const useBackToTop = (options: UseBackToTopOptions = {}) => {
  const { threshold = 500 } = options

  const isVisible = ref(false)

  const updateVisibility = () => {
    isVisible.value = window.scrollY > threshold
  }

  // Throttle scroll handler to once per animation frame
  const handleScroll = rafThrottle(updateVisibility)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    handleScroll.cancel()
  })

  return {
    isVisible,
    scrollToTop,
  }
}
