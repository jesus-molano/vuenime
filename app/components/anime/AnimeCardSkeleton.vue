<template>
  <!-- Mobile: Layout horizontal | Desktop: Layout vertical -->
  <div
    class="overflow-hidden rounded-lg bg-rp-surface shadow-md border border-rp-overlay sm:rounded-xl sm:shadow-lg md:rounded-2xl md:shadow-2xl animate-pulse"
  >
    <!-- Mobile: Horizontal layout -->
    <div class="flex sm:hidden">
      <!-- Imagen placeholder -->
      <div class="h-32 w-24 shrink-0 bg-rp-overlay" />

      <!-- Contenido placeholder -->
      <div class="flex flex-1 flex-col justify-center gap-2 p-3">
        <!-- Título -->
        <div class="h-4 w-3/4 rounded bg-rp-overlay" />
        <div class="h-4 w-1/2 rounded bg-rp-overlay" />

        <!-- Info -->
        <div class="flex items-center gap-2">
          <div class="h-3 w-12 rounded bg-rp-overlay" />
          <div class="h-3 w-16 rounded bg-rp-overlay" />
        </div>

        <!-- Géneros -->
        <div class="flex gap-1">
          <div class="h-4 w-14 rounded-full bg-rp-overlay" />
          <div class="h-4 w-12 rounded-full bg-rp-overlay" />
        </div>
      </div>
    </div>

    <!-- Desktop: Vertical layout -->
    <div class="relative hidden aspect-[3/4] overflow-hidden sm:block">
      <!-- Imagen placeholder -->
      <div class="size-full bg-rp-overlay" />

      <!-- Badge score placeholder -->
      <div class="absolute right-2 top-2 h-5 w-12 rounded-full bg-rp-muted/50 md:right-3 md:top-3 md:h-6 md:w-14" />

      <!-- Contenido placeholder -->
      <div class="absolute inset-x-0 bottom-0 p-2 md:p-4">
        <!-- Título -->
        <div class="h-4 w-3/4 rounded bg-rp-muted/50 md:h-5" />
        <div class="mt-1 h-4 w-1/2 rounded bg-rp-muted/50 md:h-5" />

        <!-- Info -->
        <div class="mt-2 flex items-center gap-2 md:gap-3">
          <div class="h-3 w-12 rounded bg-rp-muted/50 md:h-4" />
          <div class="h-3 w-16 rounded bg-rp-muted/50 md:h-4" />
        </div>

        <!-- Géneros -->
        <div class="mt-2 flex gap-1">
          <div class="h-5 w-14 rounded-full bg-rp-muted/50 md:h-6 md:w-16" />
          <div class="h-5 w-12 rounded-full bg-rp-muted/50 md:h-6 md:w-14" />
        </div>
      </div>
    </div>
  </div>
</template>
