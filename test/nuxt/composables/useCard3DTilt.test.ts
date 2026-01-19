import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { useCard3DTilt } from '~/composables/useCard3DTilt'

const TestComponent = defineComponent({
  props: {
    maxRotation: { type: Number, default: 6 },
    minWidth: { type: Number, default: 640 },
    enableTouch: { type: Boolean, default: false },
    enableShine: { type: Boolean, default: false },
  },
  setup(props) {
    const result = useCard3DTilt({
      maxRotation: props.maxRotation,
      minWidth: props.minWidth,
      enableTouch: props.enableTouch,
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

describe('useCard3DTilt (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

    it('should have triggerShine function', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(typeof wrapper.vm.triggerShine).toBe('function')
    })
  })
})
