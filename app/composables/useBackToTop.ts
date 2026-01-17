interface UseBackToTopOptions {
  /** Scroll threshold to show the button */
  threshold?: number
}

export const useBackToTop = (options: UseBackToTopOptions = {}) => {
  const { threshold = 500 } = options

  const isVisible = ref(false)

  const handleScroll = () => {
    isVisible.value = window.scrollY > threshold
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isVisible,
    scrollToTop,
  }
}
