/**
 * Composable for scroll-triggered reveal animations
 * Uses Intersection Observer for performance
 */
export function useScrollReveal(
  options: {
    threshold?: number
    rootMargin?: string
    once?: boolean
  } = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (!elementRef.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)

    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return { elementRef, isVisible }
}

// Store observers for cleanup - use WeakMap to auto-cleanup when elements are GC'd
const observerMap = new WeakMap<HTMLElement, IntersectionObserver>()

/**
 * Directive for scroll reveal animations
 * Usage: v-scroll-reveal or v-scroll-reveal.fade-up
 * Respects prefers-reduced-motion for accessibility
 * SSR-safe: no-op on server, animations only on client
 */
export const vScrollReveal = {
  getSSRProps() {
    // Return empty props for SSR - no special handling needed
    return {}
  },
  mounted(el: HTMLElement, binding: { modifiers: Partial<Record<string, boolean>>; value?: number }) {
    // Skip on server
    if (typeof window === 'undefined') return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.style.opacity = '1'
      return
    }

    // Get delay from binding value
    const delay = binding.value || 0

    // Set initial state immediately (no transition yet)
    el.style.opacity = '0'
    el.style.willChange = 'opacity, transform'

    // Determine initial transform based on modifiers
    let initialTransform = 'translateY(20px)'
    if (binding.modifiers['fade-up']) {
      initialTransform = 'translateY(30px)'
    } else if (binding.modifiers['fade-down']) {
      initialTransform = 'translateY(-30px)'
    } else if (binding.modifiers['fade-left']) {
      initialTransform = 'translateX(30px)'
    } else if (binding.modifiers['fade-right']) {
      initialTransform = 'translateX(-30px)'
    } else if (binding.modifiers['scale']) {
      initialTransform = 'scale(0.95)'
    }
    el.style.transform = initialTransform

    const animate = () => {
      // Add transition after a frame to ensure initial state is rendered
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'

        // Apply delay
        if (delay > 0) {
          el.style.transitionDelay = `${delay}ms`
        }

        // Trigger animation
        requestAnimationFrame(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0) translateX(0) scale(1)'
        })
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small timeout to ensure DOM is ready
            setTimeout(animate, 50)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    )

    observer.observe(el)
    observerMap.set(el, observer)
  },
  unmounted(el: HTMLElement) {
    const observer = observerMap.get(el)
    if (observer) {
      observer.disconnect()
      observerMap.delete(el)
    }
  },
}
