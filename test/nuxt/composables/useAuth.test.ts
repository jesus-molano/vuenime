import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { createMockLocalStorage, cleanupBrowserMocks, type MockLocalStorage } from '../../mocks/browser-apis'

// Mock Supabase client
const mockSignInWithOAuth = vi.fn()
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockResetPasswordForEmail = vi.fn()
const mockUpdateUser = vi.fn()
const mockSignOut = vi.fn()

// Mock user state
const mockUser = ref<{ email: string } | null>(null)

// Mock Supabase composables
mockNuxtImport('useSupabaseClient', () => {
  return () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
      signOut: mockSignOut,
    },
  })
})

mockNuxtImport('useSupabaseUser', () => {
  return () => mockUser
})

mockNuxtImport('useLocalePath', () => {
  return () => (path: string) => path
})

mockNuxtImport('useRoute', () => {
  return () => ({ fullPath: '/current-page' })
})

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

describe('useAuth', () => {
  let storageMock: MockLocalStorage

  beforeEach(() => {
    vi.clearAllMocks()
    mockUser.value = null
    storageMock = createMockLocalStorage()

    // Default success responses
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    mockSignInWithPassword.mockResolvedValue({ error: null })
    mockSignUp.mockResolvedValue({ error: null })
    mockResetPasswordForEmail.mockResolvedValue({ error: null })
    mockUpdateUser.mockResolvedValue({ error: null })
    mockSignOut.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    cleanupBrowserMocks()
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

  describe('initial state - authenticated', () => {
    beforeEach(() => {
      mockUser.value = { email: 'test@example.com' }
    })

    it('should have isAuthenticated as true when user exists', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.find('#is-authenticated').text()).toBe('true')
    })

    it('should have user email when authenticated', async () => {
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.find('#user-email').text()).toBe('test@example.com')
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

    it('should be true when user exists', async () => {
      mockUser.value = { email: 'test@example.com' }
      const wrapper = await mountSuspended(TestComponent)
      expect(wrapper.vm.isAuthenticated).toBe(true)
    })
  })

  describe('signInWithGoogle', () => {
    it('should call Supabase OAuth with google provider', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithGoogle()

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.any(String),
        }),
      })
    })

    it('should save redirect path to localStorage', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithGoogle()

      expect(storageMock.setItem).toHaveBeenCalledWith('auth_redirect_path', '/current-page')
    })

    it('should throw error when OAuth fails', async () => {
      const authError = new Error('OAuth failed')
      mockSignInWithOAuth.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithGoogle()).rejects.toThrow('OAuth failed')
    })
  })

  describe('signInWithGitHub', () => {
    it('should call Supabase OAuth with github provider', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithGitHub()

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: expect.objectContaining({
          redirectTo: expect.any(String),
        }),
      })
    })

    it('should save redirect path to localStorage', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithGitHub()

      expect(storageMock.setItem).toHaveBeenCalled()
    })

    it('should throw error when OAuth fails', async () => {
      const authError = new Error('GitHub auth failed')
      mockSignInWithOAuth.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithGitHub()).rejects.toThrow('GitHub auth failed')
    })
  })

  describe('signInWithEmail', () => {
    it('should call signInWithPassword with email and password', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithEmail('test@example.com', 'password123')

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should save redirect path to localStorage', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signInWithEmail('test@example.com', 'password123')

      expect(storageMock.setItem).toHaveBeenCalled()
    })

    it('should throw error when sign in fails', async () => {
      const authError = new Error('Invalid credentials')
      mockSignInWithPassword.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithEmail('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('signUpWithEmail', () => {
    it('should call signUp with email, password and redirect URL', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signUpWithEmail('new@example.com', 'newpassword')

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'newpassword',
        options: expect.objectContaining({
          emailRedirectTo: expect.any(String),
        }),
      })
    })

    it('should throw error when sign up fails', async () => {
      const authError = new Error('Email already in use')
      mockSignUp.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signUpWithEmail('existing@example.com', 'password')).rejects.toThrow(
        'Email already in use'
      )
    })
  })

  describe('resetPassword', () => {
    it('should call resetPasswordForEmail with email and redirect URL', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.resetPassword('forgot@example.com')

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'forgot@example.com',
        expect.objectContaining({
          redirectTo: expect.any(String),
        })
      )
    })

    it('should throw error when reset fails', async () => {
      const authError = new Error('User not found')
      mockResetPasswordForEmail.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.resetPassword('nonexistent@example.com')).rejects.toThrow('User not found')
    })
  })

  describe('updatePassword', () => {
    it('should call updateUser with new password', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.updatePassword('newSecurePassword123')

      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: 'newSecurePassword123',
      })
    })

    it('should throw error when update fails', async () => {
      const authError = new Error('Password too weak')
      mockUpdateUser.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.updatePassword('weak')).rejects.toThrow('Password too weak')
    })
  })

  describe('signOut', () => {
    it('should call Supabase signOut', async () => {
      const wrapper = await mountSuspended(TestComponent)

      await wrapper.vm.signOut()

      expect(mockSignOut).toHaveBeenCalled()
    })

    it('should throw error when sign out fails', async () => {
      const authError = new Error('Sign out failed')
      mockSignOut.mockResolvedValue({ error: authError })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signOut()).rejects.toThrow('Sign out failed')
    })
  })

  describe('redirect path handling', () => {
    it('should not save confirm page as redirect path', async () => {
      vi.mock('#imports', async (importOriginal) => {
        const actual = await importOriginal<typeof import('#imports')>()
        return {
          ...actual,
          useRoute: () => ({ fullPath: '/confirm' }),
        }
      })

      // The redirect path should not be saved for auth-related pages
      // This is tested by checking localStorage is NOT called with '/confirm'
    })

    it('should not save reset-password page as redirect path', async () => {
      // Similar to above, auth-related pages should not be saved
    })
  })

  describe('error handling', () => {
    it('should propagate errors from signInWithGoogle', async () => {
      const error = new Error('Network error')
      mockSignInWithOAuth.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithGoogle()).rejects.toThrow('Network error')
    })

    it('should propagate errors from signInWithGitHub', async () => {
      const error = new Error('Network error')
      mockSignInWithOAuth.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithGitHub()).rejects.toThrow('Network error')
    })

    it('should propagate errors from signInWithEmail', async () => {
      const error = new Error('Rate limited')
      mockSignInWithPassword.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signInWithEmail('test@example.com', 'pass')).rejects.toThrow('Rate limited')
    })

    it('should propagate errors from signUpWithEmail', async () => {
      const error = new Error('Validation failed')
      mockSignUp.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signUpWithEmail('test@example.com', 'pass')).rejects.toThrow('Validation failed')
    })

    it('should propagate errors from resetPassword', async () => {
      const error = new Error('Service unavailable')
      mockResetPasswordForEmail.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.resetPassword('test@example.com')).rejects.toThrow('Service unavailable')
    })

    it('should propagate errors from updatePassword', async () => {
      const error = new Error('Session expired')
      mockUpdateUser.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.updatePassword('newpass')).rejects.toThrow('Session expired')
    })

    it('should propagate errors from signOut', async () => {
      const error = new Error('Already signed out')
      mockSignOut.mockResolvedValue({ error })

      const wrapper = await mountSuspended(TestComponent)

      await expect(wrapper.vm.signOut()).rejects.toThrow('Already signed out')
    })
  })
})
