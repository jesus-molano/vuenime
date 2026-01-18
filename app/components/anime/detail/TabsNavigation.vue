<template>
  <nav
    class="flex border-b border-rp-overlay/50"
    role="tablist"
    :aria-label="$t('detail.tabs')"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.id"
      :aria-controls="`tabpanel-${tab.id}`"
      class="relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors sm:py-3 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-inset"
      :class="[modelValue === tab.id ? 'text-rp-iris' : 'text-rp-muted hover:text-rp-text']"
      @click="$emit('update:modelValue', tab.id)"
    >
      <UIcon
        :name="tab.icon"
        class="size-4 sm:size-5"
        aria-hidden="true"
      />
      <span class="hidden sm:inline">{{ tab.label }}</span>
      <!-- Active indicator -->
      <span
        v-if="modelValue === tab.id"
        class="absolute inset-x-0 -bottom-px h-0.5 bg-rp-iris"
      />
    </button>
  </nav>
</template>

<script setup lang="ts">
export interface Tab {
  id: string
  label: string
  icon: string
}

defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
