<template>
  <div class="animate-pulse overflow-hidden rounded-xl border border-rp-overlay/50 bg-rp-surface">
    <div class="relative aspect-[3/4.2]">
      <!-- Image placeholder -->
      <div class="size-full bg-rp-overlay" />

      <!-- Score badge placeholder -->
      <div class="absolute right-2 top-2 h-5 w-12 rounded-full bg-rp-muted/50 md:right-3 md:top-3 md:h-6 md:w-14" />

      <!-- Content placeholder -->
      <div class="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <!-- Title -->
        <div class="h-4 w-3/4 rounded bg-rp-muted/50 md:h-5" />
        <div class="mt-1 h-4 w-1/2 rounded bg-rp-muted/50 md:h-5" />

        <!-- Info -->
        <div class="mt-2 flex items-center gap-2">
          <div class="h-3 w-12 rounded bg-rp-muted/50 md:h-4" />
          <div class="h-3 w-16 rounded bg-rp-muted/50 md:h-4" />
        </div>

        <!-- Genres -->
        <div class="mt-2 flex gap-1">
          <div class="h-5 w-14 rounded-full bg-rp-muted/50 md:h-6 md:w-16" />
          <div class="h-5 w-12 rounded-full bg-rp-muted/50 md:h-6 md:w-14" />
        </div>
      </div>
    </div>
  </div>
</template>
