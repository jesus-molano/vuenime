import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AuthButton from '~/components/auth/Button.vue'

// Mock useAuth composable
vi.mock('#imports', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#imports')>()
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: ref(null),
      isAuthenticated: ref(false),
      signOut: vi.fn(),
    })),
  }
})

describe('AuthButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('unauthenticated state', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(AuthButton)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render sign in button when not authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should have aria-label for sign in button', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })

    it('should render user icon', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should open modal on click', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const button = wrapper.find('button')
      await button.trigger('click')

      // AuthModal should be present
      const modal = wrapper.findComponent({ name: 'AuthModal' })
      expect(modal.exists()).toBe(true)
    })
  })

  describe('AuthModal integration', () => {
    it('should render AuthModal component', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const modal = wrapper.findComponent({ name: 'AuthModal' })
      expect(modal.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have screen reader text', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const srOnly = wrapper.find('.sr-only')
      expect(srOnly.exists()).toBe(true)
    })

    it('should have aria-hidden on decorative icon', async () => {
      const wrapper = await mountSuspended(AuthButton)

      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.attributes('aria-hidden')).toBe('true')
    })
  })
})
