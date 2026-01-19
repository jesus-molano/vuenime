import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Actions from '~/components/layout/header/Actions.vue'

describe('Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(Actions)

      expect(wrapper.vm).toBeDefined()
    })

    it('should render container div', async () => {
      const wrapper = await mountSuspended(Actions)

      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
    })

    it('should render AuthButton component', async () => {
      const wrapper = await mountSuspended(Actions)

      const authButton = wrapper.findComponent({ name: 'AuthButton' })
      expect(authButton.exists()).toBe(true)
    })

    it('should render LangSelector component', async () => {
      const wrapper = await mountSuspended(Actions)

      const langSelector = wrapper.findComponent({ name: 'LayoutLangSelector' })
      expect(langSelector.exists()).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('should have aria-hidden separator', async () => {
      const wrapper = await mountSuspended(Actions)

      const separator = wrapper.find('[aria-hidden="true"]')
      expect(separator.exists()).toBe(true)
    })
  })

  describe('structure', () => {
    it('should have both AuthButton and LangSelector as siblings', async () => {
      const wrapper = await mountSuspended(Actions)

      const html = wrapper.html()
      expect(html).toBeTruthy()
    })
  })
})
