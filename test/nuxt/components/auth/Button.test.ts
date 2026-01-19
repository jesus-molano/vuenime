import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { ref, computed } from 'vue'
import AuthButton from '~/components/auth/Button.vue'

// Mock state
const mockUser = ref<{ email: string; user_metadata?: { avatar_url?: string } } | null>(null)
const mockIsAuthenticated = computed(() => !!mockUser.value)
const mockSignOut = vi.fn()

// Mock useAuth composable - must mock the actual file path
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    signOut: mockSignOut,
  }),
}))

describe('AuthButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser.value = null
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

    it('should have correct icon name for sign in', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.props('name')).toBe('i-heroicons-user-circle')
    })

    it('should open modal on click', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const button = wrapper.find('button')
      await button.trigger('click')

      // AuthModal should be present
      const modal = wrapper.findComponent({ name: 'AuthModal' })
      expect(modal.exists()).toBe(true)
    })

    it('should not render dropdown menu when not authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      expect(dropdown.exists()).toBe(false)
    })

    it('should not render avatar when not authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.exists()).toBe(false)
    })

    it('should have group styling class', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const button = wrapper.find('button')
      expect(button.classes()).toContain('group')
    })

    it('should have iris color styling', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const button = wrapper.find('button')
      expect(button.classes().some((c) => c.includes('rp-iris'))).toBe(true)
    })
  })

  describe('authenticated state', () => {
    beforeEach(() => {
      mockUser.value = {
        email: 'test@example.com',
        user_metadata: {
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }
    })

    it('should render dropdown menu when authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      expect(dropdown.exists()).toBe(true)
    })

    it('should render avatar when authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.exists()).toBe(true)
    })

    it('should pass avatar_url to UAvatar src prop', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.props('src')).toBe('https://example.com/avatar.jpg')
    })

    it('should pass email as alt text to UAvatar', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.props('alt')).toBe('test@example.com')
    })

    it('should use "User" as fallback alt when no email', async () => {
      mockUser.value = { email: '', user_metadata: {} }
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.props('alt')).toBe('User')
    })

    it('should not render sign in button when authenticated', async () => {
      const wrapper = await mountSuspended(AuthButton)
      // The button inside dropdown is different from the sign-in button
      const signInButton = wrapper.find('button.group')
      expect(signInButton.exists()).toBe(false)
    })

    it('should have aria-label with email on trigger button', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const triggerButton = wrapper.find('button[type="button"]')
      expect(triggerButton.attributes('aria-label')).toBe('test@example.com')
    })

    it('should have avatar size sm', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.props('size')).toBe('sm')
    })
  })

  describe('authenticated state without avatar', () => {
    beforeEach(() => {
      mockUser.value = {
        email: 'noavatar@example.com',
        user_metadata: {},
      }
    })

    it('should render avatar even without avatar_url', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.exists()).toBe(true)
    })

    it('should pass undefined src when no avatar_url', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const avatar = wrapper.findComponent({ name: 'UAvatar' })
      expect(avatar.props('src')).toBeUndefined()
    })
  })

  describe('dropdown menu structure', () => {
    beforeEach(() => {
      mockUser.value = {
        email: 'menu@example.com',
        user_metadata: {
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }
    })

    it('should have dropdown aligned to end', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      expect(dropdown.props('content')).toEqual({ align: 'end' })
    })

    it('should have items prop as array of arrays', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')
      expect(Array.isArray(items)).toBe(true)
      expect(items.length).toBe(2)
      expect(Array.isArray(items[0])).toBe(true)
      expect(Array.isArray(items[1])).toBe(true)
    })

    it('should have email item disabled', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')
      expect(items[0][0].disabled).toBe(true)
    })

    it('should have email label in first menu group', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')
      expect(items[0][0].label).toBe('menu@example.com')
    })

    it('should have sign out item with icon', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')
      expect(items[1][0].icon).toBe('i-heroicons-arrow-right-on-rectangle')
    })

    it('should have sign out item with onSelect handler', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')
      expect(typeof items[1][0].onSelect).toBe('function')
    })

    it('should call signOut when sign out item is selected', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const dropdown = wrapper.findComponent({ name: 'UDropdownMenu' })
      const items = dropdown.props('items')

      // Call the onSelect handler directly
      items[1][0].onSelect()

      expect(mockSignOut).toHaveBeenCalledOnce()
    })
  })

  describe('AuthModal integration', () => {
    it('should render AuthModal component', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const modal = wrapper.findComponent({ name: 'AuthModal' })
      expect(modal.exists()).toBe(true)
    })

    it('should pass v-model to AuthModal', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const modal = wrapper.findComponent({ name: 'AuthModal' })
      expect(modal.props('modelValue')).toBeDefined()
    })

    it('should set modal open state when sign in button clicked', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const button = wrapper.find('button')
      await button.trigger('click')

      const modal = wrapper.findComponent({ name: 'AuthModal' })
      // After click, the modal should be open (modelValue = true)
      expect(modal.props('modelValue')).toBe(true)
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

    it('should have type button on all buttons', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const buttons = wrapper.findAll('button')
      buttons.forEach((button) => {
        expect(button.attributes('type')).toBe('button')
      })
    })

    it('should have focus-visible ring styling', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const button = wrapper.find('button')
      expect(button.classes().some((c) => c.includes('focus-visible'))).toBe(true)
    })
  })

  describe('responsive behavior', () => {
    it('should have hidden text on mobile', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const hiddenText = wrapper.find('.hidden.sm\\:inline')
      expect(hiddenText.exists()).toBe(true)
    })

    it('should have different icon sizes for mobile and desktop', async () => {
      const wrapper = await mountSuspended(AuthButton)
      const icon = wrapper.findComponent({ name: 'UIcon' })
      expect(icon.classes()).toContain('size-6')
      expect(icon.classes()).toContain('sm:size-4')
    })
  })

  describe('styling', () => {
    describe('unauthenticated button', () => {
      it('should have rounded-xl class', async () => {
        const wrapper = await mountSuspended(AuthButton)
        const button = wrapper.find('button')
        expect(button.classes()).toContain('rounded-xl')
      })

      it('should have bg-rp-iris/10 class', async () => {
        const wrapper = await mountSuspended(AuthButton)
        const button = wrapper.find('button')
        expect(button.classes()).toContain('bg-rp-iris/10')
      })

      it('should have hover effect class', async () => {
        const wrapper = await mountSuspended(AuthButton)
        const button = wrapper.find('button')
        expect(button.classes()).toContain('hover:bg-rp-iris/20')
      })
    })

    describe('authenticated button', () => {
      beforeEach(() => {
        mockUser.value = {
          email: 'styled@example.com',
          user_metadata: { avatar_url: 'https://example.com/avatar.jpg' },
        }
      })

      it('should have rounded-full class on trigger', async () => {
        const wrapper = await mountSuspended(AuthButton)
        const button = wrapper.find('button')
        expect(button.classes()).toContain('rounded-full')
      })

      it('should have hover ring effect', async () => {
        const wrapper = await mountSuspended(AuthButton)
        const button = wrapper.find('button')
        expect(button.classes().some((c) => c.includes('hover:ring'))).toBe(true)
      })
    })
  })
})
