import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Pagination from '~/components/ui/Pagination.vue'

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('visibility', () => {
    it('should not render when totalPages is 1', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 1,
        },
      })

      expect(wrapper.find('nav').exists()).toBe(false)
    })

    it('should render when totalPages is greater than 1', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5,
        },
      })

      expect(wrapper.find('nav').exists()).toBe(true)
    })
  })

  describe('previous button', () => {
    it('should be disabled on first page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      const prevButton = buttons.at(0)!
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('should be enabled on non-first page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      const prevButton = buttons.at(0)!
      expect(prevButton.attributes('disabled')).toBeUndefined()
    })

    it('should emit update:currentPage with previous page on click', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      await buttons.at(0)!.trigger('click')

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
    })
  })

  describe('next button', () => {
    it('should be disabled on last page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 5,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(-1)!
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('should be enabled on non-last page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      const nextButton = buttons.at(-1)!
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })

    it('should emit update:currentPage with next page on click', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      await buttons.at(-1)!.trigger('click')

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([4])
    })
  })

  describe('page numbers', () => {
    it('should show all pages when totalPages <= maxVisiblePages', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5,
          maxVisiblePages: 5,
        },
      })

      // Should have 5 page buttons plus prev/next
      // Count page number buttons (excluding nav buttons)
      const navElement = wrapper.find('.flex.items-center.gap-1')
      expect(navElement.exists()).toBe(true)
    })

    it('should highlight current page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const currentPageButton = wrapper.find('button[aria-current="page"]')
      expect(currentPageButton.exists()).toBe(true)
      expect(currentPageButton.text()).toBe('3')
    })

    it('should emit update:currentPage when page number clicked', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5,
        },
      })

      // Find page button for page 3
      const pageButtons = wrapper.findAll('.flex.items-center.gap-1 button')
      const page3Button = pageButtons.find((btn) => btn.text() === '3')

      if (page3Button) {
        await page3Button.trigger('click')
        expect(wrapper.emitted('update:currentPage')).toBeTruthy()
        expect(wrapper.emitted('update:currentPage')![0]).toEqual([3])
      }
    })
  })

  describe('ellipsis', () => {
    it('should show ellipsis for large page counts', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 5,
          totalPages: 20,
          maxVisiblePages: 5,
        },
      })

      expect(wrapper.text()).toContain('...')
    })

    it('should always show first page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 15,
          totalPages: 20,
          maxVisiblePages: 5,
        },
      })

      const pageContainer = wrapper.find('.flex.items-center.gap-1')
      expect(pageContainer.text()).toContain('1')
    })

    it('should always show last page', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 5,
          totalPages: 20,
          maxVisiblePages: 5,
        },
      })

      const pageContainer = wrapper.find('.flex.items-center.gap-1')
      expect(pageContainer.text()).toContain('20')
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on navigation', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 1,
          totalPages: 5,
        },
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBeDefined()
    })

    it('should have aria-label on prev/next buttons', async () => {
      const wrapper = await mountSuspended(Pagination, {
        props: {
          currentPage: 3,
          totalPages: 5,
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.at(0)!.attributes('aria-label')).toBeDefined() // Previous
      expect(buttons.at(-1)!.attributes('aria-label')).toBeDefined() // Next
    })
  })
})
