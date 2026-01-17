/**
 * VueNime Theme - Inspired by Rosé Pine
 * https://rosepinetheme.com/
 *
 * A dark, elegant palette with warm rose accents
 */

export const ROSE_PINE = {
  // Base colors
  base: '#191724',
  surface: '#1f1d2e',
  overlay: '#26233a',

  // Muted colors
  muted: '#6e6a86',
  subtle: '#908caa',

  // Text colors
  text: '#e0def4',

  // Accent colors
  love: '#eb6f92', // Red/Pink - errors, hearts, favorites
  gold: '#f6c177', // Yellow/Orange - warnings, stars, scores
  rose: '#ebbcba', // Rose - primary accent
  pine: '#31748f', // Teal - links, info
  foam: '#9ccfd8', // Cyan - success, highlights
  iris: '#c4a7e7', // Purple - secondary accent
} as const

// Semantic color mapping for the app
export const THEME = {
  // Score colors based on rating
  score: {
    high: 'text-[#f6c177]', // gold - >= 8
    medium: 'text-[#ebbcba]', // rose - >= 6
    low: 'text-[#eb6f92]', // love - < 6
  },

  // Badge variants
  badge: {
    airing: 'bg-[#31748f]/90 text-white', // pine
    completed: 'bg-[#9ccfd8]/90 text-[#191724]', // foam
    upcoming: 'bg-[#c4a7e7]/90 text-[#191724]', // iris
    score: 'bg-gradient-to-r from-[#f6c177] to-[#eb6f92]', // gold to love
  },

  // Card styles
  card: {
    base: 'bg-[#1f1d2e] border border-[#26233a]',
    hover: 'hover:border-[#c4a7e7]/50 hover:shadow-lg hover:shadow-[#c4a7e7]/10',
  },

  // Text styles
  text: {
    primary: 'text-[#e0def4]',
    secondary: 'text-[#908caa]',
    muted: 'text-[#6e6a86]',
    accent: 'text-[#c4a7e7]',
    link: 'text-[#31748f] hover:text-[#9ccfd8]',
  },

  // Background styles
  bg: {
    base: 'bg-[#191724]',
    surface: 'bg-[#1f1d2e]',
    overlay: 'bg-[#26233a]',
  },

  // Border styles
  border: {
    default: 'border-[#26233a]',
    accent: 'border-[#c4a7e7]',
  },

  // Gradient overlays
  gradient: {
    card: 'bg-gradient-to-t from-[#191724]/95 via-[#191724]/50 to-transparent',
    hero: 'bg-gradient-to-b from-[#c4a7e7]/10 to-transparent',
  },

  // Button variants
  button: {
    primary: 'bg-[#c4a7e7] text-[#191724] hover:bg-[#c4a7e7]/90',
    secondary: 'bg-[#26233a] text-[#e0def4] hover:bg-[#26233a]/80',
    ghost: 'text-[#908caa] hover:text-[#e0def4] hover:bg-[#26233a]',
  },

  // Focus states (accessibility)
  focus: {
    ring: 'focus-visible:ring-2 focus-visible:ring-[#c4a7e7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191724]',
  },
} as const

// Helper function to get score color based on value
export const getScoreColor = (score: number | null): string => {
  if (!score) return THEME.text.muted
  if (score >= 8) return THEME.score.high
  if (score >= 6) return THEME.score.medium
  return THEME.score.low
}

// Helper function to get status badge style
export const getStatusBadge = (status: string | null): string => {
  switch (status?.toLowerCase()) {
    case 'currently airing':
      return THEME.badge.airing
    case 'finished airing':
      return THEME.badge.completed
    case 'not yet aired':
      return THEME.badge.upcoming
    default:
      return THEME.badge.completed
  }
}
