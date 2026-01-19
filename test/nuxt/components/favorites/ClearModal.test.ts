import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClearModal from '~/components/favorites/ClearModal.vue'

// Stub UiModal to simplify testing
const UiModalStub = {
  name: 'UiModal',
  props: ['open', 'contentClass'],
  emits: ['update:open'],
  template: '<div v-if="open"><slot /></div>',
}

describe('ClearModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountModal = (open = true) =>
    mountSuspended(ClearModal, {
      props: { open },
      global: {
        stubs: {
          UiModal: UiModalStub,
        },
      },
    })

  describe('rendering', () => {
    it('should render when open is true', async () => {
      const wrapper = await mountModal(true)

      expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)
    })

    it('should not render content when open is false', async () => {
      const wrapper = await mountModal(false)

      expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
    })

    it('should render title and description', async () => {
      const wrapper = await mountModal(true)

      expect(wrapper.find('#clear-dialog-title').exists()).toBe(true)
      expect(wrapper.find('#clear-dialog-desc').exists()).toBe(true)
    })

    it('should render cancel and confirm buttons', async () => {
      const wrapper = await mountModal(true)

      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('events', () => {
    it('should emit update:open false when cancel is clicked', async () => {
      const wrapper = await mountModal(true)

      const cancelButton = wrapper.findAll('button').at(0)!
      await cancelButton.trigger('click')

      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })

    it('should emit confirm and update:open when confirm is clicked', async () => {
      const wrapper = await mountModal(true)

      const confirmButton = wrapper.findAll('button').at(1)!
      await confirmButton.trigger('click')

      expect(wrapper.emitted('confirm')).toBeTruthy()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })
  })

  describe('accessibility', () => {
    it('should have alertdialog role', async () => {
      const wrapper = await mountModal(true)

      expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)
    })

    it('should have aria-describedby on dialog', async () => {
      const wrapper = await mountModal(true)

      const dialog = wrapper.find('[role="alertdialog"]')
      expect(dialog.attributes('aria-describedby')).toBe('clear-dialog-desc')
    })
  })
})
