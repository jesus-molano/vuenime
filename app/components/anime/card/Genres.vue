<template>
  <div
    class="flex flex-wrap"
    :class="gapClass"
  >
    <template v-if="linkable">
      <NuxtLink
        v-for="genre in displayGenres"
        :key="genre.mal_id"
        :to="getGenreSearchLink(genre)"
        class="rounded-full transition-all hover:scale-105"
        :class="pillClass"
      >
        {{ getGenreName(genre) }}
      </NuxtLink>
    </template>
    <template v-else>
      <span
        v-for="genre in displayGenres"
        :key="genre.mal_id"
        class="rounded-full"
        :class="pillClass"
      >
        {{ getGenreName(genre) }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
type CardGenresSize = 'xs' | 'sm' | 'hero'

interface Genre {
  mal_id: number
  name: string
}

const props = withDefaults(
  defineProps<{
    genres?: Genre[] | null
    size?: CardGenresSize
    limit?: number
    linkable?: boolean
  }>(),
  {
    genres: null,
    size: 'sm',
    limit: 2,
    linkable: false,
  }
)

const localePath = useLocalePath()
const { translateGenreById } = useAnimeTranslations()

const displayGenres = computed(() => props.genres?.slice(0, props.limit) ?? [])

const getGenreName = (genre: Genre) => {
  return translateGenreById(genre.mal_id) || genre.name
}

const getGenreSearchLink = (genre: Genre) => ({
  path: localePath('/search'),
  query: { genres: genre.mal_id, name: getGenreName(genre) },
})

const gapClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'gap-1'
    case 'hero':
      return 'gap-2'
    default:
      return 'gap-1.5'
  }
})

const pillClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'bg-white/5 px-2 py-0.5 text-[9px] text-rp-subtle'
    case 'hero':
      return 'bg-black/40 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm hover:bg-black/50'
    default:
      return 'bg-white/10 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm md:px-2.5 md:text-xs'
  }
})
</script>
