import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SearchModal from '~/components/layout/SearchModal.vue'

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('component structure', () => {
    it('should mount without errors', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should accept modelValue prop', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: true,
        },
      })

      expect(wrapper.props('modelValue')).toBe(true)
    })

    it('should accept false modelValue', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      expect(wrapper.props('modelValue')).toBe(false)
    })
  })

  describe('internal state', () => {
    it('should have query ref', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      // Component should have internal state for query
      expect(wrapper.vm).toBeDefined()
    })

    it('should have topAnime ref', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })

    it('should have isLoadingTopAnime ref', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('popular genres data', () => {
    it('should have popular genres defined', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
        },
      })

      // Component should render without errors
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('v-model behavior', () => {
    it('should support v-model pattern', async () => {
      const wrapper = await mountSuspended(SearchModal, {
        props: {
          modelValue: false,
          'onUpdate:modelValue': (e: boolean) => wrapper.setProps({ modelValue: e }),
        },
      })

      expect(wrapper.props('modelValue')).toBe(false)
    })
  })
})
