import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InfoCard from '~/components/anime/detail/InfoCard.vue'

describe('InfoCard', () => {
  const defaultProps = {
    icon: 'i-heroicons-star',
    label: 'Score',
    value: '8.5',
  }

  it('should render card with label and value', async () => {
    const wrapper = await mountSuspended(InfoCard, { props: defaultProps })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.text()).toContain('Score')
    expect(wrapper.text()).toContain('8.5')
  })

  it('should accept icon, label, and value props', async () => {
    const wrapper = await mountSuspended(InfoCard, {
      props: {
        icon: 'i-heroicons-trophy',
        label: 'Rank',
        value: '#100',
      },
    })

    expect(wrapper.props('icon')).toBe('i-heroicons-trophy')
    expect(wrapper.props('label')).toBe('Rank')
    expect(wrapper.props('value')).toBe('#100')
  })

  it('should accept value as string or number', async () => {
    const wrapperStr = await mountSuspended(InfoCard, {
      props: { ...defaultProps, value: '8.5' },
    })
    expect(wrapperStr.props('value')).toBe('8.5')

    const wrapperNum = await mountSuspended(InfoCard, {
      props: { ...defaultProps, label: 'Episodes', value: 24 },
    })
    expect(wrapperNum.props('value')).toBe(24)
  })

  it('should accept optional valueClass prop', async () => {
    const wrapper = await mountSuspended(InfoCard, {
      props: { ...defaultProps, valueClass: 'text-rp-gold' },
    })

    expect(wrapper.props('valueClass')).toBe('text-rp-gold')
  })

  it('should display values correctly', async () => {
    const testCases = [
      { label: 'Episodes', value: 24, expected: '24' },
      { label: 'Aired', value: 'Jan 2024', expected: 'Jan 2024' },
      { label: 'Rank', value: '#5', expected: '#5' },
      { label: 'Score', value: '8.75', expected: '8.75' },
    ]

    for (const { label, value, expected } of testCases) {
      const wrapper = await mountSuspended(InfoCard, {
        props: { icon: 'i-heroicons-star', label, value },
      })
      expect(wrapper.find('p').text()).toBe(expected)
    }
  })
})
