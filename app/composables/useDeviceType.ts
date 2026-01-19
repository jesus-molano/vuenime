/**
 * Composable for detecting device type (mobile/desktop)
 * SSR-safe: defaults to desktop on server, then updates on client
 *
 * Used for responsive data loading - mobile gets fewer items initially
 * to improve First Contentful Paint and reduce data transfer
 */
export const useDeviceType = () => {
  // Default to desktop on SSR to ensure full content for SEO
  // Will be updated on client mount
  const isMobile = useState('device-is-mobile', () => false)
  const isHydrated = useState('device-hydrated', () => false)

  const MOBILE_BREAKPOINT = 640 // Tailwind 'sm' breakpoint

  const checkDevice = () => {
    if (import.meta.client) {
      isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
      isHydrated.value = true
    }
  }

  // Check on mount and window resize
  onMounted(() => {
    checkDevice()

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(checkDevice, 150)
    }

    window.addEventListener('resize', handleResize)
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    })
  })

  return {
    isMobile: readonly(isMobile),
    isHydrated: readonly(isHydrated),
  }
}

/**
 * Get responsive limit based on device type
 * For SSR: uses desktop limits (better for SEO/crawlers)
 * For client: uses appropriate limit based on screen size
 */
export const useResponsiveLimits = () => {
  const { isMobile } = useDeviceType()

  // Limits configuration
  const LIMITS = {
    // Trending grid - main content
    trending: { mobile: 12, desktop: 24 },
    // Carousels - only few visible at once
    carousel: { mobile: 8, desktop: 15 },
  } as const

  const trendingLimit = computed(() => (isMobile.value ? LIMITS.trending.mobile : LIMITS.trending.desktop))

  const carouselLimit = computed(() => (isMobile.value ? LIMITS.carousel.mobile : LIMITS.carousel.desktop))

  return {
    trendingLimit,
    carouselLimit,
    isMobile,
    LIMITS,
  }
}
