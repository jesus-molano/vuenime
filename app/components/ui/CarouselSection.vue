<template>
  <section
    v-scroll-reveal.fade-up
    class="py-6 sm:py-8"
  >
    <UContainer class="px-4 sm:px-6">
      <UiSectionHeader
        :icon="icon"
        :icon-bg-class="iconBgClass"
        :icon-class="iconClass"
        :title="title"
        :subtitle="subtitle"
        :capitalize="capitalize"
      >
        <template
          v-if="$slots.action"
          #action
        >
          <slot name="action" />
        </template>
      </UiSectionHeader>

      <!-- Loading State -->
      <UiHorizontalCarousel v-if="isLoading">
        <div
          v-for="i in 8"
          :key="i"
          class="w-28 shrink-0 snap-start xs:w-32 sm:w-36 md:w-40 lg:w-44"
        >
          <HomeCarouselSkeleton />
        </div>
      </UiHorizontalCarousel>

      <!-- Empty State -->
      <UiEmptyState
        v-else-if="isEmpty"
        :icon="emptyIcon"
        :message="emptyMessage"
      />

      <!-- Content -->
      <UiHorizontalCarousel v-else>
        <slot />
      </UiHorizontalCarousel>
    </UContainer>
  </section>
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
    isLoading?: boolean
    isEmpty?: boolean
    emptyIcon?: string
    emptyMessage?: string
  }>(),
  {
    iconBgClass: 'bg-rp-iris/10',
    iconClass: 'text-rp-iris',
    subtitle: undefined,
    capitalize: false,
    isLoading: false,
    isEmpty: false,
    emptyIcon: 'i-heroicons-inbox',
    emptyMessage: '',
  }
)
</script>
