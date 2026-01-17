<template>
  <UiModal
    v-model:open="isOpen"
    :aria-labelled-by="modalTitleId"
  >
    <!-- Header -->
    <div class="border-b border-rp-overlay/50 px-6 py-5 text-center">
      <div
        class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
        :class="resetEmailSent ? 'bg-rp-foam/20' : 'bg-rp-iris/20'"
      >
        <UIcon
          :name="
            resetEmailSent
              ? 'i-heroicons-envelope-solid'
              : isForgotPassword
                ? 'i-heroicons-key-solid'
                : 'i-heroicons-sparkles-solid'
          "
          class="size-7"
          :class="resetEmailSent ? 'text-rp-foam' : 'text-rp-iris'"
          aria-hidden="true"
        />
      </div>
      <h2
        :id="modalTitleId"
        class="text-xl font-bold text-rp-text"
      >
        {{ modalTitle }}
      </h2>
      <p class="mt-1 text-sm text-rp-subtle">
        {{ modalSubtitle }}
      </p>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Reset Email Sent Success -->
      <template v-if="resetEmailSent">
        <div class="text-center">
          <p class="mb-6 text-sm text-rp-subtle">
            {{ $t('auth.resetEmailSentTo') }}
            <strong class="text-rp-text">{{ email }}</strong>
          </p>
          <button
            type="button"
            class="w-full rounded-xl bg-rp-iris px-4 py-3 font-medium text-rp-base transition-all hover:bg-rp-iris/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
            @click="backToSignIn"
          >
            {{ $t('auth.backToSignIn') }}
          </button>
        </div>
      </template>

      <!-- Forgot Password Form -->
      <template v-else-if="isForgotPassword">
        <form
          class="space-y-4"
          @submit.prevent="handleResetPassword"
        >
          <div class="group">
            <label
              for="reset-email"
              class="mb-2 block text-sm font-medium text-rp-text"
            >
              {{ $t('auth.email') }}
            </label>
            <div class="input-wrapper relative">
              <UIcon
                name="i-heroicons-envelope"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted transition-colors duration-300"
                aria-hidden="true"
              />
              <input
                id="reset-email"
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                required
                autocomplete="email"
                class="auth-input w-full rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 py-3 pl-12 pr-4 text-rp-text placeholder-rp-muted outline-none transition-all duration-300 hover:border-rp-subtle/50 hover:bg-rp-overlay/40 focus:border-rp-iris focus:bg-rp-overlay/50 focus:shadow-lg focus:shadow-rp-iris/10"
              />
            </div>
          </div>

          <!-- Error message -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="errorMessage"
              class="flex items-center gap-2 rounded-xl bg-rp-love/10 px-4 py-3 text-sm text-rp-love"
              role="alert"
            >
              <UIcon
                name="i-heroicons-exclamation-circle"
                class="size-5 shrink-0"
                aria-hidden="true"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="isLoadingReset"
            :aria-busy="isLoadingReset"
            class="submit-btn group relative w-full overflow-hidden rounded-xl bg-rp-iris px-4 py-3 font-medium text-rp-base shadow-md transition-all duration-300 hover:bg-rp-iris/90 hover:shadow-lg hover:shadow-rp-iris/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span
              v-if="!isLoadingReset"
              class="relative"
            >
              {{ $t('auth.sendResetLink') }}
            </span>
            <UIcon
              v-else
              name="i-heroicons-arrow-path"
              class="relative mx-auto size-5 animate-spin"
              aria-hidden="true"
            />
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-rp-subtle">
          {{ $t('auth.rememberPassword') }}
          <button
            type="button"
            class="ml-1 font-semibold text-rp-iris underline decoration-rp-iris/50 underline-offset-2 transition-colors hover:text-rp-love hover:decoration-rp-love focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
            @click="backToSignIn"
          >
            {{ $t('auth.signIn') }}
          </button>
        </p>
      </template>

      <!-- Normal Sign In / Sign Up Flow -->
      <template v-else>
        <!-- Social Buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            :disabled="isLoadingGoogle"
            :aria-busy="isLoadingGoogle"
            class="social-btn-google group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-rp-overlay bg-rp-overlay/40 px-4 py-3 text-sm font-medium text-rp-text transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleGoogleSignIn"
          >
            <Icon
              v-if="!isLoadingGoogle"
              name="logos:google-icon"
              class="relative z-10 size-5"
              aria-hidden="true"
            />
            <UIcon
              v-else
              name="i-heroicons-arrow-path"
              class="relative z-10 size-5 animate-spin"
              aria-hidden="true"
            />
            <span class="relative z-10 transition-colors duration-300 group-hover:text-white">Google</span>
          </button>

          <button
            type="button"
            :disabled="isLoadingGitHub"
            :aria-busy="isLoadingGitHub"
            class="social-btn-github group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-rp-overlay bg-rp-overlay/40 px-4 py-3 text-sm font-medium text-rp-text transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleGitHubSignIn"
          >
            <Icon
              v-if="!isLoadingGitHub"
              name="mdi:github"
              class="relative z-10 size-5"
              aria-hidden="true"
            />
            <UIcon
              v-else
              name="i-heroicons-arrow-path"
              class="relative z-10 size-5 animate-spin"
              aria-hidden="true"
            />
            <span class="relative z-10 transition-colors duration-300 group-hover:text-white">GitHub</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="w-full border-t border-rp-overlay/50" />
          </div>
          <div class="relative flex justify-center">
            <span class="bg-rp-surface px-3 text-xs uppercase tracking-wider text-rp-muted">
              {{ $t('auth.orContinueWith') }}
            </span>
          </div>
        </div>

        <!-- Email Form -->
        <form
          class="space-y-4"
          @submit.prevent="handleEmailAuth"
        >
          <div class="group">
            <label
              for="auth-email"
              class="mb-2 block text-sm font-medium text-rp-text"
            >
              {{ $t('auth.email') }}
            </label>
            <div class="input-wrapper relative">
              <UIcon
                name="i-heroicons-envelope"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted transition-colors duration-300"
                aria-hidden="true"
              />
              <input
                id="auth-email"
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                required
                autocomplete="email"
                class="auth-input w-full rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 py-3 pl-12 pr-4 text-rp-text placeholder-rp-muted outline-none transition-all duration-300 hover:border-rp-subtle/50 hover:bg-rp-overlay/40 focus:border-rp-iris focus:bg-rp-overlay/50 focus:shadow-lg focus:shadow-rp-iris/10"
              />
            </div>
          </div>

          <div class="group">
            <div class="mb-2 flex items-center justify-between">
              <label
                for="auth-password"
                class="block text-sm font-medium text-rp-text"
              >
                {{ $t('auth.password') }}
              </label>
              <button
                v-if="!isSignUp"
                type="button"
                class="text-xs text-rp-iris underline decoration-rp-iris/50 underline-offset-2 transition-colors hover:text-rp-love hover:decoration-rp-love focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
                @click="isForgotPassword = true"
              >
                {{ $t('auth.forgotPassword') }}
              </button>
            </div>
            <div class="input-wrapper relative">
              <UIcon
                name="i-heroicons-lock-closed"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted transition-colors duration-300"
                aria-hidden="true"
              />
              <input
                id="auth-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('auth.passwordPlaceholder')"
                required
                autocomplete="current-password"
                class="auth-input w-full rounded-xl border border-rp-overlay/50 bg-rp-overlay/30 py-3 pl-12 pr-12 text-rp-text placeholder-rp-muted outline-none transition-all duration-300 hover:border-rp-subtle/50 hover:bg-rp-overlay/40 focus:border-rp-iris focus:bg-rp-overlay/50 focus:shadow-lg focus:shadow-rp-iris/10"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-rp-muted transition-all duration-200 hover:scale-110 hover:text-rp-iris focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <UIcon
                  :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  class="size-5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <!-- Error message -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="errorMessage"
              class="flex items-center gap-2 rounded-xl bg-rp-love/10 px-4 py-3 text-sm text-rp-love"
              role="alert"
            >
              <UIcon
                name="i-heroicons-exclamation-circle"
                class="size-5 shrink-0"
                aria-hidden="true"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoadingEmail"
            :aria-busy="isLoadingEmail"
            class="submit-btn group relative w-full overflow-hidden rounded-xl bg-rp-iris px-4 py-3 font-medium text-rp-base shadow-md transition-all duration-300 hover:bg-rp-iris/90 hover:shadow-lg hover:shadow-rp-iris/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris focus-visible:ring-offset-2 focus-visible:ring-offset-rp-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            <!-- Shine effect -->
            <span
              class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span
              v-if="!isLoadingEmail"
              class="relative"
            >
              {{ isSignUp ? $t('auth.signUp') : $t('auth.signIn') }}
            </span>
            <UIcon
              v-else
              name="i-heroicons-arrow-path"
              class="relative mx-auto size-5 animate-spin"
              aria-hidden="true"
            />
          </button>
        </form>

        <!-- Toggle sign in/up -->
        <p class="mt-5 text-center text-sm text-rp-subtle">
          {{ isSignUp ? $t('auth.haveAccountQuestion') : $t('auth.noAccountQuestion') }}
          <button
            type="button"
            class="ml-1 font-semibold text-rp-iris underline decoration-rp-iris/50 underline-offset-2 transition-colors hover:text-rp-love hover:decoration-rp-love focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-iris"
            @click="toggleMode"
          >
            {{ isSignUp ? $t('auth.signIn') : $t('auth.signUp') }}
          </button>
        </p>
      </template>
    </div>

    <!-- Footer -->
    <div class="border-t border-rp-overlay/50 px-6 py-4">
      <p class="text-center text-xs leading-relaxed text-rp-muted">
        {{ $t('auth.termsNotice') }}
      </p>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })

const { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const isForgotPassword = ref(false)
const resetEmailSent = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const isLoadingGoogle = ref(false)
const isLoadingGitHub = ref(false)
const isLoadingEmail = ref(false)
const isLoadingReset = ref(false)

const modalTitleId = computed(() => {
  if (resetEmailSent.value) return 'auth-title-reset-sent'
  if (isForgotPassword.value) return 'auth-title-forgot'
  return isSignUp.value ? 'auth-title-signup' : 'auth-title-signin'
})

const modalTitle = computed(() => {
  if (resetEmailSent.value) return t('auth.checkYourEmail')
  if (isForgotPassword.value) return t('auth.resetPassword')
  return isSignUp.value ? t('auth.createAccount') : t('auth.welcomeBack')
})

const modalSubtitle = computed(() => {
  if (resetEmailSent.value) return t('auth.resetEmailSentDescription')
  if (isForgotPassword.value) return t('auth.resetPasswordDescription')
  return t('auth.signInToSync')
})

function toggleMode() {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
}

function backToSignIn() {
  isForgotPassword.value = false
  resetEmailSent.value = false
  errorMessage.value = ''
}

async function handleGoogleSignIn() {
  isLoadingGoogle.value = true
  errorMessage.value = ''
  try {
    await signInWithGoogle()
  } catch (error) {
    console.error('Google sign in error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoadingGoogle.value = false
  }
}

async function handleGitHubSignIn() {
  isLoadingGitHub.value = true
  errorMessage.value = ''
  try {
    await signInWithGitHub()
  } catch (error) {
    console.error('GitHub sign in error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoadingGitHub.value = false
  }
}

async function handleEmailAuth() {
  isLoadingEmail.value = true
  errorMessage.value = ''
  try {
    if (isSignUp.value) {
      await signUpWithEmail(email.value, password.value)
    } else {
      await signInWithEmail(email.value, password.value)
    }
    isOpen.value = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoadingEmail.value = false
  }
}

async function handleResetPassword() {
  isLoadingReset.value = true
  errorMessage.value = ''
  try {
    await resetPassword(email.value)
    resetEmailSent.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoadingReset.value = false
  }
}
</script>

<style scoped>
/* Input icon color change on focus */
.input-wrapper:has(.auth-input:focus) .size-5 {
  color: rgb(var(--rp-iris));
}

/* Input hover state for icon */
.input-wrapper:has(.auth-input:hover) .size-5 {
  color: rgb(var(--rp-subtle));
}

/* Social button hover effects */
.social-btn-google::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn-google:hover::before {
  opacity: 0.15;
}

.social-btn-google:hover {
  border-color: rgba(66, 133, 244, 0.5);
  box-shadow: 0 0 20px rgba(66, 133, 244, 0.2);
}

.social-btn-github::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #333, #24292e);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn-github:hover::before {
  opacity: 0.4;
}

.social-btn-github:hover {
  border-color: rgba(110, 84, 148, 0.5);
  box-shadow: 0 0 20px rgba(110, 84, 148, 0.2);
}
</style>
