import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useCard3DTilt } from '~/composables/useCard3DTilt'

// Mock useParallax from @vueuse/core
const { mockUseParallax } = vi.hoisted(() => {
  return { mockUseParallax: vi.fn() }
})

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useParallax: mockUseParallax,
  }
})

const TestComponent = defineComponent({
  props: {
    maxRotation: { type: Number, default: 6 },
    minWidth: { type: Number, default: 640 },
    enableTouch: { type: Boolean, default: false },
    enableGyroscope: { type: Boolean, default: false },
    enableShine: { type: Boolean, default: false },
  },
  setup(props) {
    const result = useCard3DTilt({
      maxRotation: props.maxRotation,
      minWidth: props.minWidth,
      enableTouch: props.enableTouch,
      enableGyroscope: props.enableGyroscope,
      enableShine: props.enableShine,
    })
    return { ...result }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('div', { ref: 'cardRef', class: 'card' }, 'Card'),
      h('span', { id: 'is-hovering' }, this.isHovering ? 'true' : 'false'),
      h('span', { id: 'show-shine' }, this.showShine ? 'true' : 'false'),
    ])
  },
})

describe('useCard3DTilt', () => {
  // Default mock values
  const mockTilt = ref(0)
  const mockRoll = ref(0)
  const mockSource = ref('mouse')

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })

    // Reset refs
    mockTilt.value = 0
    mockRoll.value = 0
    mockSource.value = 'mouse'

    // Setup mock return
    mockUseParallax.mockReturnValue({
      tilt: mockTilt,
      roll: mockRoll,
      source: mockSource,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should return cardRef', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.cardRef).toBeDefined()
    })

    it('should initialize useParallax', async () => {
      await mountSuspended(TestComponent)
      expect(mockUseParallax).toHaveBeenCalled()
    })

    it('should have isHovering as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isHovering).toBe(false)
    })
  })

  describe('transform calculations', () => {
    it('should calculate transform based on tilt and roll', async () => {
      const wrapper = await mountSuspended(TestComponent)
      
      // Simulate hover
      wrapper.vm.handleMouseMove()
      await nextTick()

      // Simulate tilt/roll from useParallax (values are -0.5 to 0.5)
      // Based on VueUse source:
      // - tilt = Mouse X (left=-0.5, right=+0.5)
      // - roll = Inverted Mouse Y (top=+0.5, bottom=-0.5)
      // rotateX = roll * 6 * 1.2
      // rotateY = tilt * 6 * 1.2
      
      mockTilt.value = 0.5 // Mouse at right
      mockRoll.value = -0.5 // Mouse at bottom
      await nextTick()

      const transform = wrapper.vm.cardTransform.transform
      // rX = roll * 6 * 1.2 = -0.5 * 7.2 = -3.6
      // rY = tilt * 6 * 1.2 = 0.5 * 7.2 = +3.6
      expect(transform).toContain('rotateX(-3.5999999999999996deg)')
      expect(transform).toContain('rotateY(3.5999999999999996deg)')
    })

    it('should reset transform when not hovering/active', async () => {
      const wrapper = await mountSuspended(TestComponent)
      
      // Ensure not hovering
      wrapper.vm.handleMouseLeave()
      await nextTick()

      mockTilt.value = 0.5 // Even if sensors report tilt
      await nextTick()

      const transform = wrapper.vm.cardTransform.transform
      expect(transform).toContain('rotateX(0deg)')
      expect(transform).toContain('rotateY(0deg)')
    })
  })

  describe('glare and border effects', () => {
    it('should update glare position based on tilt/roll', async () => {
      const wrapper = await mountSuspended(TestComponent)
      
      // Center (0, 0) -> (50%, 50%)
      mockTilt.value = 0
      mockRoll.value = 0
      await nextTick()
      
      expect(wrapper.vm.glareStyle.background).toContain('at 50% 50%')

      // Top-left: tilt=-0.5 (mouse left), roll=+0.5 (mouse top, inverted)
      // x = (-0.5 + 0.5) * 100 = 0%
      // y = (0.5 - 0.5) * 100 = 0%
      mockTilt.value = -0.5
      mockRoll.value = 0.5
      await nextTick()
      expect(wrapper.vm.glareStyle.background).toContain('at 0% 0%')
    })
    
    it('should handle bottom-left hover correctly (sink corner + glare tracking)', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.handleMouseMove()
      await nextTick()

      // Simulate Bottom-Left Hover
      // Based on VueUse source: tilt=MouseX, roll=InvertedMouseY
      // Bottom-Left: Mouse X = left = tilt=-0.5, Mouse Y = bottom = roll=-0.5
      mockTilt.value = -0.5 // Mouse at left
      mockRoll.value = -0.5 // Mouse at bottom
      await nextTick()

      const transform = wrapper.vm.cardTransform.transform
      const glare = wrapper.vm.glareStyle.background

      // Expectation:
      // rX = roll * 6 * 1.2 = -0.5 * 7.2 = -3.6 (bottom corner tilts UP)
      expect(transform).toContain('rotateX(-3.5999999999999996deg)')

      // rY = tilt * 6 * 1.2 = -0.5 * 7.2 = -3.6 (left corner tilts UP)
      expect(transform).toContain('rotateY(-3.5999999999999996deg)')

      // Glare should be at Bottom-Left (0% X, 100% Y)
      // x = (tilt + 0.5) * 100 = (-0.5 + 0.5) * 100 = 0%
      // y = (0.5 - roll) * 100 = (0.5 - (-0.5)) * 100 = 100%
      expect(glare).toContain('at 0% 100%')
    })
  })

  describe('device orientation support', () => {
    it('should active transform when source is deviceOrientation and enabled', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true }
      })

      mockSource.value = 'deviceOrientation'
      mockTilt.value = 0.2
      mockRoll.value = 0.2
      await nextTick()

      const transform = wrapper.vm.cardTransform.transform
      expect(transform).not.toContain('rotateX(0deg)')
    })

    it('should NOT active transform when source is deviceOrientation but disabled', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: false }
      })

      // Not hovering
      wrapper.vm.handleMouseLeave()
      mockSource.value = 'deviceOrientation'
      mockTilt.value = 0.2
      await nextTick()

      const transform = wrapper.vm.cardTransform.transform
      expect(transform).toContain('rotateX(0deg)')
    })
  })

  describe('shine effect', () => {
    it('should trigger shine sequence', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableShine: true }
      })

      wrapper.vm.triggerShine()
      expect(wrapper.vm.showShine).toBe(false)

      vi.advanceTimersByTime(50)
      await nextTick()
      expect(wrapper.vm.showShine).toBe(true)

      vi.advanceTimersByTime(900)
      await nextTick()
      expect(wrapper.vm.showShine).toBe(false)
    })
  })
})
