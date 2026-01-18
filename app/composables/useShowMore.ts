/**
 * Composable for "show more" pagination functionality
 * Used in tabs that display lists with progressive disclosure
 */
export function useShowMore<T>(
  items: Ref<T[]> | ComputedRef<T[]>,
  options: {
    initialCount?: number
    pageSize?: number
    showAll?: boolean
  } = {}
) {
  const { initialCount = 10, pageSize = initialCount, showAll: showAllMode = false } = options

  const displayCount = ref(initialCount)
  const isShowingAll = ref(false)

  const displayedItems = computed(() => {
    if (showAllMode && isShowingAll.value) {
      return items.value
    }
    return items.value.slice(0, displayCount.value)
  })

  const hasMore = computed(() => displayCount.value < items.value.length)
  const remainingCount = computed(() => items.value.length - displayCount.value)

  const loadMore = () => {
    if (showAllMode) {
      isShowingAll.value = true
    } else {
      displayCount.value += pageSize
    }
  }

  const reset = () => {
    displayCount.value = initialCount
    isShowingAll.value = false
  }

  return {
    displayedItems,
    hasMore,
    remainingCount,
    loadMore,
    reset,
  }
}
