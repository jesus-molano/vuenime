<template>
  <div
    class="flex flex-wrap"
    :class="gapClass"
  >
    <span
      v-for="genre in displayGenres"
      :key="genre.mal_id"
      class="rounded-full"
      :class="pillClass"
    >
      {{ getGenreName(genre) }}
    </span>
  </div>
</template>

<script setup lang="ts">
type CardGenresSize = 'xs' | 'sm'

interface Genre {
  mal_id: number
  name: string
}

const props = withDefaults(
  defineProps<{
    genres?: Genre[] | null
    size?: CardGenresSize
    limit?: number
  }>(),
  {
    genres: null,
    size: 'sm',
    limit: 2,
  }
)

const { translateGenreById } = useAnimeTranslations()

const displayGenres = computed(() => props.genres?.slice(0, props.limit) ?? [])

const getGenreName = (genre: Genre) => {
  return translateGenreById(genre.mal_id) || genre.name
}

const gapClass = computed(() => (props.size === 'xs' ? 'gap-1' : 'gap-1.5'))

const pillClass = computed(() =>
  props.size === 'xs'
    ? 'bg-white/5 px-2 py-0.5 text-[9px] text-rp-subtle'
    : 'bg-white/10 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm md:px-2.5 md:text-xs'
)
</script>
