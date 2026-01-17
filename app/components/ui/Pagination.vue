<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2"
    :aria-label="$t('favorites.pagination')"
  >
    <!-- Previous -->
    <button
      type="button"
      :disabled="currentPage === 1"
      class="flex size-10 items-center justify-center rounded-lg bg-rp-surface text-rp-text transition-all hover:bg-rp-overlay disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
      :aria-label="$t('favorites.prevPage')"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      <UIcon
        name="i-heroicons-chevron-left"
        class="size-5"
      />
    </button>

    <!-- Page numbers -->
    <div class="flex items-center gap-1">
      <template
        v-for="page in visiblePages"
        :key="page"
      >
        <span
          v-if="page === '...'"
          class="flex size-10 items-center justify-center text-rp-muted"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          class="flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
          :class="page === currentPage ? 'bg-rp-iris text-white' : 'bg-rp-surface text-rp-text hover:bg-rp-overlay'"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="$emit('update:currentPage', page as number)"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- Next -->
    <button
      type="button"
      :disabled="currentPage === totalPages"
      class="flex size-10 items-center justify-center rounded-lg bg-rp-surface text-rp-text transition-all hover:bg-rp-overlay disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
      :aria-label="$t('favorites.nextPage')"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      <UIcon
        name="i-heroicons-chevron-right"
        class="size-5"
      />
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}>()

defineEmits<{
  'update:currentPage': [page: number]
}>()

const maxVisible = computed(() => props.maxVisiblePages ?? 5)

// Calculate which pages to show with ellipsis for large page counts
const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const max = maxVisible.value

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  const half = Math.floor(max / 2)

  let start = Math.max(1, current - half)
  let end = Math.min(total, current + half)

  // Adjust if at the beginning
  if (current <= half) {
    end = max - 1
  }

  // Adjust if at the end
  if (current > total - half) {
    start = total - max + 2
  }

  // Always show first page
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Always show last page
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }

  return pages
})
</script>
