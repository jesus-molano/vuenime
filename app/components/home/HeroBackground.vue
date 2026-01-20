<template>
  <div
    class="pointer-events-none absolute inset-0"
    aria-hidden="true"
  >
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
  </div>
</template>

<style scoped>
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  will-change: transform;
}

.blob-1 {
  width: 40%;
  height: 50%;
  top: -10%;
  left: 10%;
  background: rgba(196, 167, 231, 0.25);
  animation: move-1 25s ease-in-out infinite;
}

.blob-2 {
  width: 35%;
  height: 45%;
  top: 0%;
  right: 5%;
  background: rgba(235, 111, 146, 0.2);
  animation: move-2 30s ease-in-out infinite;
}

.blob-3 {
  width: 30%;
  height: 40%;
  top: 20%;
  left: 40%;
  background: rgba(156, 207, 216, 0.15);
  animation: move-3 22s ease-in-out infinite;
}

@keyframes move-1 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(5%, 10%);
  }
  40% {
    transform: translate(-8%, 5%);
  }
  60% {
    transform: translate(3%, -5%);
  }
  80% {
    transform: translate(-5%, 8%);
  }
}

@keyframes move-2 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-10%, 8%);
  }
  50% {
    transform: translate(5%, -5%);
  }
  75% {
    transform: translate(-3%, 12%);
  }
}

@keyframes move-3 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  15% {
    transform: translate(8%, -8%);
  }
  35% {
    transform: translate(-5%, 5%);
  }
  55% {
    transform: translate(10%, 3%);
  }
  75% {
    transform: translate(-8%, -3%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}

/* Mobile optimizations - reduce GPU load */
@media (max-width: 768px) {
  .blob {
    filter: blur(40px);
    will-change: auto;
    opacity: 0.35;
  }

  .blob-1 {
    animation-duration: 40s;
  }

  .blob-2 {
    animation-duration: 50s;
  }

  .blob-3 {
    display: none;
  }
}

/* Small devices - disable animations entirely */
@media (max-width: 480px) {
  .blob {
    animation: none;
    filter: blur(30px);
    opacity: 0.25;
  }
}
</style>
