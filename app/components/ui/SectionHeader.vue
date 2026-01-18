<template>
  <div class="mb-4 flex items-center justify-between sm:mb-6">
    <div class="flex items-center gap-2">
      <div
        class="flex size-8 items-center justify-center rounded-lg sm:size-10"
        :class="iconBgClass"
      >
        <UIcon
          :name="icon"
          class="size-4 sm:size-5"
          :class="iconClass"
          aria-hidden="true"
        />
      </div>
      <div>
        <h2 class="text-base font-bold text-rp-text sm:text-lg md:text-xl">
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="text-[10px] text-rp-muted sm:text-xs"
          :class="{ capitalize: capitalize }"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    iconBgClass?: string
    iconClass?: string
    title: string
    subtitle?: string
    capitalize?: boolean
  }>(),
  {
    iconBgClass: 'bg-rp-iris/10',
    iconClass: 'text-rp-iris',
    subtitle: undefined,
    capitalize: false,
  }
)
</script>
