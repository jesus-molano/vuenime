import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useCard3DTilt } from '~/composables/useCard3DTilt'

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
      h('span', { id: 'is-touching' }, this.isTouching ? 'true' : 'false'),
      h('span', { id: 'show-shine' }, this.showShine ? 'true' : 'false'),
    ])
  },
})

describe('useCard3DTilt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
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

    it('should have isHovering as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isHovering).toBe(false)
    })

    it('should have isTouching as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isTouching).toBe(false)
    })

    it('should have showShine as false initially', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.showShine).toBe(false)
    })
  })

  describe('computed styles', () => {
    it('should return cardTransform object', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const transform = wrapper.vm.cardTransform
      expect(transform).toHaveProperty('transform')
      expect(typeof transform.transform).toBe('string')
    })

    it('should return default transform when not hovering', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const transform = wrapper.vm.cardTransform
      expect(transform.transform).toBe('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    })

    it('should return glareStyle object', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const glare = wrapper.vm.glareStyle
      expect(glare).toHaveProperty('background')
      expect(glare.background).toContain('radial-gradient')
    })

    it('should return borderMaskStyle object', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const mask = wrapper.vm.borderMaskStyle
      expect(mask).toHaveProperty('maskImage')
      expect(mask).toHaveProperty('WebkitMaskImage')
    })

    it('should have default glare position at 50% 50%', async () => {
      const wrapper = await mountSuspended(TestComponent)
      const glare = wrapper.vm.glareStyle
      expect(glare.background).toContain('50%')
    })
  })

  describe('mouse handlers', () => {
    it('should have handleMouseMove function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.handleMouseMove).toBe('function')
    })

    it('should have handleMouseLeave function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.handleMouseLeave).toBe('function')
    })

    it('should reset tilt on handleMouseLeave', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.handleMouseLeave()
      await nextTick()
      expect(wrapper.vm.isHovering).toBe(false)
    })

    it('should ignore mouse move if window width is below minWidth', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true })
      const wrapper = await mountSuspended(TestComponent)

      // Set cardRef to a mock element
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 150 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      expect(wrapper.vm.isHovering).toBe(false)
    })

    it('should update hover state when mouse moves over card with sufficient width', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
      const wrapper = await mountSuspended(TestComponent)

      // Set cardRef to a mock element
      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 150 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      expect(wrapper.vm.isHovering).toBe(true)
    })

    it('should update cardTransform when hovering', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
      const wrapper = await mountSuspended(TestComponent)

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 150 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      expect(wrapper.vm.cardTransform.transform).toContain('scale3d(1.02, 1.02, 1.02)')
    })

    it('should not throw if cardRef is null', async () => {
      const wrapper = await mountSuspended(TestComponent)
      wrapper.vm.cardRef = null

      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 150 })
      expect(() => wrapper.vm.handleMouseMove(event)).not.toThrow()
    })
  })

  describe('touch handlers', () => {
    it('should have handleTouchStart function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.handleTouchStart).toBe('function')
    })

    it('should have handleTouchMove function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.handleTouchMove).toBe('function')
    })

    it('should have handleTouchEnd function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.handleTouchEnd).toBe('function')
    })

    it('should ignore touch start when enableTouch is false', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: false },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 150 }],
        preventDefault: vi.fn(),
      } as unknown as TouchEvent

      wrapper.vm.handleTouchStart(touchEvent)
      await nextTick()
      expect(wrapper.vm.isTouching).toBe(false)
    })

    it('should set isTouching true when touch starts with enableTouch', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: true },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 150 }],
      } as unknown as TouchEvent

      wrapper.vm.handleTouchStart(touchEvent)
      await nextTick()
      expect(wrapper.vm.isTouching).toBe(true)
    })

    it('should ignore multi-touch (more than 1 finger)', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: true },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      const touchEvent = {
        touches: [
          { clientX: 100, clientY: 150 },
          { clientX: 120, clientY: 170 },
        ],
      } as unknown as TouchEvent

      wrapper.vm.handleTouchStart(touchEvent)
      await nextTick()
      expect(wrapper.vm.isTouching).toBe(false)
    })

    it('should reset state on touch end', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: true },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      // Start touch
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 150 }],
      } as unknown as TouchEvent
      wrapper.vm.handleTouchStart(touchStartEvent)
      await nextTick()
      expect(wrapper.vm.isTouching).toBe(true)

      // End touch
      wrapper.vm.handleTouchEnd()
      await nextTick()
      expect(wrapper.vm.isTouching).toBe(false)
      expect(wrapper.vm.isHovering).toBe(false)
    })

    it('should update tilt on touch move', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: true },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      // Start touch
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 150 }],
      } as unknown as TouchEvent
      wrapper.vm.handleTouchStart(touchStartEvent)
      await nextTick()

      // Move touch
      const touchMoveEvent = {
        touches: [{ clientX: 150, clientY: 200 }],
      } as unknown as TouchEvent
      wrapper.vm.handleTouchMove(touchMoveEvent)
      await nextTick()

      expect(wrapper.vm.isHovering).toBe(true)
    })

    it('should ignore touch move when not touching', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableTouch: true },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 300,
      })
      wrapper.vm.cardRef = mockElement

      // Don't start touch, just try to move
      const touchMoveEvent = {
        touches: [{ clientX: 150, clientY: 200 }],
      } as unknown as TouchEvent
      wrapper.vm.handleTouchMove(touchMoveEvent)
      await nextTick()

      expect(wrapper.vm.isHovering).toBe(false)
    })
  })

  describe('gyroscope', () => {
    it('should have enableGyroscopeListener function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.enableGyroscopeListener).toBe('function')
    })

    it('should have disableGyroscopeListener function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.disableGyroscopeListener).toBe('function')
    })

    it('should return false when gyroscope is not enabled', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: false },
      })

      const result = await wrapper.vm.enableGyroscopeListener()
      expect(result).toBe(false)
    })

    it('should add event listener for devices without requestPermission', async () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      await wrapper.vm.enableGyroscopeListener()

      expect(addEventListenerSpy).toHaveBeenCalledWith('deviceorientation', expect.any(Function))
    })

    it('should remove event listener when disabled', async () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      await wrapper.vm.enableGyroscopeListener()
      wrapper.vm.disableGyroscopeListener()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('deviceorientation', expect.any(Function))
    })

    it('should request permission on iOS when requestPermission is available', async () => {
      const mockRequestPermission = vi.fn().mockResolvedValue('granted')
      const DeviceOrientationEventMock = function () {} as unknown as typeof DeviceOrientationEvent
      ;(DeviceOrientationEventMock as unknown as { requestPermission: typeof mockRequestPermission }).requestPermission =
        mockRequestPermission

      vi.stubGlobal('DeviceOrientationEvent', DeviceOrientationEventMock)

      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      await wrapper.vm.enableGyroscopeListener()

      expect(mockRequestPermission).toHaveBeenCalled()
    })

    it('should return false when permission is denied', async () => {
      const mockRequestPermission = vi.fn().mockResolvedValue('denied')
      const DeviceOrientationEventMock = function () {} as unknown as typeof DeviceOrientationEvent
      ;(DeviceOrientationEventMock as unknown as { requestPermission: typeof mockRequestPermission }).requestPermission =
        mockRequestPermission

      vi.stubGlobal('DeviceOrientationEvent', DeviceOrientationEventMock)

      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      const result = await wrapper.vm.enableGyroscopeListener()
      expect(result).toBe(false)
    })

    it('should return false when requestPermission throws', async () => {
      const mockRequestPermission = vi.fn().mockRejectedValue(new Error('Permission error'))
      const DeviceOrientationEventMock = function () {} as unknown as typeof DeviceOrientationEvent
      ;(DeviceOrientationEventMock as unknown as { requestPermission: typeof mockRequestPermission }).requestPermission =
        mockRequestPermission

      vi.stubGlobal('DeviceOrientationEvent', DeviceOrientationEventMock)

      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      const result = await wrapper.vm.enableGyroscopeListener()
      expect(result).toBe(false)
    })
  })

  describe('shine effect', () => {
    it('should have triggerShine function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.triggerShine).toBe('function')
    })

    it('should not change showShine when enableShine is false', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableShine: false },
      })

      wrapper.vm.triggerShine()
      await nextTick()

      expect(wrapper.vm.showShine).toBe(false)
    })

    it('should trigger shine sequence when enableShine is true', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableShine: true },
      })

      wrapper.vm.triggerShine()

      // Initially set to false
      expect(wrapper.vm.showShine).toBe(false)

      // After 50ms, should be true
      vi.advanceTimersByTime(50)
      await nextTick()
      expect(wrapper.vm.showShine).toBe(true)

      // After 900ms more, should be false again
      vi.advanceTimersByTime(900)
      await nextTick()
      expect(wrapper.vm.showShine).toBe(false)
    })
  })

  describe('utility functions', () => {
    it('should have resetTilt function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.resetTilt).toBe('function')
      wrapper.vm.resetTilt()
      expect(wrapper.vm.isHovering).toBe(false)
    })

    it('should have cleanup function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.cleanup).toBe('function')
      expect(() => wrapper.vm.cleanup()).not.toThrow()
    })

    it('should reset all state on cleanup', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { enableGyroscope: true },
      })

      // Enable gyroscope first
      await wrapper.vm.enableGyroscopeListener()

      // Cleanup
      wrapper.vm.cleanup()

      expect(wrapper.vm.isHovering).toBe(false)
    })
  })

  describe('options', () => {
    it('should use default maxRotation of 6', async () => {
      const wrapper = await mountSuspended(TestComponent)

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      })
      wrapper.vm.cardRef = mockElement

      // Mouse at edge of card (100, 50) with card center at (50, 50)
      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 50 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      // rotateY should be maxRotation (6) since mouse is at right edge
      expect(wrapper.vm.cardTransform.transform).toContain('rotateY(6deg)')
    })

    it('should use custom maxRotation', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { maxRotation: 10 },
      })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      })
      wrapper.vm.cardRef = mockElement

      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 50 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      expect(wrapper.vm.cardTransform.transform).toContain('rotateY(10deg)')
    })

    it('should respect minWidth option', async () => {
      const wrapper = await mountSuspended(TestComponent, {
        props: { minWidth: 800 },
      })

      Object.defineProperty(window, 'innerWidth', { value: 700, configurable: true })

      const mockElement = document.createElement('div')
      mockElement.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      })
      wrapper.vm.cardRef = mockElement

      const event = new MouseEvent('mousemove', { clientX: 50, clientY: 50 })
      wrapper.vm.handleMouseMove(event)

      await nextTick()
      expect(wrapper.vm.isHovering).toBe(false)
    })
  })
})
