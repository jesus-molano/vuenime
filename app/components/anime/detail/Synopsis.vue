<template>
  <section v-if="text" class="bg-rp-base py-12 md:py-20">
    <UContainer class="px-4 sm:px-6">
      <AnimeDetailSectionHeader
        :icon="icon || 'i-heroicons-document-text'"
        :title="title"
        :color="color || 'rose'"
      />

      <div class="relative mx-auto max-w-4xl">
        <div class="rounded-2xl bg-rp-surface/50 p-6 ring-1 ring-white/5 md:p-8">
          <p class="whitespace-pre-line text-base leading-relaxed text-rp-subtle md:text-lg">
            {{ text }}
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text?: string | null
  icon?: string
  color?: 'iris' | 'rose' | 'foam' | 'gold'
}>()
</script>
