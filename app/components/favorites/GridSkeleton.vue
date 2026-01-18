<template>
  <div>
    <!-- Controls skeleton -->
    <div class="mb-6 flex flex-wrap items-center justify-end gap-4 md:mb-8 md:justify-between">
      <div class="hidden h-5 w-32 animate-pulse rounded bg-rp-surface md:block" />
      <div class="flex items-center gap-3">
        <div class="h-9 w-10 animate-pulse rounded-lg bg-rp-surface sm:w-24" />
        <div class="h-9 w-32 animate-pulse rounded-xl bg-rp-surface sm:w-48" />
      </div>
    </div>

    <!-- Grid skeleton -->
    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-6"
    >
      <div
        v-for="i in 10"
        :key="i"
        class="aspect-[3/4] animate-pulse rounded-xl bg-rp-surface"
      />
    </div>
  </div>
</template>
