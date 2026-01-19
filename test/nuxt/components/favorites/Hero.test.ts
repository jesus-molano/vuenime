import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import Hero from '~/components/favorites/Hero.vue'

// Mock the favorites store with reactive refs
const mockFavoritesStore = {
  favoritesCount: ref(0),
  isLoading: ref(false),
  sortedByRecent: [],
}

mockNuxtImport('useFavoritesStore', () => {
  return () => mockFavoritesStore
})

mockNuxtImport('storeToRefs', () => {
  return () => ({
    favoritesCount: mockFavoritesStore.favoritesCount,
    isLoading: mockFavoritesStore.isLoading,
  })
})

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFavoritesStore.favoritesCount.value = 0
    mockFavoritesStore.isLoading.value = false
    mockFavoritesStore.sortedByRecent = []
  })

  const mountHero = () =>
    mountSuspended(Hero, {
      global: {
        stubs: {
          ClientOnly: {
            name: 'ClientOnly',
            template: '<div><slot /></div>',
          },
          NuxtImg: {
            name: 'NuxtImg',
            props: ['src', 'alt'],
            template: '<img :src="src" :alt="alt" />',
          },
        },
      },
    })

  describe('rendering', () => {
    it('should render the section element', async () => {
      const wrapper = await mountHero()

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render the title heading', async () => {
      const wrapper = await mountHero()

      expect(wrapper.find('h1').exists()).toBe(true)
    })

    it('should render the subtitle paragraph', async () => {
      const wrapper = await mountHero()

      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBeGreaterThan(0)
    })

    it('should render the decorative image', async () => {
      const wrapper = await mountHero()

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('/images/fav.webp')
    })
  })

  describe('accessibility', () => {
    it('should have decorative image with aria-hidden', async () => {
      const wrapper = await mountHero()

      const img = wrapper.find('img')
      expect(img.attributes('aria-hidden')).toBe('true')
    })

    it('should have empty alt on decorative image', async () => {
      const wrapper = await mountHero()

      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('')
    })
  })
})
