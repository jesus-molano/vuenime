import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ReviewCard from '~/components/anime/detail/ReviewCard.vue'
import type { Review } from '~~/shared/types'

const createMockReview = (overrides: Partial<Review> = {}): Review => ({
  mal_id: 1,
  user: {
    username: 'anime_reviewer',
    images: { jpg: { image_url: 'https://example.com/avatar.jpg' } },
  },
  score: 9,
  review: 'This is an excellent anime with great animation and storytelling.',
  date: '2024-01-15T10:30:00+00:00',
  tags: ['Recommended', 'Well-written'],
  reactions: { overall: 42 },
  ...overrides,
})

describe('ReviewCard', () => {
  describe('rendering', () => {
    it('should render article element', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview() },
      })

      expect(wrapper.find('article').exists()).toBe(true)
    })

    it('should render username', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ user: { username: 'test_user', images: { jpg: { image_url: '' } } } }) },
      })

      expect(wrapper.text()).toContain('test_user')
    })

    it('should render score with star icon', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ score: 8 }) },
      })

      expect(wrapper.text()).toContain('8')
      expect(wrapper.html()).toContain('star-solid')
    })

    it('should render review text', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ review: 'This anime is amazing!' }) },
      })

      expect(wrapper.text()).toContain('This anime is amazing!')
    })
  })

  describe('conditional rendering', () => {
    it('should render user avatar when available', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: {
          review: createMockReview({
            user: { username: 'test', images: { jpg: { image_url: 'https://example.com/avatar.jpg' } } },
          }),
        },
      })

      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('should render tags when available', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ tags: ['Recommended', 'Well-written'] }) },
      })

      expect(wrapper.text()).toContain('Recommended')
      expect(wrapper.text()).toContain('Well-written')
    })

    it('should render reactions when overall is greater than 0', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ reactions: { overall: 25 } }) },
      })

      expect(wrapper.text()).toContain('25')
      expect(wrapper.html()).toContain('hand-thumb-up')
    })

    it('should not render reactions when overall is 0', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ reactions: { overall: 0 } }) },
      })

      expect(wrapper.html()).not.toContain('hand-thumb-up')
    })
  })

  describe('expand/collapse', () => {
    it('should show read more button for long reviews', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ review: 'A'.repeat(350) }) },
      })

      expect(wrapper.find('button[type="button"]').exists()).toBe(true)
    })

    it('should not show read more button for short reviews', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ review: 'A'.repeat(200) }) },
      })

      expect(wrapper.find('button[type="button"]').exists()).toBe(false)
    })

    it('should toggle expand on click', async () => {
      const wrapper = await mountSuspended(ReviewCard, {
        props: { review: createMockReview({ review: 'A'.repeat(350) }) },
      })

      const reviewText = wrapper.find('p.text-sm.leading-relaxed')
      expect(reviewText.classes()).toContain('line-clamp-4')

      await wrapper.find('button[type="button"]').trigger('click')
      expect(reviewText.classes()).not.toContain('line-clamp-4')
    })
  })
})
