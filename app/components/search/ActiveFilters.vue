<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      v-if="selectedType"
      class="flex items-center gap-1 rounded-full bg-rp-iris/20 px-3 py-1 text-sm text-rp-iris"
    >
      {{ typeLabel }}
      <button
        type="button"
        class="ml-1 rounded-full p-0.5 hover:bg-rp-iris/30"
        @click="$emit('clearType')"
      >
        <UIcon
          name="i-heroicons-x-mark"
          class="size-3"
        />
      </button>
    </span>
    <span
      v-if="selectedGenre"
      class="flex items-center gap-1 rounded-full bg-rp-foam/20 px-3 py-1 text-sm text-rp-foam"
    >
      {{ genreLabel }}
      <button
        type="button"
        class="ml-1 rounded-full p-0.5 hover:bg-rp-foam/30"
        @click="$emit('clearGenre')"
      >
        <UIcon
          name="i-heroicons-x-mark"
          class="size-3"
        />
      </button>
    </span>
    <span
      v-if="selectedYear"
      class="flex items-center gap-1 rounded-full bg-rp-gold/20 px-3 py-1 text-sm text-rp-gold"
    >
      {{ selectedYear }}
      <button
        type="button"
        class="ml-1 rounded-full p-0.5 hover:bg-rp-gold/30"
        @click="$emit('clearYear')"
      >
        <UIcon
          name="i-heroicons-x-mark"
          class="size-3"
        />
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedType: string | null
  typeLabel: string
  selectedGenre: string
  genreLabel: string
  selectedYear: string | null
}>()

defineEmits<{
  clearType: []
  clearGenre: []
  clearYear: []
}>()
</script>
