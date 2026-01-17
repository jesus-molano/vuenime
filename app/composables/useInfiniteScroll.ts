interface UseInfiniteScrollOptions {
  /** Whether there are more items to load */
  hasMore: Ref<boolean> | ComputedRef<boolean>
  /** Whether currently loading */
  isLoading: Ref<boolean> | ComputedRef<boolean>
  /** Whether there's an error */
  hasError?: Ref<boolean> | Ref<string | null> | ComputedRef<boolean>
  /** Function to call when trigger is visible */
  onLoadMore: () => void
  /** Root margin for intersection observer */
  rootMargin?: string
}

export const useInfiniteScroll = (options: UseInfiniteScrollOptions) => {
  const { hasMore, isLoading, hasError, onLoadMore, rootMargin = '200px' } = options

  const triggerRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const createObserver = () => {
    // Cleanup previous observer
    if (observer) {
      observer.disconnect()
      observer = null
    }

    // Don't create if no element
    if (!triggerRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const errorValue = hasError?.value
        const hasErrorBool = typeof errorValue === 'string' ? !!errorValue : !!errorValue

        if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value && !hasErrorBool) {
          onLoadMore()
        }
      },
      { rootMargin }
    )

    observer.observe(triggerRef.value)
  }

  // Watch for trigger element changes (handles v-if/v-else scenarios)
  watch(
    triggerRef,
    (newEl) => {
      if (newEl) {
        createObserver()
      } else if (observer) {
        observer.disconnect()
        observer = null
      }
    },
    { immediate: true }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    triggerRef,
  }
}
