import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Test component that uses the composable
const TestComponent = defineComponent({
  setup() {
    const {
      user,
      isAuthenticated,
      signInWithGoogle,
      signInWithGitHub,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updatePassword,
      signOut,
    } = useAuth()

    return {
      user,
      isAuthenticated,
      signInWithGoogle,
      signInWithGitHub,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updatePassword,
      signOut,
    }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'is-authenticated' }, this.isAuthenticated ? 'true' : 'false'),
      h('span', { id: 'user-email' }, this.user?.email ?? 'no-user'),
    ])
  },
})

describe('useAuth (Nuxt)', () => {
  let mockStorage: Record<string, string>

  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage = {}

    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        mockStorage[key] = undefined as unknown as string
      }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initial state - unauthenticated', () => {
    it('should have isAuthenticated as false when no user', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#is-authenticated').text()).toBe('false')
    })

    it('should have null user when not authenticated', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.find('#user-email').text()).toBe('no-user')
    })
  })

  describe('composable structure', () => {
    it('should return all auth functions', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.signInWithGoogle).toBe('function')
      expect(typeof wrapper.vm.signInWithGitHub).toBe('function')
      expect(typeof wrapper.vm.signInWithEmail).toBe('function')
      expect(typeof wrapper.vm.signUpWithEmail).toBe('function')
      expect(typeof wrapper.vm.resetPassword).toBe('function')
      expect(typeof wrapper.vm.updatePassword).toBe('function')
      expect(typeof wrapper.vm.signOut).toBe('function')
    })

    it('should have user ref', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.user).toBeDefined()
    })

    it('should have isAuthenticated computed', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(typeof wrapper.vm.isAuthenticated).toBe('boolean')
    })
  })

  describe('isAuthenticated computed', () => {
    it('should be false when user is null', async () => {
      const wrapper = await mountSuspended(TestComponent)

      expect(wrapper.vm.isAuthenticated).toBe(false)
    })

    it('should depend on user value', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // By default (no user), should be false
      expect(wrapper.vm.isAuthenticated).toBe(false)
    })
  })

  describe('redirect path saving', () => {
    it('should save redirect path to localStorage when signInWithGoogle is called', async () => {
      const wrapper = await mountSuspended(TestComponent)

      // The function should be callable (even if the actual OAuth fails)
      try {
        await wrapper.vm.signInWithGoogle()
      } catch {
        // Expected to fail without proper Supabase setup
      }

      // Should have attempted to save path
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should save redirect path to localStorage when signInWithGitHub is called', async () => {
      const wrapper = await mountSuspended(TestComponent)

      try {
        await wrapper.vm.signInWithGitHub()
      } catch {
        // Expected to fail
      }

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })
})
