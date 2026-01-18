<template>
  <article class="rounded-lg border border-rp-overlay/50 bg-rp-surface p-4">
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <!-- User avatar -->
        <NuxtImg
          v-if="review.user.images?.jpg?.image_url"
          :src="review.user.images.jpg.image_url"
          :alt="review.user.username"
          class="size-10 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-rp-overlay text-sm font-medium text-rp-text"
        >
          {{ review.user.username.charAt(0).toUpperCase() }}
        </div>
        <!-- User info -->
        <div>
          <p class="text-sm font-semibold text-rp-text">{{ review.user.username }}</p>
          <p class="text-xs text-rp-muted">{{ formattedDate }}</p>
        </div>
      </div>
      <!-- Score -->
      <div class="flex items-center gap-1 rounded-full bg-rp-iris/10 px-2 py-1">
        <UIcon
          name="i-heroicons-star-solid"
          class="size-4 text-rp-gold"
        />
        <span class="text-sm font-bold text-rp-iris">{{ review.score }}</span>
      </div>
    </div>

    <!-- Tags -->
    <div
      v-if="review.tags?.length > 0"
      class="mt-3 flex flex-wrap gap-1.5"
    >
      <span
        v-for="tag in review.tags"
        :key="tag"
        class="rounded-full bg-rp-overlay/50 px-2 py-0.5 text-[10px] font-medium text-rp-muted"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Review content -->
    <div class="mt-3">
      <p
        class="text-sm leading-relaxed text-rp-subtle"
        :class="{ 'line-clamp-4': !isExpanded }"
      >
        {{ review.review }}
      </p>
      <button
        v-if="review.review.length > 300"
        type="button"
        class="mt-2 text-xs font-medium text-rp-iris transition-colors hover:text-rp-iris/80"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? $t('anime.showLess') : $t('common.readMore') }}
      </button>
    </div>

    <!-- Reactions -->
    <div
      v-if="review.reactions?.overall > 0"
      class="mt-3 flex items-center gap-1.5 text-xs text-rp-muted"
    >
      <UIcon
        name="i-heroicons-hand-thumb-up"
        class="size-4"
      />
      <span>{{ review.reactions.overall }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Review } from '~~/shared/types'

const props = defineProps<{
  review: Review
}>()

const isExpanded = ref(false)

const formattedDate = computed(() => formatDate(props.review.date))
</script>
