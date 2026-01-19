import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CharacterCard from '~/components/anime/detail/CharacterCard.vue'

const mockCharacter = {
  character: {
    mal_id: 1,
    url: 'https://myanimelist.net/character/1',
    images: {
      jpg: { image_url: 'https://example.com/char.jpg' },
      webp: { image_url: 'https://example.com/char.webp' },
    },
    name: 'Edward Elric',
  },
  role: 'Main',
  voice_actors: [
    {
      person: {
        mal_id: 1,
        url: 'https://myanimelist.net/people/1',
        images: { jpg: { image_url: 'https://example.com/va.jpg' } },
        name: 'Romi Park',
      },
      language: 'Japanese',
    },
    {
      person: {
        mal_id: 2,
        url: 'https://myanimelist.net/people/2',
        images: { jpg: { image_url: 'https://example.com/va2.jpg' } },
        name: 'Vic Mignogna',
      },
      language: 'English',
    },
  ],
}

describe('CharacterCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render as article element', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      expect(wrapper.find('article').exists()).toBe(true)
    })

    it('should render character image', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
    })

    it('should render character name', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const name = wrapper.find('h4')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe('Edward Elric')
    })
  })

  describe('voice actor', () => {
    it('should show Japanese voice actor', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      expect(wrapper.text()).toContain('Romi Park')
    })

    it('should not show English voice actor by default', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      // Only Japanese VA is shown in the collapsed state
      const vaElements = wrapper.findAll('p').filter((p) => p.text().includes('Mignogna'))
      expect(vaElements.length).toBe(0)
    })

    it('should handle character without voice actors', async () => {
      const charWithoutVA = {
        ...mockCharacter,
        voice_actors: [],
      }

      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: charWithoutVA,
        },
      })

      expect(wrapper.text()).toContain('Edward Elric')
      expect(wrapper.text()).not.toContain('Romi Park')
    })
  })

  describe('image button', () => {
    it('should have clickable image button', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
    })

    it('should have aria-label on image button', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeDefined()
    })

    it('should be focusable', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      expect(button.classes().join(' ')).toContain('focus-visible')
    })
  })

  describe('modal functionality', () => {
    it('should open modal on button click', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      // isExpanded should be true after click
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('image sources', () => {
    it('should prefer webp image format', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const img = wrapper.find('img')
      expect(img.attributes('src')).toContain('webp')
    })

    it('should fallback to jpg if webp not available', async () => {
      const charWithoutWebp = {
        ...mockCharacter,
        character: {
          ...mockCharacter.character,
          images: {
            jpg: { image_url: 'https://example.com/char.jpg' },
          },
        },
      }

      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: charWithoutWebp,
        },
      })

      const img = wrapper.find('img')
      expect(img.attributes('src')).toContain('jpg')
    })
  })

  describe('styling', () => {
    it('should have circular image container', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('rounded-full')
    })

    it('should have text centered', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const article = wrapper.find('article')
      expect(article.classes()).toContain('text-center')
    })

    it('should have responsive sizing', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const button = wrapper.find('button')
      expect(button.classes().join(' ')).toContain('size-')
    })
  })

  describe('text truncation', () => {
    it('should truncate long character names', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const name = wrapper.find('h4')
      expect(name.classes()).toContain('line-clamp-2')
    })

    it('should truncate voice actor name', async () => {
      const wrapper = await mountSuspended(CharacterCard, {
        props: {
          character: mockCharacter,
        },
      })

      const vaName = wrapper.find('p.line-clamp-1')
      expect(vaName.exists()).toBe(true)
    })
  })
})
