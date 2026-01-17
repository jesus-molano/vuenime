/**
 * Composable for 3D tilt effect on cards
 * Provides rotation, glare effect, and cursor-following mask
 */
export function useCard3DTilt(
  options: {
    maxRotation?: number
    minWidth?: number
  } = {}
) {
  const { maxRotation = 6, minWidth = 640 } = options

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

  // Mask that follows cursor (for border glow effect)
  const borderMaskStyle = computed(() => ({
    maskImage: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, black 0%, transparent 40%)`,
    WebkitMaskImage: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, black 0%, transparent 40%)`,
  }))

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.value || window.innerWidth < minWidth) return

    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation
    rotateY.value = ((x - centerX) / centerX) * maxRotation
    rotateX.value = -((y - centerY) / centerY) * maxRotation

    // Glare position
    glareX.value = (x / rect.width) * 100
    glareY.value = (y / rect.height) * 100

    isHovering.value = true
  }

  const handleMouseLeave = () => {
    isHovering.value = false
    rotateX.value = 0
    rotateY.value = 0
  }

  return {
    cardRef,
    isHovering,
    cardTransform,
    glareStyle,
    borderMaskStyle,
    handleMouseMove,
    handleMouseLeave,
  }
}
