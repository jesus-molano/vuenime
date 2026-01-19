import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NewsCard from '~/components/anime/detail/NewsCard.vue'
import type { NewsItem } from '~~/shared/types'

const createMockNewsItem = (overrides: Partial<NewsItem> = {}): NewsItem => ({
  mal_id: 1,
  url: 'https://myanimelist.net/news/12345',
  title: 'New Anime Season Announced',
  date: '2024-01-15T10:30:00+00:00',
  author_username: 'anime_news_bot',
  excerpt: 'The highly anticipated anime has been confirmed for a new season.',
  images: { jpg: { image_url: 'https://cdn.myanimelist.net/news/image.jpg' } },
  comments: 42,
  ...overrides,
})

describe('NewsCard', () => {
  describe('rendering', () => {
    it('should render as anchor element with article inside', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem() },
      })

      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('article').exists()).toBe(true)
    })

    it('should render news title', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ title: 'Breaking Anime News' }) },
      })

      expect(wrapper.find('h4').text()).toBe('Breaking Anime News')
    })
  })

  describe('link attributes', () => {
    it('should have correct href and security attributes', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ url: 'https://example.com/news' }) },
      })

      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('https://example.com/news')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
      expect(link.attributes('rel')).toContain('noreferrer')
    })
  })

  describe('conditional rendering', () => {
    it('should render thumbnail when image is available', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: {
          news: createMockNewsItem({
            images: { jpg: { image_url: 'https://example.com/thumb.jpg' } },
          }),
        },
      })

      expect(wrapper.find('img').exists()).toBe(true)
    })

    it('should render excerpt when available', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ excerpt: 'This is the news excerpt.' }) },
      })

      expect(wrapper.text()).toContain('This is the news excerpt.')
    })

    it('should render author username', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ author_username: 'anime_fan_123' }) },
      })

      expect(wrapper.text()).toContain('anime_fan_123')
    })

    it('should render comment count when greater than zero', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ comments: 15 }) },
      })

      expect(wrapper.text()).toContain('15')
    })

    it('should not render comment count when zero', async () => {
      const wrapper = await mountSuspended(NewsCard, {
        props: { news: createMockNewsItem({ comments: 0 }) },
      })

      expect(wrapper.html()).not.toContain('chat-bubble-left')
    })
  })
})
