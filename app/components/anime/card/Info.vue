<template>
  <div
    class="flex items-center"
    :class="[gapClass, textClass]"
  >
    <span
      v-if="year"
      class="flex items-center"
      :class="itemGapClass"
    >
      <UIcon
        name="i-heroicons-calendar"
        :class="iconClass"
      />
      {{ year }}
    </span>
    <span
      v-if="episodes"
      class="flex items-center"
      :class="itemGapClass"
    >
      <UIcon
        name="i-heroicons-play"
        :class="iconClass"
      />
      {{ episodes }} {{ $t('anime.eps') }}
    </span>
  </div>
</template>

<script setup lang="ts">
type CardInfoSize = 'xs' | 'sm'

const props = withDefaults(
  defineProps<{
    year?: number | null
    episodes?: number | null
    size?: CardInfoSize
  }>(),
  {
    year: null,
    episodes: null,
    size: 'sm',
  }
)

const gapClass = computed(() => (props.size === 'xs' ? 'gap-2' : 'gap-3'))
const itemGapClass = computed(() => (props.size === 'xs' ? 'gap-0.5' : 'gap-1'))
const iconClass = computed(() => (props.size === 'xs' ? 'size-2.5' : 'size-3 md:size-3.5'))
const textClass = computed(() =>
  props.size === 'xs' ? 'text-[10px] text-rp-subtle' : 'text-[10px] text-white/70 md:text-xs'
)
</script>
