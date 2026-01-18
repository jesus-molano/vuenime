<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-rp-base">
    <!-- Animated stars background -->
    <div class="stars-container absolute inset-0">
      <div
        v-for="i in 50"
        :key="i"
        class="star"
        :style="getStarStyle(i)"
      />
    </div>

    <!-- Floating particles -->
    <div class="particles-container absolute inset-0">
      <div
        v-for="i in 20"
        :key="`particle-${i}`"
        class="particle"
        :style="getParticleStyle(i)"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 px-4 text-center">
      <!-- Glitch 404 -->
      <div class="glitch-wrapper mb-6">
        <h1
          class="glitch text-8xl font-black tracking-tighter text-rp-love sm:text-9xl md:text-[12rem]"
          data-text="404"
        >
          404
        </h1>
      </div>

      <!-- 404 Illustration -->
      <div class="mx-auto mb-6 animate-float">
        <div class="relative">
          <!-- Gradient glow behind image -->
          <div class="absolute inset-0 blur-3xl">
            <div class="size-full rounded-full bg-linear-to-br from-rp-iris/40 via-rp-love/30 to-rp-foam/20" />
          </div>
          <NuxtImg
            src="/images/404.webp"
            alt="Lost in space"
            class="relative h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(235,111,146,0.3)] sm:h-64 md:h-80"
            loading="eager"
            placeholder
          />
        </div>
      </div>

      <!-- Message -->
      <h2 class="mb-2 text-xl font-bold text-rp-text sm:text-2xl md:text-3xl">
        {{ $t('error.lostInSpace') }}
      </h2>
      <p class="mx-auto mb-8 max-w-md text-sm text-rp-subtle sm:text-base">
        {{ $t('error.pageNotFound') }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          class="group flex items-center gap-2 rounded-xl bg-rp-iris px-6 py-3 font-medium text-white shadow-lg shadow-rp-iris/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rp-iris/30"
          @click="handleGoHome"
        >
          <svg
            class="size-5 transition-transform group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ $t('error.goHome') }}
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-xl border border-rp-overlay bg-rp-surface/50 px-6 py-3 font-medium text-rp-text backdrop-blur-sm transition-all hover:border-rp-iris/50 hover:bg-rp-surface"
          @click="handleGoBack"
        >
          <svg
            class="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ $t('error.goBack') }}
        </button>
      </div>

      <!-- Error details for non-404 -->
      <div
        v-if="error?.statusCode !== 404"
        class="mt-8 rounded-xl border border-rp-overlay/50 bg-rp-surface/30 p-4 backdrop-blur-sm"
      >
        <p class="text-sm text-rp-subtle">{{ $t('error.code') }}: {{ error?.statusCode || 500 }}</p>
        <p
          v-if="error?.message"
          class="mt-1 text-xs text-rp-muted"
        >
          {{ error.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError | null
}>()

const localePath = useLocalePath()
const router = useRouter()

const handleGoHome = () => {
  clearError({ redirect: localePath('/') })
}

const handleGoBack = () => {
  if (window.history.length > 2) {
    clearError()
    router.back()
  } else {
    handleGoHome()
  }
}

// Generate random star positions
const getStarStyle = (index: number) => {
  const random = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  return {
    left: `${random(index) * 100}%`,
    top: `${random(index + 100) * 100}%`,
    animationDelay: `${random(index + 200) * 3}s`,
    animationDuration: `${1.5 + random(index + 300) * 2}s`,
  }
}

// Generate random particle positions
const getParticleStyle = (index: number) => {
  const random = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
  }

  return {
    left: `${random(index * 7) * 100}%`,
    top: `${random(index * 13) * 100}%`,
    animationDelay: `${random(index * 17) * 5}s`,
    animationDuration: `${3 + random(index * 23) * 4}s`,
    '--particle-size': `${2 + random(index * 31) * 4}px`,
  }
}
</script>

<style scoped>
/* Stars */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--rp-text);
  border-radius: 50%;
  opacity: 0;
  animation: twinkle ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Particles */
.particle {
  position: absolute;
  width: var(--particle-size, 3px);
  height: var(--particle-size, 3px);
  background: linear-gradient(135deg, var(--rp-iris), var(--rp-love));
  border-radius: 50%;
  opacity: 0.6;
  animation: float-particle ease-in-out infinite;
}

@keyframes float-particle {
  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.8;
  }
}

/* Floating animation */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

/* Glitch effect */
.glitch-wrapper {
  position: relative;
}

.glitch {
  position: relative;
  animation: glitch-skew 4s infinite linear alternate-reverse;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  color: var(--rp-iris);
  animation: glitch-effect 3s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translateX(-2px);
}

.glitch::after {
  color: var(--rp-foam);
  animation: glitch-effect 2s infinite linear alternate-reverse;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translateX(2px);
}

@keyframes glitch-effect {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(3px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(0deg);
  }
  21% {
    transform: skew(1deg);
  }
  22% {
    transform: skew(-1deg);
  }
  23% {
    transform: skew(0deg);
  }
  100% {
    transform: skew(0deg);
  }
}
</style>
