import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref, nextTick } from 'vue'
import { useShowMore } from '~/composables/useShowMore'

const TestComponent = defineComponent({
  props: {
    items: { type: Array, default: () => [] },
    initialCount: { type: Number, default: 10 },
    pageSize: { type: Number, default: undefined },
    showAll: { type: Boolean, default: false },
  },
  setup(props) {
    const items = ref(props.items as string[])
    const { displayedItems, hasMore, remainingCount, loadMore, reset } = useShowMore(items, {
      initialCount: props.initialCount,
      pageSize: props.pageSize,
      showAll: props.showAll,
    })
    return { items, displayedItems, hasMore, remainingCount, loadMore, reset }
  },
  render() {
    return h('div', { class: 'test-component' }, [
      h('span', { id: 'displayed-count' }, String(this.displayedItems.length)),
      h('span', { id: 'has-more' }, this.hasMore ? 'true' : 'false'),
      h('span', { id: 'remaining' }, String(this.remainingCount)),
      h('button', { id: 'load-more-btn', onClick: this.loadMore }, 'Load More'),
      h('button', { id: 'reset-btn', onClick: this.reset }, 'Reset'),
    ])
  },
})

describe('useShowMore (Nuxt)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should display initialCount items', async () => {
      const items = Array.from({ length: 20 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.displayedItems.length).toBe(10)
    })

    it('should display all items if less than initialCount', async () => {
      const items = Array.from({ length: 5 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.displayedItems.length).toBe(5)
    })
  })

  describe('hasMore computed', () => {
    it('should return true when there are more items', async () => {
      const items = Array.from({ length: 20 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.hasMore).toBe(true)
    })

    it('should return false when all items are displayed', async () => {
      const items = Array.from({ length: 5 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.hasMore).toBe(false)
    })
  })

  describe('remainingCount computed', () => {
    it('should return correct remaining count', async () => {
      const items = Array.from({ length: 25 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.remainingCount).toBe(15)
    })
  })

  describe('loadMore function', () => {
    it('should load more items', async () => {
      const items = Array.from({ length: 30 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      expect(wrapper.vm.displayedItems.length).toBe(10)

      wrapper.vm.loadMore()
      await nextTick()

      expect(wrapper.vm.displayedItems.length).toBe(20)
    })

    it('should use custom pageSize', async () => {
      const items = Array.from({ length: 30 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10, pageSize: 5 },
      })

      wrapper.vm.loadMore()
      await nextTick()

      expect(wrapper.vm.displayedItems.length).toBe(15)
    })
  })

  describe('reset function', () => {
    it('should reset to initial count', async () => {
      const items = Array.from({ length: 30 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10 },
      })

      wrapper.vm.loadMore()
      wrapper.vm.loadMore()
      await nextTick()
      expect(wrapper.vm.displayedItems.length).toBe(30)

      wrapper.vm.reset()
      await nextTick()
      expect(wrapper.vm.displayedItems.length).toBe(10)
    })
  })

  describe('showAll mode', () => {
    it('should show all items when loadMore called in showAll mode', async () => {
      const items = Array.from({ length: 30 }, (_, i) => `item-${i}`)
      const wrapper = await mountSuspended(TestComponent, {
        props: { items, initialCount: 10, showAll: true },
      })

      expect(wrapper.vm.displayedItems.length).toBe(10)

      wrapper.vm.loadMore()
      await nextTick()

      expect(wrapper.vm.displayedItems.length).toBe(30)
    })
  })
})
