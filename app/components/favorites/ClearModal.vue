<template>
  <UiModal
    :open="open"
    aria-labelled-by="clear-dialog-title"
    content-class="max-w-sm"
    @update:open="$emit('update:open', $event)"
  >
    <div
      class="p-6 text-center"
      role="alertdialog"
      aria-describedby="clear-dialog-desc"
    >
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-rp-love/20">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="size-8 text-rp-love"
          aria-hidden="true"
        />
      </div>

      <h3
        id="clear-dialog-title"
        class="text-lg font-semibold text-rp-text"
      >
        {{ $t('favorites.clearConfirmTitle') }}
      </h3>

      <p
        id="clear-dialog-desc"
        class="mt-2 text-sm text-rp-subtle"
      >
        {{ $t('favorites.clearConfirmDesc') }}
      </p>

      <div class="mt-6 flex justify-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-rp-surface px-4 py-2 text-sm font-medium text-rp-text transition-all hover:bg-rp-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          @click="$emit('update:open', false)"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-lg bg-rp-love px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rp-love/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-love focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface"
          @click="handleConfirm"
        >
          {{ $t('favorites.clearAll') }}
        </button>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:open', false)
}
</script>
