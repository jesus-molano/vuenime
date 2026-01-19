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

`app/composables/useCard3DTilt.ts`:

```typescript
export function useCard3DTilt(
  options: {
    maxRotation?: number // Max degrees of tilt (default: 6)
    minWidth?: number // Disable below this viewport width (default: 640px)
    enableTouch?: boolean // Enable touch/drag tilt
    enableGyroscope?: boolean // Enable gyroscope on mobile
    enableShine?: boolean // Enable shine effect
  } = {}
) {
  const cardRef = ref<HTMLElement | null>(null)
  const rotateX = ref(0)
  const rotateY = ref(0)
  const glareX = ref(50)
  const glareY = ref(50)
  const isHovering = ref(false)

  // 3D transform style
  const cardTransform = computed(() => ({
    transform: isHovering.value
      ? `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(1.02, 1.02, 1.02)`
      : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  }))

  // Glare overlay style
  const glareStyle = computed(() => ({
    background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
  }))

  // ... handlers
}
```

### Cálculo de Rotación

El tilt se calcula basado en la posición del cursor relativa al centro de la card:

```typescript
const updateTilt = (x: number, y: number, rect: DOMRect) => {
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // rotateY: horizontal tilt (cursor left/right of center)
  rotateY.value = ((x - centerX) / centerX) * maxRotation

  // rotateX: vertical tilt (inverted - cursor up tilts forward)
  rotateX.value = -((y - centerY) / centerY) * maxRotation

  // Glare follows cursor position
  glareX.value = (x / rect.width) * 100
  glareY.value = (y / rect.height) * 100

  isHovering.value = true
}
```

### Soporte de Giroscopio (Móvil)

En dispositivos con giroscopio, el efecto responde a la orientación física:

```typescript
const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
  if (isTouching.value) return // Touch overrides gyro

  const beta = e.beta ?? 0 // front-back tilt (-180 to 180)
  const gamma = e.gamma ?? 0 // left-right tilt (-90 to 90)

  // Apply smoothing for natural movement
  lastBeta.value += (beta - lastBeta.value) * smoothingFactor
  lastGamma.value += (gamma - lastGamma.value) * smoothingFactor

  // Normalize and limit rotation
  rotateX.value = Math.max(-maxRotation, Math.min(maxRotation, lastBeta.value * 0.2))
  rotateY.value = Math.max(-maxRotation, Math.min(maxRotation, lastGamma.value * 0.25))

  // Update glare based on orientation
  glareX.value = Math.max(0, Math.min(100, 50 + lastGamma.value * 0.8))
  glareY.value = Math.max(0, Math.min(100, 50 + lastBeta.value * 0.4))

  isHovering.value = true
}
```

**Smoothing factor**: `0.15` - Más bajo = más suave pero menos responsivo. Encontramos que 0.15 es un buen balance.

### Permisos en iOS

iOS 13+ requiere permiso explícito para el giroscopio:

```typescript
const enableGyroscopeListener = async () => {
  if (typeof DeviceOrientationEvent === 'undefined') {
    return false
  }

  // iOS requires permission
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission()
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // Android - no permission needed
  window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })

  // Fallback: disable if no events after 1 second
  setTimeout(() => {
    if (lastBeta.value === 0 && lastGamma.value === 0) {
      disableGyroscopeListener()
    }
  }, 1000)

  return true
}
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
    class="relative transition-transform duration-200 ease-out"
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

El efecto de mouse se desactiva en pantallas pequeñas para evitar problemas con touch:

```typescript
const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || window.innerWidth < minWidth) return
  // ...
}
```

`minWidth` por defecto es 640px (Tailwind's `sm` breakpoint).

---

## Scroll Reveal

Elementos aparecen con animaciones suaves cuando entran al viewport.

### Composable: `useScrollReveal`

Para control programático:

```typescript
export function useScrollReveal(
  options: {
    threshold?: number // % visible to trigger (default: 0.1 = 10%)
    rootMargin?: string // Trigger zone offset
    once?: boolean // Animate only once (default: true)
  } = {}
) {
  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (!elementRef.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)

    onUnmounted(() => observer.disconnect())
  })

  return { elementRef, isVisible }
}
```

### Directiva: `v-scroll-reveal`

Para uso declarativo en templates:

```typescript
export const vScrollReveal = {
  mounted(el: HTMLElement, binding: { modifiers: Record<string, boolean>; value?: number }) {
    // Skip on server
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(animate, 50)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '50px 0px 0px 0px' }
    )

    observer.observe(el)
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
// Scroll reveal - early return if motion reduced
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  el.style.opacity = '1'
  return
}
```

```css
/* CSS fallback */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
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

### Intersection Observer

Usamos Intersection Observer en lugar de scroll listeners:

```typescript
// ✓ Bueno - Intersection Observer (off main thread)
const observer = new IntersectionObserver(callback, options)
observer.observe(element)

// ✗ Malo - Scroll listener (blocks main thread)
window.addEventListener('scroll', () => {
  // Runs on every scroll frame
})
```

### will-change

Avisamos al navegador qué propiedades van a cambiar:

```typescript
el.style.willChange = 'opacity, transform'
```

Esto permite al navegador optimizar el rendering.

### GPU Acceleration

Usamos `transform` y `opacity` que son GPU-accelerated:

```typescript
// ✓ GPU accelerated
el.style.transform = 'translateY(20px)'
el.style.opacity = '0'

// ✗ Triggers layout
el.style.top = '20px'
el.style.marginTop = '20px'
```

### Cleanup

Los observers se desconectan cuando el componente se desmonta:

```typescript
onUnmounted(() => {
  observer.disconnect()
})
```

---

## Diagrama: Ciclo de Vida de Card Tilt

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARD TILT LIFECYCLE                          │
│                                                                 │
│  Mount                                                          │
│    └── cardRef assigned                                         │
│                                                                 │
│  Mouse Enter                                                    │
│    └── isHovering = false (waiting for move)                   │
│                                                                 │
│  Mouse Move                                                     │
│    ├── Check viewport width (skip if < minWidth)               │
│    ├── Calculate cursor position relative to card              │
│    ├── Update rotateX, rotateY based on position               │
│    ├── Update glareX, glareY                                   │
│    └── isHovering = true (triggers transform)                  │
│                                                                 │
│  Mouse Leave                                                    │
│    ├── isHovering = false                                       │
│    └── rotateX = rotateY = 0 (reset with transition)           │
│                                                                 │
│  Unmount                                                        │
│    └── cleanup() - remove gyroscope listener if active         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuración por Defecto

| Parámetro         | Default | Descripción                      |
| ----------------- | ------- | -------------------------------- |
| `maxRotation`     | 6°      | Máximo ángulo de rotación        |
| `minWidth`        | 640px   | Viewport mínimo para activar     |
| `enableTouch`     | false   | Tilt con arrastre táctil         |
| `enableGyroscope` | false   | Tilt con giroscopio              |
| `smoothingFactor` | 0.15    | Suavizado del giroscopio         |
| `PREFETCH_DELAY`  | 400ms   | Delay antes de iniciar animación |

---

## Archivos Relacionados

| Archivo                              | Propósito                               |
| ------------------------------------ | --------------------------------------- |
| `app/composables/useCard3DTilt.ts`   | Composable del efecto 3D                |
| `app/composables/useScrollReveal.ts` | Composable y directiva de scroll reveal |
| `app/components/anime/AnimeCard.vue` | Implementación del card tilt            |
| `app/assets/css/main.css`            | CSS de animaciones y reduced motion     |
