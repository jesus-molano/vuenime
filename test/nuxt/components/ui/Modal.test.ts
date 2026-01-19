import { describe, it, expect, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Modal from '~/components/ui/Modal.vue'

// Note: Modal uses Teleport which renders content to document.body

describe('Modal', () => {
  afterEach(() => {
    // Clean up any teleported content
    const modalWrappers = document.body.querySelectorAll('.modal-wrapper')
    modalWrappers.forEach((el) => el.remove())
  })

  describe('visibility', () => {
    it('should not render dialog when open is false', async () => {
      await mountSuspended(Modal, {
        props: { open: false },
      })

      const dialog = document.body.querySelector('[role="dialog"]')
      expect(dialog).toBeNull()
    })

    it('should render dialog when open is true', async () => {
      await mountSuspended(Modal, {
        props: { open: true },
        slots: { default: 'Modal content' },
      })

      const dialog = document.body.querySelector('[role="dialog"]')
      expect(dialog).toBeTruthy()
    })
  })

  describe('close button', () => {
    it('should show close button by default', async () => {
      await mountSuspended(Modal, {
        props: { open: true },
      })

      const closeButton = document.body.querySelector('.modal-wrapper button')
      expect(closeButton).toBeTruthy()
    })
  })

  describe('accessibility', () => {
    it('should have role="dialog" and aria-modal="true"', async () => {
      await mountSuspended(Modal, {
        props: { open: true },
      })

      const dialog = document.body.querySelector('[role="dialog"]')
      expect(dialog).toBeTruthy()
      expect(dialog?.getAttribute('aria-modal')).toBe('true')
    })
  })
})
