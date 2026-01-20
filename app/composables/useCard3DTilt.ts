/**
 * Composable for 3D tilt effect on cards
 * Provides rotation, glare effect, cursor-following mask, touch support, and gyroscope
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
  const { maxRotation = 6, minWidth = 640, enableTouch = false, enableGyroscope = false, enableShine = false } = options

  const cardRef = ref<HTMLElement | null>(null)
  const rotateX = ref(0)
  const rotateY = ref(0)
  const glareX = ref(50)
  const glareY = ref(50)
  const isHovering = ref(false)
  const isTouching = ref(false)
  const showShine = ref(false)
  const useGyroscopeActive = ref(false)

  // Track active timeouts for cleanup
  const activeTimeouts = new Set<ReturnType<typeof setTimeout>>()

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

  // Mask that follows cursor (for border glow effect)
  const borderMaskStyle = computed(() => ({
    maskImage: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, black 0%, transparent 40%)`,
    WebkitMaskImage: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, black 0%, transparent 40%)`,
  }))

  // Shared function to update tilt based on position
  const updateTilt = (x: number, y: number, rect: DOMRect) => {
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    rotateY.value = ((x - centerX) / centerX) * maxRotation
    rotateX.value = -((y - centerY) / centerY) * maxRotation

    glareX.value = (x / rect.width) * 100
    glareY.value = (y / rect.height) * 100

    isHovering.value = true
  }

  const resetTilt = () => {
    isHovering.value = false
    rotateX.value = 0
    rotateY.value = 0
  }

  // Mouse handlers
  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.value || window.innerWidth < minWidth) return

    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    updateTilt(x, y, rect)
  }

  const handleMouseLeave = () => {
    resetTilt()
  }

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!enableTouch || !cardRef.value || e.touches.length !== 1 || !touch) return
    isTouching.value = true
    const rect = cardRef.value.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    updateTilt(x, y, rect)
  }

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!enableTouch || !cardRef.value || !isTouching.value || e.touches.length !== 1 || !touch) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    updateTilt(x, y, rect)
  }

  const handleTouchEnd = () => {
    isTouching.value = false
    resetTilt()
  }

  // Gyroscope handler with smoothing for better UX
  const lastBeta = ref(0)
  const lastGamma = ref(0)
  const smoothingFactor = 0.15 // Lower = smoother but less responsive

  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (isTouching.value) return

    // beta: front-back tilt (-180 to 180), gamma: left-right tilt (-90 to 90)
    const beta = e.beta ?? 0
    const gamma = e.gamma ?? 0

    // Ignore if values are null/undefined (some devices send empty events)
    if (e.beta === null && e.gamma === null) return

    // Apply smoothing for more natural movement
    lastBeta.value = lastBeta.value + (beta - lastBeta.value) * smoothingFactor
    lastGamma.value = lastGamma.value + (gamma - lastGamma.value) * smoothingFactor

    // Normalize and limit rotation with reduced sensitivity
    rotateX.value = Math.max(-maxRotation, Math.min(maxRotation, lastBeta.value * 0.2))
    rotateY.value = Math.max(-maxRotation, Math.min(maxRotation, lastGamma.value * 0.25))

    // Update glare based on orientation
    glareX.value = Math.max(0, Math.min(100, 50 + lastGamma.value * 0.8))
    glareY.value = Math.max(0, Math.min(100, 50 + lastBeta.value * 0.4))

    isHovering.value = true
  }

  const enableGyroscopeListener = async () => {
    if (!enableGyroscope) return false

    // Check if DeviceOrientationEvent is available
    if (typeof DeviceOrientationEvent === 'undefined') {
      if (import.meta.dev) console.warn('[useCard3DTilt] DeviceOrientationEvent not available')
      return false
    }

    // iOS 13+ requires permission
    const DeviceOrientationEventTyped = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEventTyped.requestPermission()
        if (permission === 'granted') {
          useGyroscopeActive.value = true
          window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })
          if (import.meta.dev) console.log('[useCard3DTilt] Gyroscope enabled (iOS permission granted)')
          return true
        } else {
          if (import.meta.dev) console.warn('[useCard3DTilt] Gyroscope permission denied')
          return false
        }
      } catch (error) {
        if (import.meta.dev) console.warn('[useCard3DTilt] Failed to request gyroscope permission:', error)
        return false
      }
    } else {
      // Android and older iOS - no permission needed, but check if events are actually firing
      useGyroscopeActive.value = true
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })

      // Fallback: disable after timeout if no events received
      const timeout = setTimeout(() => {
        activeTimeouts.delete(timeout)
        if (lastBeta.value === 0 && lastGamma.value === 0) {
          if (import.meta.dev) console.warn('[useCard3DTilt] No gyroscope events received, disabling')
          disableGyroscopeListener()
        }
      }, 1000)
      activeTimeouts.add(timeout)

      if (import.meta.dev) console.log('[useCard3DTilt] Gyroscope listener enabled (no permission required)')
      return true
    }
  }

  const disableGyroscopeListener = () => {
    if (useGyroscopeActive.value) {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
      useGyroscopeActive.value = false
    }
  }

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

  // Cleanup
  const cleanup = () => {
    // Clear all pending timeouts
    activeTimeouts.forEach((timeout) => clearTimeout(timeout))
    activeTimeouts.clear()
    disableGyroscopeListener()
    resetTilt()
  }

  onScopeDispose(() => {
    cleanup()
  })

  return {
    cardRef,
    isHovering,
    isTouching,
    showShine,
    cardTransform,
    glareStyle,
    borderMaskStyle,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    enableGyroscopeListener,
    disableGyroscopeListener,
    triggerShine,
    resetTilt,
    cleanup,
  }
}
