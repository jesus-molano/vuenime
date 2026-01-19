import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { usePosterTransition } from '~/composables/usePosterTransition'

const TestComponent = defineComponent({
  props: {
    animeId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { posterStyle } = usePosterTransition(props.animeId)
    return { posterStyle }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('div', { id: 'poster', style: this.posterStyle }, 'Poster'),
    ])
  },
})

describe('usePosterTransition (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('posterStyle computed', () => {
    it('should return object with viewTransitionName', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: 123 },
      })
      await nextTick()

      expect(wrapper.vm.posterStyle).toHaveProperty('viewTransitionName')
    })

    it('should include animeId in viewTransitionName on desktop', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: 456 },
      })
      await nextTick()

      expect(wrapper.vm.posterStyle.viewTransitionName).toBe('poster-456')
    })

    it('should return none for viewTransitionName on mobile', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true })

      const wrapper = await mountSuspended(TestComponent, {
        props: { animeId: 789 },
      })
      await nextTick()

      expect(wrapper.vm.posterStyle.viewTransitionName).toBe('none')
    })

    it('should use breakpoint of 640px', async () => {
      // Just below breakpoint
      Object.defineProperty(window, 'innerWidth', { value: 639, configurable: true })
      const wrapperMobile = await mountSuspended(TestComponent, {
        props: { animeId: 111 },
      })
      await nextTick()
      expect(wrapperMobile.vm.posterStyle.viewTransitionName).toBe('none')

      // At breakpoint
      Object.defineProperty(window, 'innerWidth', { value: 640, configurable: true })
      const wrapperDesktop = await mountSuspended(TestComponent, {
        props: { animeId: 222 },
      })
      await nextTick()
      expect(wrapperDesktop.vm.posterStyle.viewTransitionName).toBe('poster-222')
    })
  })

  describe('different anime IDs', () => {
    it('should generate unique transition names for different IDs', async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })

      const wrapper1 = await mountSuspended(TestComponent, {
        props: { animeId: 100 },
      })
      const wrapper2 = await mountSuspended(TestComponent, {
        props: { animeId: 200 },
      })
      await nextTick()

      expect(wrapper1.vm.posterStyle.viewTransitionName).toBe('poster-100')
      expect(wrapper2.vm.posterStyle.viewTransitionName).toBe('poster-200')
    })
  })
})
