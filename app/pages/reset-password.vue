<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Success State -->
      <div
        v-if="isSuccess"
        class="rounded-2xl border border-rp-overlay/50 bg-rp-surface p-8 text-center"
      >
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rp-foam/20">
          <UIcon
            name="i-heroicons-check-circle-solid"
            class="size-7 text-rp-foam"
          />
        </div>
        <h1 class="text-xl font-bold text-rp-text">{{ $t('auth.passwordUpdated') }}</h1>
        <p class="mt-2 text-sm text-rp-subtle">{{ $t('auth.passwordUpdatedDescription') }}</p>
        <NuxtLink
          :to="localePath('/')"
          class="mt-6 inline-block rounded-xl bg-rp-iris px-6 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/90"
        >
          {{ $t('auth.goToHome') }}
        </NuxtLink>
      </div>

      <!-- Form State -->
      <div
        v-else
        class="rounded-2xl border border-rp-overlay/50 bg-rp-surface p-8"
      >
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-rp-iris/20">
            <UIcon
              name="i-heroicons-key-solid"
              class="size-7 text-rp-iris"
            />
          </div>
          <h1 class="text-xl font-bold text-rp-text">{{ $t('auth.setNewPassword') }}</h1>
          <p class="mt-2 text-sm text-rp-subtle">{{ $t('auth.setNewPasswordDescription') }}</p>
        </div>

        <form
          class="space-y-4"
          @submit.prevent="handleUpdatePassword"
        >
          <div>
            <label
              for="new-password"
              class="mb-2 block text-sm font-medium text-rp-text"
            >
              {{ $t('auth.newPassword') }}
            </label>
            <div class="relative">
              <UIcon
                name="i-heroicons-lock-closed"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted"
              />
              <input
                id="new-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('auth.newPasswordPlaceholder')"
                required
                minlength="6"
                autocomplete="new-password"
                class="w-full rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 py-3 pl-12 pr-12 text-rp-text placeholder-rp-muted outline-none transition-all hover:border-rp-subtle/50 focus:border-rp-iris focus:bg-rp-overlay/50"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-rp-muted hover:text-rp-iris"
                @click="showPassword = !showPassword"
              >
                <UIcon
                  :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  class="size-5"
                />
              </button>
            </div>
          </div>

          <div>
            <label
              for="confirm-password"
              class="mb-2 block text-sm font-medium text-rp-text"
            >
              {{ $t('auth.confirmPassword') }}
            </label>
            <div class="relative">
              <UIcon
                name="i-heroicons-lock-closed"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted"
              />
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
                required
                minlength="6"
                autocomplete="new-password"
                class="w-full rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 py-3 pl-12 pr-12 text-rp-text placeholder-rp-muted outline-none transition-all hover:border-rp-subtle/50 focus:border-rp-iris focus:bg-rp-overlay/50"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-rp-muted hover:text-rp-iris"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <UIcon
                  :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  class="size-5"
                />
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 rounded-xl bg-rp-love/10 px-4 py-3 text-sm text-rp-love"
          >
            <UIcon
              name="i-heroicons-exclamation-circle"
              class="size-5 shrink-0"
            />
            <span>{{ errorMessage }}</span>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-xl bg-rp-iris px-4 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="!isLoading">{{ $t('auth.updatePassword') }}</span>
            <UIcon
              v-else
              name="i-heroicons-arrow-path"
              class="mx-auto size-5 animate-spin"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { updatePassword } = useAuth()
const localePath = useLocalePath()
const { t } = useI18n()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

async function handleUpdatePassword() {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('auth.passwordsDoNotMatch')
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = t('auth.passwordTooShort')
    return
  }

  isLoading.value = true
  try {
    await updatePassword(password.value)
    isSuccess.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}
</script>
