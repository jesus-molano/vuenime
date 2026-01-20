import { useIntersectionObserver } from '@vueuse/core'

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

  useIntersectionObserver(
    triggerRef,
    (entries) => {
      const entry = entries[0]
      const isIntersecting = entry?.isIntersecting
      const errorValue = hasError?.value
      const hasErrorBool = typeof errorValue === 'string' ? !!errorValue : !!errorValue

      if (isIntersecting && hasMore.value && !isLoading.value && !hasErrorBool) {
        onLoadMore()
      }
    },
    { rootMargin }
  )

  return {
    triggerRef,
  }
}
