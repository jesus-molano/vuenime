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

  // Gyroscope handler
  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (isTouching.value) return

    // beta: front-back tilt (-180 to 180), gamma: left-right tilt (-90 to 90)
    const beta = e.beta ?? 0
    const gamma = e.gamma ?? 0

    // Normalize and limit rotation
    rotateX.value = Math.max(-15, Math.min(15, beta * 0.3))
    rotateY.value = Math.max(-15, Math.min(15, gamma * 0.4))

    // Update glare based on orientation
    glareX.value = 50 + gamma
    glareY.value = 50 + beta * 0.5

    isHovering.value = true
  }

  const enableGyroscopeListener = async () => {
    if (!enableGyroscope || typeof DeviceOrientationEvent === 'undefined') return false

    // iOS 13+ requires permission
    const DeviceOrientationEventTyped = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEventTyped.requestPermission()
        if (permission === 'granted') {
          useGyroscopeActive.value = true
          window.addEventListener('deviceorientation', handleDeviceOrientation)
          return true
        }
      } catch {
        // Permission denied, fall back to touch only
        return false
      }
    } else {
      // Android and older iOS - no permission needed
      useGyroscopeActive.value = true
      window.addEventListener('deviceorientation', handleDeviceOrientation)
      return true
    }
    return false
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
    setTimeout(() => {
      showShine.value = true
      setTimeout(() => {
        showShine.value = false
      }, 900)
    }, 50)
  }

  // Cleanup
  const cleanup = () => {
    disableGyroscopeListener()
    resetTilt()
  }

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
