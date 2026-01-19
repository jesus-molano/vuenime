import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CharacterCard from '~/components/anime/detail/CharacterCard.vue'
import type { Character } from '~~/shared/types/anime'

const mockCharacter: Character = {
  character: {
    mal_id: 1,
    name: 'Edward Elric',
    images: {
      jpg: { image_url: 'https://example.com/char.jpg' },
      webp: { image_url: 'https://example.com/char.webp' },
    },
  },
  role: 'Main',
  voice_actors: [
    {
      person: {
        mal_id: 1,
        name: 'Romi Park',
        images: { jpg: { image_url: 'https://example.com/va.jpg' } },
      },
      language: 'Japanese',
    },
  ],
}

describe('CharacterCard', () => {
  it('should render character name and image', async () => {
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: mockCharacter },
    })

    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('h4').text()).toBe('Edward Elric')
  })

  it('should show Japanese voice actor', async () => {
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: mockCharacter },
    })

    expect(wrapper.text()).toContain('Romi Park')
  })

  it('should handle character without voice actors', async () => {
    const charWithoutVA: Character = { ...mockCharacter, voice_actors: [] }
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: charWithoutVA },
    })

    expect(wrapper.text()).toContain('Edward Elric')
    expect(wrapper.text()).not.toContain('Romi Park')
  })

  it('should have clickable image button with aria-label', async () => {
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: mockCharacter },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('aria-label')).toBeDefined()
  })

  it('should prefer webp image format', async () => {
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: mockCharacter },
    })

    expect(wrapper.find('img').attributes('src')).toContain('webp')
  })

  it('should fallback to jpg if webp not available', async () => {
    // Use type assertion to test edge case where webp might be missing at runtime
    const charWithoutWebp = {
      ...mockCharacter,
      character: {
        ...mockCharacter.character,
        images: { jpg: { image_url: 'https://example.com/char.jpg' } },
      },
    } as unknown as Character
    const wrapper = await mountSuspended(CharacterCard, {
      props: { character: charWithoutWebp },
    })

    expect(wrapper.find('img').attributes('src')).toContain('jpg')
  })
})
