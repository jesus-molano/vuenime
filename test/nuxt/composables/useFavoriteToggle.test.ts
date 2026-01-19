import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoriteToggle } from '~/composables/useFavoriteToggle'
import { createMockFavoritesStore } from '../../mocks/stores'
import { createMockAnimation, createControllableAnimation } from '../../mocks/browser-apis'
import { createMockAnime } from '../../fixtures/anime'

// Mock the favorites store
const mockFavoritesStore = createMockFavoritesStore()

vi.mock('~/stores/favorites', () => ({
  useFavoritesStore: () => mockFavoritesStore,
}))

// Test component that uses the composable (without cardRef)
const TestComponentBasic = defineComponent({
  props: {
    animeId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const anime = computed(() => createMockAnime({ mal_id: props.animeId }))

    const { isFavorite, isAnimating, isRemoving, toggleFavorite } = useFavoriteToggle(anime)

    return { anime, isFavorite, isAnimating, isRemoving, toggleFavorite }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'is-favorite' }, this.isFavorite ? 'true' : 'false'),
      h('span', { id: 'is-animating' }, this.isAnimating ? 'true' : 'false'),
      h('span', { id: 'is-removing' }, this.isRemoving ? 'true' : 'false'),
      h('button', { id: 'toggle-btn', onClick: () => this.toggleFavorite() }, 'Toggle'),
    ])
  },
})

// Test component with cardRef
const TestComponentWithCard = defineComponent({
  props: {
    animeId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const anime = computed(() => createMockAnime({ mal_id: props.animeId }))

    const cardRef = ref<HTMLElement | null>(null)
    const { isFavorite, isAnimating, isRemoving, toggleFavorite } = useFavoriteToggle(anime, cardRef)

    return { anime, cardRef, isFavorite, isAnimating, isRemoving, toggleFavorite }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('div', { ref: 'cardRef', class: 'card' }, 'Card'),
      h('span', { id: 'is-favorite' }, this.isFavorite ? 'true' : 'false'),
      h('span', { id: 'is-animating' }, this.isAnimating ? 'true' : 'false'),
      h('span', { id: 'is-removing' }, this.isRemoving ? 'true' : 'false'),
      h('button', { id: 'toggle-btn', onClick: () => this.toggleFavorite() }, 'Toggle'),
    ])
  },
})

describe('useFavoriteToggle (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    setActivePinia(createPinia())

    // Reset mock store
    mockFavoritesStore.favorites.value = []
    mockFavoritesStore.isFavorite.mockClear()
    mockFavoritesStore.toggleFavorite.mockClear()
    mockFavoritesStore.removeFavorite.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('isFavorite after mount', () => {
    it('should return true when anime is in favorites after mount', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(true)

      const wrapper = await mountSuspended(TestComponentBasic, {
        props: { animeId: 1 },
      })

      // After mount, isFavorite should work correctly
      expect(wrapper.find('#is-favorite').text()).toBe('true')
    })

    it('should return false when anime is not in favorites after mount', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(false)

      const wrapper = await mountSuspended(TestComponentBasic, {
        props: { animeId: 1 },
      })

      expect(wrapper.find('#is-favorite').text()).toBe('false')
    })
  })

  describe('toggleFavorite (remove) with cardRef', () => {
    it('should set isRemoving to true when removing with card ref', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(true)

      // Create a pending animation promise we can control
      const controllableAnimation = createControllableAnimation()

      const wrapper = await mountSuspended(TestComponentWithCard, {
        props: { animeId: 1 },
      })

      // Get the card element and mock its animate method
      const cardEl = wrapper.find('.card').element as HTMLElement
      cardEl.animate = vi.fn().mockReturnValue(controllableAnimation)

      // Start toggle (don't await)
      const togglePromise = wrapper.find('#toggle-btn').trigger('click')
      await nextTick()

      // isRemoving should be true during animation
      expect(wrapper.find('#is-removing').text()).toBe('true')

      // Resolve animation and wait
      controllableAnimation.resolve()
      await togglePromise
      await nextTick()
    })

    it('should animate card before removing', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(true)

      const wrapper = await mountSuspended(TestComponentWithCard, {
        props: { animeId: 1 },
      })

      // Get the card element and mock its animate method
      const cardEl = wrapper.find('.card').element as HTMLElement
      const mockAnimation = createMockAnimation()
      const animateSpy = vi.fn().mockReturnValue(mockAnimation)
      cardEl.animate = animateSpy

      // Click toggle
      await wrapper.find('#toggle-btn').trigger('click')

      // Should call animate on the card element
      expect(animateSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ opacity: 1 }),
          expect.objectContaining({ opacity: 0 }),
        ]),
        expect.objectContaining({
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        })
      )
    })

    it('should call removeFavorite after animation', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(true)

      const wrapper = await mountSuspended(TestComponentWithCard, {
        props: { animeId: 1 },
      })

      // Get the card element and mock its animate method
      const cardEl = wrapper.find('.card').element as HTMLElement
      const mockAnimation = createMockAnimation()
      cardEl.animate = vi.fn().mockReturnValue(mockAnimation)

      // Click toggle
      await wrapper.find('#toggle-btn').trigger('click')

      // Wait for animation
      await mockAnimation.finished
      await nextTick()

      expect(mockFavoritesStore.removeFavorite).toHaveBeenCalledWith(1)
    })

    it('should set isRemoving to false after removal', async () => {
      mockFavoritesStore.isFavorite.mockReturnValue(true)

      const wrapper = await mountSuspended(TestComponentWithCard, {
        props: { animeId: 1 },
      })

      // Get the card element and mock its animate method
      const cardEl = wrapper.find('.card').element as HTMLElement
      const mockAnimation = createMockAnimation()
      cardEl.animate = vi.fn().mockReturnValue(mockAnimation)

      // Click toggle
      await wrapper.find('#toggle-btn').trigger('click')

      // Wait for animation
      await mockAnimation.finished
      await nextTick()

      expect(wrapper.find('#is-removing').text()).toBe('false')
    })
  })
})
