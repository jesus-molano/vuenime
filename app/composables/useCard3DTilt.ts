import { useParallax } from '@vueuse/core'

/**
 * Composable for 3D tilt effect on cards
 * Uses VueUse useParallax for robust mouse and gyroscope tracking
 */
export function useCard3DTilt(
  options: {
    maxRotation?: number
    minWidth?: number
    enableTouch?: boolean
    enableGyroscope?: boolean
    enableShine?: boolean
  } = {}
) {
  const { maxRotation = 6, minWidth = 640, enableGyroscope = false, enableShine = false } = options

  const cardRef = ref<HTMLElement | null>(null)
  const isHovering = ref(false)
  const showShine = ref(false)

  // Use VueUse parallax for robust tilt tracking
  // Automatically handles mouse on desktop and device orientation on mobile
  const { tilt, roll, source } = useParallax(cardRef)

  // Enhance sensitivity for more visual effect
  const TILT_SENSITIVITY = 1.2

  // 3D transform style
  const cardTransform = computed(() => {
    // Only apply if:
    // 1. Hovering (mouse) OR
    // 2. Gyroscope enabled (mobile) OR
    // 3. Touch enabled (mobile touch drag - though useParallax handles this via orientation usually)

    const isMobile = source.value === 'deviceOrientation'
    const shouldAnimate = isHovering.value || (enableGyroscope && isMobile)

    if (!shouldAnimate) {
      return { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' }
    }

    // Map tilt/roll (-0.5 to 0.5) to rotation degrees
    // tilt -> rotateX (inverted), roll -> rotateY
    const rX = tilt.value * maxRotation * TILT_SENSITIVITY // tilt is pitch (x-axis)
    const rY = roll.value * maxRotation * TILT_SENSITIVITY // roll is roll (y-axis)

    return {
      transform: `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`,
    }
  })

  // Glare overlay style
  const glareStyle = computed(() => {
    // Convert -0.5...0.5 to 0...100%
    const x = (roll.value + 0.5) * 100
    const y = (tilt.value + 0.5) * 100
    
    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
    }
  })

  // Mask that follows cursor (for border glow effect)
  const borderMaskStyle = computed(() => {
    const x = (roll.value + 0.5) * 100
    const y = (tilt.value + 0.5) * 100

    return {
      maskImage: `radial-gradient(circle at ${x}% ${y}%, black 0%, transparent 40%)`,
      WebkitMaskImage: `radial-gradient(circle at ${x}% ${y}%, black 0%, transparent 40%)`,
    }
  })

  // Track active timeouts for shine effect cleanup
  const activeTimeouts = new Set<ReturnType<typeof setTimeout>>()

  // Shine effect trigger
  const triggerShine = () => {
    if (!enableShine) return
    showShine.value = false
    const outerTimeout = setTimeout(() => {
      activeTimeouts.delete(outerTimeout)
      showShine.value = true
      const innerTimeout = setTimeout(() => {
        activeTimeouts.delete(innerTimeout)
        showShine.value = false
      }, 900)
      activeTimeouts.add(innerTimeout)
    }, 50)
    activeTimeouts.add(outerTimeout)
  }

  // Handle hover state manually since useParallax works on coordinates
  const handleMouseMove = () => {
    if (window.innerWidth >= minWidth) {
      isHovering.value = true
    }
  }

  const handleMouseLeave = () => {
    isHovering.value = false
  }

  // Cleanup layer
  const cleanup = () => {
    activeTimeouts.forEach((timeout) => clearTimeout(timeout))
    activeTimeouts.clear()
    isHovering.value = false
    showShine.value = false
  }


  onScopeDispose(() => {
    cleanup()
  })

  const resetTilt = () => {
    isHovering.value = false
  }

  return {
    cardRef,
    isHovering,
    isTouching: computed(() => (source.value as string) === 'touch'),
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
