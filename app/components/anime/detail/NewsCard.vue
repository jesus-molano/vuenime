<template>
  <a
    :href="news.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group block rounded-lg border border-rp-overlay/50 bg-rp-surface p-4 transition-all hover:border-rp-iris/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
  >
    <article class="flex gap-4">
      <!-- Thumbnail -->
      <div
        v-if="news.images?.jpg?.image_url"
        class="h-20 w-32 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40"
      >
        <NuxtImg
          :src="news.images.jpg.image_url"
          :alt="news.title"
          class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          placeholder
        />
      </div>

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <h4
          class="line-clamp-2 text-sm font-semibold text-rp-text transition-colors group-hover:text-rp-iris sm:text-base"
        >
          {{ news.title }}
        </h4>

        <p
          v-if="news.excerpt"
          class="mt-1 line-clamp-2 text-xs text-rp-subtle sm:text-sm"
        >
          {{ news.excerpt }}
        </p>

        <!-- Meta -->
        <div class="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-rp-muted sm:text-xs">
          <span v-if="news.author_username">
            {{ news.author_username }}
          </span>
          <span v-if="formattedDate">
            {{ formattedDate }}
          </span>
          <span
            v-if="news.comments > 0"
            class="flex items-center gap-1"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left"
              class="size-3"
            />
            {{ news.comments }}
          </span>
          <!-- External link indicator -->
          <UIcon
            name="i-heroicons-arrow-top-right-on-square"
            class="size-3 text-rp-iris"
          />
        </div>
      </div>
    </article>
  </a>
</template>

<script setup lang="ts">
import type { NewsItem } from '~~/shared/types'

const props = defineProps<{
  news: NewsItem
}>()

const formattedDate = computed(() => formatDate(props.news.date))
</script>
