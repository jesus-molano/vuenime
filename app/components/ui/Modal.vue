<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-wrapper fixed inset-0 z-60"
      @keydown.escape="close"
    >
      <!-- Backdrop -->
      <Transition name="modal-backdrop">
        <div
          v-if="open"
          class="absolute inset-0 bg-rp-base/90 backdrop-blur-md"
          aria-hidden="true"
          @click="close"
        />
      </Transition>

      <!-- Panel -->
      <Transition name="modal-panel">
        <div
          v-if="open"
          class="relative flex min-h-full items-center justify-center p-4"
          :class="containerClass"
          @click.self="close"
        >
          <div
            role="dialog"
            aria-modal="true"
            :aria-labelledby="ariaLabelledBy"
            class="relative w-full overflow-hidden rounded-2xl border border-rp-overlay/50 bg-rp-surface shadow-2xl shadow-rp-iris/10"
            :class="contentClass"
            @click.stop
          >
            <!-- Close button -->
            <button
              v-if="showCloseButton"
              type="button"
              class="group absolute right-4 top-4 z-10 rounded-lg p-1.5 text-rp-muted transition-all duration-200 hover:bg-rp-overlay/50 hover:text-rp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
              :aria-label="$t('common.cancel')"
              @click="close"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="size-5 transition-transform duration-200 group-hover:rotate-90"
                aria-hidden="true"
              />
            </button>

            <!-- Content -->
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  showCloseButton?: boolean
  ariaLabelledBy?: string
  containerClass?: string
  contentClass?: string
}

withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  ariaLabelledBy: undefined,
  containerClass: '',
  contentClass: 'max-w-md',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function close() {
  emit('update:open', false)
}
</script>
