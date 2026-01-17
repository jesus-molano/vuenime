<template>
  <div>
    <div class="relative overflow-hidden">
      <p
        class="wrap-break-word text-sm leading-relaxed text-rp-subtle sm:text-base"
        :class="[isExpanded ? '' : lineClampClass]"
      >
        {{ text || fallbackText }}
      </p>

      <!-- Gradient fade when collapsed -->
      <div
        v-if="!isExpanded && isLongText"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-rp-base to-transparent sm:h-10"
      />
    </div>

    <!-- Expand/collapse button -->
    <button
      v-if="isLongText"
      type="button"
      class="mt-3 flex items-center gap-1 text-xs font-medium text-rp-iris transition-colors hover:text-rp-iris/80 sm:mt-4 sm:gap-1.5 sm:text-sm"
      @click="isExpanded = !isExpanded"
    >
      {{ isExpanded ? collapseLabel : expandLabel }}
      <UIcon
        :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="size-3.5 sm:size-4"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string | null
    fallbackText?: string
    maxLength?: number
    lineClamp?: number
  }>(),
  {
    text: null,
    fallbackText: '',
    maxLength: 500,
    lineClamp: 10,
  }
)

const { t } = useI18n()

const isExpanded = ref(false)
const isLongText = computed(() => (props.text?.length ?? 0) > props.maxLength)

const lineClampClass = computed(() => {
  const clamp = props.lineClamp
  return `line-clamp-6 sm:line-clamp-${clamp} lg:line-clamp-${clamp + 4}`
})

const expandLabel = computed(() => t('common.readMore'))
const collapseLabel = computed(() => t('anime.showLess'))
</script>
