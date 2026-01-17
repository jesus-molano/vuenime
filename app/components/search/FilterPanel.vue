<template>
  <div class="space-y-4">
    <!-- Row 1: Type + Year (inline) -->
    <div class="flex flex-wrap items-end gap-4">
      <!-- Type -->
      <div class="flex-1">
        <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
          {{ $t('anime.type') }}
        </h4>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="type in typeOptions"
            :key="type.value"
            type="button"
            class="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
            :class="
              selectedType === type.value
                ? 'bg-rp-iris text-white'
                : 'bg-rp-overlay/50 text-rp-text hover:bg-rp-overlay'
            "
            @click="toggleType(type.value)"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Year Input (compact) -->
      <div class="w-24 shrink-0">
        <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
          {{ $t('search.year') }}
        </h4>
        <input
          :value="yearInput"
          type="number"
          :placeholder="currentYear.toString()"
          :min="1960"
          :max="currentYear + 1"
          class="w-full rounded-lg border bg-rp-base px-2.5 py-1.5 text-center text-sm text-rp-text outline-none transition-colors"
          :class="yearError ? 'border-rp-love focus:border-rp-love' : 'border-rp-overlay/50 focus:border-rp-iris'"
          @input="$emit('update:yearInput', ($event.target as HTMLInputElement).value)"
          @keyup.enter="$emit('applyYear')"
          @blur="$emit('applyYear')"
        />
        <p
          v-if="yearError"
          class="mt-1 text-xs text-rp-love"
        >
          {{ yearError }}
        </p>
      </div>
    </div>

    <!-- Row 2: Genres -->
    <div>
      <h4 class="mb-2 text-xs font-semibold uppercase tracking-wider text-rp-subtle">
        {{ $t('anime.genres') }}
      </h4>

      <!-- Genre Search -->
      <div class="relative mb-2">
        <input
          :value="genreSearch"
          type="text"
          :placeholder="$t('search.searchGenre')"
          class="w-full rounded-lg border border-rp-overlay/50 bg-rp-base px-3 py-2 text-sm text-rp-text outline-none transition-colors focus:border-rp-iris"
          @input="$emit('update:genreSearch', ($event.target as HTMLInputElement).value)"
          @focus="$emit('update:showGenreDropdown', true)"
          @blur="handleCloseDropdown"
        />

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showGenreDropdown && filteredGenres.length > 0"
            class="absolute z-100 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-rp-overlay/50 bg-rp-surface shadow-xl"
          >
            <button
              v-for="genre in filteredGenres"
              :key="genre.value"
              type="button"
              class="flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-rp-overlay/50"
              :class="selectedGenre === genre.value ? 'bg-rp-foam/20 text-rp-foam' : 'text-rp-text'"
              @click="$emit('selectGenre', genre.value)"
            >
              {{ genre.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Popular Genres Pills -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="genre in popularGenres"
          :key="genre.value"
          type="button"
          class="rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
          :class="
            selectedGenre === genre.value
              ? 'bg-rp-foam text-rp-base'
              : 'bg-rp-overlay/50 text-rp-text hover:bg-rp-overlay'
          "
          @click="$emit('selectGenre', selectedGenre === genre.value ? '' : genre.value)"
        >
          {{ genre.label }}
        </button>
      </div>
    </div>
  </div>

  <!-- Clear Button -->
  <div
    v-if="activeFiltersCount > 0"
    class="mt-4 border-t border-rp-overlay/50 pt-4"
  >
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-lg text-sm font-medium text-rp-love transition-all hover:text-rp-love/80"
      @click="$emit('clearAll')"
    >
      <UIcon
        name="i-heroicons-x-mark"
        class="size-4"
      />
      {{ $t('search.clearFilters') }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface GenreOption {
  value: string
  label: string
}

interface TypeOption {
  value: string
  label: string
}

defineProps<{
  typeOptions: TypeOption[]
  selectedType: string | null
  yearInput: string
  yearError: string
  currentYear: number
  genres: GenreOption[]
  popularGenres: GenreOption[]
  filteredGenres: GenreOption[]
  selectedGenre: string
  genreSearch: string
  showGenreDropdown: boolean
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  'update:yearInput': [value: string]
  'update:genreSearch': [value: string]
  'update:showGenreDropdown': [value: boolean]
  toggleType: [value: string]
  applyYear: []
  selectGenre: [value: string]
  clearAll: []
}>()

const toggleType = (value: string) => {
  emit('toggleType', value)
}

const handleCloseDropdown = () => {
  setTimeout(() => {
    emit('update:showGenreDropdown', false)
  }, 150)
}
</script>
