<template>
  <button
    type="button"
    :aria-label="$t('common.search')"
    class="group hidden items-center gap-1.5 rounded-xl border border-rp-overlay/50 bg-rp-surface/90 px-3 py-2 backdrop-blur-xl transition-all hover:border-rp-iris/50 hover:bg-rp-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-base md:flex"
    @click="$emit('click')"
  >
    <UIcon
      name="i-heroicons-magnifying-glass"
      class="size-4 text-white/80 transition-colors group-hover:text-rp-iris"
      aria-hidden="true"
    />
    <kbd
      class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white/90"
      aria-hidden="true"
    >
      ⌘K
    </kbd>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>
