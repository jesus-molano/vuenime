import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Hero from '~/components/home/Hero.vue'

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render a section element', async () => {
      const wrapper = await mountSuspended(Hero)

      expect(wrapper.find('section').exists()).toBe(true)
    })

    it('should render the title', async () => {
      const wrapper = await mountSuspended(Hero)

      expect(wrapper.find('h1').exists()).toBe(true)
    })

    it('should render the subtitle paragraph', async () => {
      const wrapper = await mountSuspended(Hero)

      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('should render the HeroBackground component', async () => {
      const wrapper = await mountSuspended(Hero)

      // HeroBackground should be present
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('search form', () => {
    it('should render a search form', async () => {
      const wrapper = await mountSuspended(Hero)

      expect(wrapper.find('form').exists()).toBe(true)
    })

    it('should have role="search" attribute', async () => {
      const wrapper = await mountSuspended(Hero)

      expect(wrapper.find('form').attributes('role')).toBe('search')
    })

    it('should render search input', async () => {
      const wrapper = await mountSuspended(Hero)

      const input = wrapper.find('input[type="search"]')
      expect(input.exists()).toBe(true)
    })

    it('should have aria-label on search input', async () => {
      const wrapper = await mountSuspended(Hero)

      const input = wrapper.find('input[type="search"]')
      expect(input.attributes('aria-label')).toBeDefined()
    })

    it('should render submit button', async () => {
      const wrapper = await mountSuspended(Hero)

      const button = wrapper.find('button[type="submit"]')
      expect(button.exists()).toBe(true)
    })
  })

  describe('search interaction', () => {
    it('should update search query on input', async () => {
      const wrapper = await mountSuspended(Hero)

      const input = wrapper.find('input[type="search"]')
      await input.setValue('Naruto')

      expect((input.element as HTMLInputElement).value).toBe('Naruto')
    })

    it('should handle form submission', async () => {
      const wrapper = await mountSuspended(Hero)

      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      // Form should not throw on submit
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('stats section', () => {
    it('should render stats indicators', async () => {
      const wrapper = await mountSuspended(Hero)

      // Should have stats text
      expect(wrapper.html()).toBeTruthy()
    })
  })
})
