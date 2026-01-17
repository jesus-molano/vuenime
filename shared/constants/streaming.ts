export interface StreamingPlatformConfig {
  icon: string
  classes: string
}

export const STREAMING_PLATFORMS: Record<string, StreamingPlatformConfig> = {
  crunchyroll: {
    icon: 'i-simple-icons-crunchyroll',
    classes: 'bg-crunchyroll text-white',
  },
  netflix: {
    icon: 'i-simple-icons-netflix',
    classes: 'bg-netflix text-white',
  },
  hulu: {
    icon: 'i-simple-icons-hulu',
    classes: 'bg-hulu text-black',
  },
  'amazon prime': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-prime text-white',
  },
  'prime video': {
    icon: 'i-simple-icons-primevideo',
    classes: 'bg-prime text-white',
  },
  funimation: {
    icon: 'i-simple-icons-funimation',
    classes: 'bg-funimation text-white',
  },
  'disney+': {
    icon: 'i-simple-icons-disneyplus',
    classes: 'bg-disney text-white',
  },
  'hbo max': {
    icon: 'i-simple-icons-hbo',
    classes: 'bg-hbo text-white',
  },
  'tubi tv': {
    icon: 'i-heroicons-tv',
    classes: 'bg-tubi text-white',
  },
  hidive: {
    icon: 'i-heroicons-play',
    classes: 'bg-hidive text-white',
  },
}

export const DEFAULT_STREAMING_CONFIG: StreamingPlatformConfig = {
  icon: 'i-heroicons-play-circle',
  classes: 'bg-rp-surface text-white hover:bg-rp-overlay',
}

export function getStreamingPlatformConfig(name: string): StreamingPlatformConfig {
  return STREAMING_PLATFORMS[name.toLowerCase()] || DEFAULT_STREAMING_CONFIG
}
