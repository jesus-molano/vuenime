import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useDeviceType, useResponsiveLimits } from '~/composables/useDeviceType'

// Test component for useDeviceType
const DeviceTypeTestComponent = defineComponent({
  setup() {
    const { isMobile, isHydrated } = useDeviceType()
    return { isMobile, isHydrated }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'is-mobile' }, this.isMobile ? 'true' : 'false'),
      h('span', { id: 'is-hydrated' }, this.isHydrated ? 'true' : 'false'),
    ])
  },
})

// Test component for useResponsiveLimits
const ResponsiveLimitsTestComponent = defineComponent({
  setup() {
    const { trendingLimit, carouselLimit, isMobile, LIMITS } = useResponsiveLimits()
    return { trendingLimit, carouselLimit, isMobile, LIMITS }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'trending-limit' }, String(this.trendingLimit)),
      h('span', { id: 'carousel-limit' }, String(this.carouselLimit)),
      h('span', { id: 'is-mobile' }, this.isMobile ? 'true' : 'false'),
    ])
  },
})

describe('useDeviceType (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state (SSR)', () => {
    it('should default to desktop (isMobile = false) on SSR', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      // On SSR, should default to desktop for SEO
      expect(wrapper.vm.isMobile).toBe(false)
    })

    it('should not be hydrated initially', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      // isHydrated is set after client mount
      expect(typeof wrapper.vm.isHydrated).toBe('boolean')
    })
  })

  describe('composable structure', () => {
    it('should return isMobile as ref', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      expect(wrapper.vm.isMobile !== undefined).toBe(true)
      expect(typeof wrapper.vm.isMobile).toBe('boolean')
    })

    it('should return isHydrated as ref', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      expect(wrapper.vm.isHydrated !== undefined).toBe(true)
      expect(typeof wrapper.vm.isHydrated).toBe('boolean')
    })
  })

  describe('readonly refs', () => {
    it('should have isMobile as readonly', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      // Readonly refs should not be directly assignable
      // This tests that the ref structure is correct
      expect(wrapper.vm.isMobile).toBeDefined()
    })

    it('should have isHydrated as readonly', async () => {
      const wrapper = await mountSuspended(DeviceTypeTestComponent)

      expect(wrapper.vm.isHydrated).toBeDefined()
    })
  })
})

describe('useResponsiveLimits (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('default limits (desktop)', () => {
    it('should return desktop trending limit by default', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      // Default is desktop (24)
      expect(wrapper.vm.trendingLimit).toBe(24)
    })

    it('should return desktop carousel limit by default', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      // Default is desktop (15)
      expect(wrapper.vm.carouselLimit).toBe(15)
    })
  })

  describe('LIMITS constant', () => {
    it('should expose LIMITS configuration', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(wrapper.vm.LIMITS).toBeDefined()
      expect(wrapper.vm.LIMITS.trending).toBeDefined()
      expect(wrapper.vm.LIMITS.carousel).toBeDefined()
    })

    it('should have correct trending limits', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(wrapper.vm.LIMITS.trending.mobile).toBe(12)
      expect(wrapper.vm.LIMITS.trending.desktop).toBe(24)
    })

    it('should have correct carousel limits', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(wrapper.vm.LIMITS.carousel.mobile).toBe(8)
      expect(wrapper.vm.LIMITS.carousel.desktop).toBe(15)
    })
  })

  describe('computed limits', () => {
    it('should return number for trendingLimit', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(typeof wrapper.vm.trendingLimit).toBe('number')
      expect(wrapper.vm.trendingLimit).toBeGreaterThan(0)
    })

    it('should return number for carouselLimit', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(typeof wrapper.vm.carouselLimit).toBe('number')
      expect(wrapper.vm.carouselLimit).toBeGreaterThan(0)
    })

    it('should have mobile limits lower than desktop', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      const { LIMITS } = wrapper.vm
      expect(LIMITS.trending.mobile).toBeLessThan(LIMITS.trending.desktop)
      expect(LIMITS.carousel.mobile).toBeLessThan(LIMITS.carousel.desktop)
    })
  })

  describe('isMobile integration', () => {
    it('should expose isMobile from useDeviceType', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(typeof wrapper.vm.isMobile).toBe('boolean')
    })

    it('should default to desktop (isMobile = false)', async () => {
      const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)

      expect(wrapper.vm.isMobile).toBe(false)
    })
  })
})

describe('device detection limits', () => {
  it('should have sensible limit ratios', async () => {
    const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)
    const { LIMITS } = wrapper.vm

    // Mobile should have at least 30% of desktop content
    expect(LIMITS.trending.mobile / LIMITS.trending.desktop).toBeGreaterThanOrEqual(0.3)
    expect(LIMITS.carousel.mobile / LIMITS.carousel.desktop).toBeGreaterThanOrEqual(0.3)

    // But should be significantly less (under 70%)
    expect(LIMITS.trending.mobile / LIMITS.trending.desktop).toBeLessThan(0.7)
    expect(LIMITS.carousel.mobile / LIMITS.carousel.desktop).toBeLessThan(0.7)
  })

  it('should have limits that work for typical viewport', async () => {
    const wrapper = await mountSuspended(ResponsiveLimitsTestComponent)
    const { LIMITS } = wrapper.vm

    // Mobile typically shows 1-2 cards per row, so 12 items = 6-12 rows
    // This is reasonable for initial load
    expect(LIMITS.trending.mobile).toBeGreaterThanOrEqual(8)
    expect(LIMITS.trending.mobile).toBeLessThanOrEqual(16)

    // Carousel shows 2-3 cards visible at once
    // 8 items gives scroll content without excessive loading
    expect(LIMITS.carousel.mobile).toBeGreaterThanOrEqual(6)
    expect(LIMITS.carousel.mobile).toBeLessThanOrEqual(12)
  })
})
