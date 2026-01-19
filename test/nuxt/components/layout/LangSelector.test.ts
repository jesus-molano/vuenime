import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LangSelector from '~/components/layout/LangSelector.vue'

// Mock i18n and preferences store
vi.mock('#imports', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#imports')>()
  return {
    ...actual,
    useI18n: vi.fn(() => ({
      locale: ref('en'),
      locales: ref([
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Espanol' },
        { code: 'ja', name: 'Japanese' },
      ]),
      setLocale: vi.fn(),
    })),
    usePreferencesStore: vi.fn(() => ({
      setLocale: vi.fn(),
    })),
  }
})

describe('LangSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(LangSelector)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render toggle button', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
    })

    it('should display current locale', async () => {
      const wrapper = await mountSuspended(LangSelector)

      expect(wrapper.text()).toContain('en')
    })
  })

  describe('dropdown behavior', () => {
    it('should not show dropdown initially', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const menu = wrapper.find('[role="menu"]')
      expect(menu.exists()).toBe(false)
    })

    it('should toggle dropdown on button click', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      await button.trigger('click')

      const menu = wrapper.find('[role="menu"]')
      expect(menu.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-expanded on toggle button', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      expect(button.attributes('aria-expanded')).toBeDefined()
    })

    it('should have aria-haspopup on toggle button', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      expect(button.attributes('aria-haspopup')).toBe('menu')
    })

    it('should have aria-label on toggle button', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })

    it('should render menu items with role menuitem', async () => {
      const wrapper = await mountSuspended(LangSelector)

      const button = wrapper.find('button')
      await button.trigger('click')

      const menuItems = wrapper.findAll('[role="menuitem"]')
      expect(menuItems.length).toBeGreaterThan(0)
    })
  })
})
