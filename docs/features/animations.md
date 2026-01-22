# Animations

VueNime incluye efectos visuales sutiles que mejoran la experiencia sin sacrificar accesibilidad ni performance. Este documento cubre los dos sistemas principales: el efecto 3D en las cards y las animaciones de scroll reveal.

## 3D Card Tilt

Las cards de anime tienen un efecto 3D que responde al movimiento del cursor (o al giroscopio en móviles).

### Demo Visual

```
    Normal state          Hover state
    ┌──────────┐         ┌──────────┐ ←─ rotated
    │          │         │\         │
    │  CARD    │   →→    │ \  CARD  │
    │          │         │  \       │
    └──────────┘         └──────────┘
                              ↑
                         glare effect
```

### Composable: `useCard3DTilt`

El composable usa **VueUse `useParallax`** para tracking robusto de mouse y giroscopio.

`app/composables/useCard3DTilt.ts`:

```typescript
import { useParallax } from '@vueuse/core'

export function useCard3DTilt(
  options: {
    maxRotation?: number // Max degrees of tilt (default: 6)
    minWidth?: number // Disable below this viewport width (default: 640px)
    enableTouch?: boolean // Enable touch/drag tilt
    enableGyroscope?: boolean // Enable gyroscope on mobile
    enableShine?: boolean // Enable shine effect
  } = {}
) {
  const { maxRotation = 6, minWidth = 640, enableGyroscope = false, enableShine = false } = options

  const cardRef = ref<HTMLElement | null>(null)
  const isHovering = ref(false)
  const showShine = ref(false)

  // VueUse useParallax handles mouse AND device orientation automatically
  const { tilt, roll, source } = useParallax(cardRef)

  // 3D transform style
  const cardTransform = computed(() => {
    const isMobile = source.value === 'deviceOrientation'
    const shouldAnimate = isHovering.value || (enableGyroscope && isMobile)

    if (!shouldAnimate) {
      return {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease-out', // Smooth reset
      }
    }

    // Sensitivity settings - higher for mobile
    const MOUSE_SENSITIVITY = 1.2
    const GYRO_SENSITIVITY = 2.5
    const currentSensitivity = isMobile ? GYRO_SENSITIVITY : MOUSE_SENSITIVITY

    // Map tilt/roll (-0.5 to 0.5) to rotation degrees
    // tilt = Mouse X position (left=-0.5, right=+0.5)
    // roll = Inverted Mouse Y position (top=+0.5, bottom=-0.5)
    const rX = roll.value * maxRotation * currentSensitivity * (isMobile ? 1.5 : 1)
    const rY = tilt.value * maxRotation * currentSensitivity * (isMobile ? 1.5 : 1)

    return {
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`,
      // NO transition for instant response
    }
  })

  // Glare overlay follows cursor
  const glareStyle = computed(() => {
    const x = (tilt.value + 0.5) * 100
    const y = (0.5 - roll.value) * 100 // Invert roll for correct Y mapping

    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
    }
  })

  // Border mask for glow effect
  const borderMaskStyle = computed(() => {
    const x = (tilt.value + 0.5) * 100
    const y = (0.5 - roll.value) * 100

    return {
      maskImage: `radial-gradient(circle at ${x}% ${y}%, black 0%, transparent 40%)`,
      WebkitMaskImage: `radial-gradient(circle at ${x}% ${y}%, black 0%, transparent 40%)`,
    }
  })

  return {
    cardRef,
    isHovering,
    showShine,
    cardTransform,
    glareStyle,
    borderMaskStyle,
    handleMouseMove,
    handleMouseLeave,
    triggerShine,
    resetTilt,
    cleanup,
  }
}
```

### Por qué VueUse `useParallax`

| Implementación manual    | VueUse useParallax          |
| ------------------------ | --------------------------- |
| Código para mouse events | ✅ Incluido                 |
| Código para giroscopio   | ✅ Incluido                 |
| Permisos iOS             | ✅ Manejado automáticamente |
| Smoothing/interpolación  | ✅ Incluido                 |
| ~100 líneas de código    | ~10 líneas                  |

VueUse abstrae toda la complejidad de tracking de mouse y device orientation.

### Valores de `tilt` y `roll`

```
useParallax devuelve valores de -0.5 a +0.5:

         roll = +0.5 (top)
              ↑
              │
tilt = -0.5 ←─┼─→ tilt = +0.5
(left)        │        (right)
              ↓
         roll = -0.5 (bottom)
```

### Uso en Componentes

```vue
<script setup>
const { cardRef, cardTransform, glareStyle, borderMaskStyle, handleMouseMove, handleMouseLeave } = useCard3DTilt({
  maxRotation: 8,
})
</script>

<template>
  <div
    ref="cardRef"
    class="relative"
    :style="cardTransform"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Card content -->
    <img :src="anime.image" />

    <!-- Glare overlay -->
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      :style="glareStyle"
    />
  </div>
</template>
```

### Responsive: Deshabilitado en Móvil (por defecto)

El efecto de mouse se desactiva en pantallas pequeñas:

```typescript
const handleMouseMove = () => {
  if (window.innerWidth >= minWidth) {
    isHovering.value = true
  }
}
```

`minWidth` por defecto es 640px (Tailwind's `sm` breakpoint).

---

## Scroll Reveal

Elementos aparecen con animaciones suaves cuando entran al viewport.

### Composable: `useScrollReveal`

Usa **VueUse `useIntersectionObserver`** para performance:

```typescript
import { useIntersectionObserver } from '@vueuse/core'

export function useScrollReveal(
  options: {
    threshold?: number // % visible to trigger (default: 0.1 = 10%)
    rootMargin?: string // Trigger zone offset
    once?: boolean // Animate only once (default: true)
  } = {}
) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  const { stop } = useIntersectionObserver(
    elementRef,
    (entries) => {
      const isIntersecting = entries[0]?.isIntersecting
      if (isIntersecting) {
        isVisible.value = true
        if (once) stop()
      } else if (!once) {
        isVisible.value = false
      }
    },
    { threshold, rootMargin }
  )

  return { elementRef, isVisible }
}
```

### Directiva: `v-scroll-reveal`

Para uso declarativo en templates:

```typescript
// WeakMap para auto-cleanup cuando elementos son garbage collected
const stopMap = new WeakMap<HTMLElement, () => void>()

export const vScrollReveal = {
  // SSR-safe
  getSSRProps() {
    return {}
  },

  mounted(el: HTMLElement, binding: { modifiers: Record<string, boolean>; value?: number }) {
    if (typeof window === 'undefined') return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.style.opacity = '1'
      return
    }

    const delay = binding.value || 0

    // Set initial state
    el.style.opacity = '0'
    el.style.willChange = 'opacity, transform'

    // Determine transform based on modifier
    let initialTransform = 'translateY(20px)'
    if (binding.modifiers['fade-up']) initialTransform = 'translateY(30px)'
    else if (binding.modifiers['fade-down']) initialTransform = 'translateY(-30px)'
    else if (binding.modifiers['fade-left']) initialTransform = 'translateX(30px)'
    else if (binding.modifiers['fade-right']) initialTransform = 'translateX(-30px)'
    else if (binding.modifiers['scale']) initialTransform = 'scale(0.95)'

    el.style.transform = initialTransform

    const animate = () => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        if (delay > 0) el.style.transitionDelay = `${delay}ms`

        requestAnimationFrame(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0) translateX(0) scale(1)'
        })
      })
    }

    const { stop } = useIntersectionObserver(
      el,
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setTimeout(animate, 50)
          stop()
        }
      },
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    )

    stopMap.set(el, stop)
  },

  unmounted(el: HTMLElement) {
    const stop = stopMap.get(el)
    if (stop) {
      stop()
      stopMap.delete(el)
    }
  },
}
```

### Variantes de Animación

| Modifier      | Efecto                  |
| ------------- | ----------------------- |
| (ninguno)     | Fade + slide up 20px    |
| `.fade-up`    | Fade + slide up 30px    |
| `.fade-down`  | Fade + slide down 30px  |
| `.fade-left`  | Fade + slide from right |
| `.fade-right` | Fade + slide from left  |
| `.scale`      | Fade + scale from 0.95  |

### Uso

```vue
<template>
  <!-- Basic -->
  <div v-scroll-reveal>Content</div>

  <!-- With variant -->
  <div v-scroll-reveal.fade-up>Slide up</div>

  <!-- With delay (ms) -->
  <div v-scroll-reveal.fade-left="200">Delayed 200ms</div>

  <!-- Staggered list -->
  <div
    v-for="(item, i) in items"
    v-scroll-reveal.fade-up="i * 100"
  >
    {{ item }}
  </div>
</template>
```

---

## Accesibilidad

### Reduced Motion

Ambos sistemas respetan `prefers-reduced-motion`:

```typescript
// En v-scroll-reveal
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  el.style.opacity = '1'
  return // No animation
}
```

```css
/* CSS fallback en main.css */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

Usuarios con esta preferencia ven el contenido sin animaciones.

### Focus Visible

Las cards mantienen indicadores de foco claros para navegación con teclado:

```vue
<template>
  <div
    class="focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    tabindex="0"
  >
    <!-- Card content -->
  </div>
</template>
```

---

## Performance

### VueUse Intersection Observer

Usamos `useIntersectionObserver` de VueUse que internamente usa la API nativa:

```typescript
// ✓ Bueno - Off main thread, optimizado
const { stop } = useIntersectionObserver(el, callback, options)

// ✗ Malo - Scroll listener bloquea main thread
window.addEventListener('scroll', () => {
  /* ... */
})
```

### will-change

Avisamos al navegador qué propiedades van a cambiar:

```typescript
el.style.willChange = 'opacity, transform'
```

### GPU Acceleration

Usamos `transform` y `opacity` que son GPU-accelerated:

```typescript
// ✓ GPU accelerated - no layout recalculation
el.style.transform = 'translateY(20px)'
el.style.opacity = '0'

// ✗ Triggers layout - slow
el.style.top = '20px'
el.style.marginTop = '20px'
```

### Cleanup con WeakMap

La directiva usa `WeakMap` para auto-cleanup:

```typescript
const stopMap = new WeakMap<HTMLElement, () => void>()

// Cuando el elemento es garbage collected, la entrada se elimina automáticamente
// No hay memory leaks
```

---

## Configuración por Defecto

| Parámetro           | Default | Descripción                  |
| ------------------- | ------- | ---------------------------- |
| `maxRotation`       | 6°      | Máximo ángulo de rotación    |
| `minWidth`          | 640px   | Viewport mínimo para activar |
| `enableGyroscope`   | false   | Tilt con giroscopio          |
| `enableShine`       | false   | Efecto de brillo             |
| `MOUSE_SENSITIVITY` | 1.2     | Sensibilidad del mouse       |
| `GYRO_SENSITIVITY`  | 2.5     | Sensibilidad del giroscopio  |

---

## Archivos Relacionados

| Archivo                              | Propósito                             |
| ------------------------------------ | ------------------------------------- |
| `app/composables/useCard3DTilt.ts`   | Composable del efecto 3D (usa VueUse) |
| `app/composables/useScrollReveal.ts` | Composable y directiva (usa VueUse)   |
| `app/components/anime/AnimeCard.vue` | Implementación del card tilt          |
| `app/assets/css/main.css`            | CSS de reduced motion                 |
